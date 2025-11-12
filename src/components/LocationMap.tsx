import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from 'sonner';

interface LocationMapProps {
  location: { lat: number; lng: number };
  mapboxToken: string;
}

interface SafePlace {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'shelter';
  coordinates: [number, number];
  distance?: number;
}

const LocationMap = ({ location, mapboxToken }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const safePlaceMarkers = useRef<mapboxgl.Marker[]>([]);
  const [safePlaces, setSafePlaces] = useState<SafePlace[]>([]);

  // Fetch nearby safe places
  const fetchNearbySafePlaces = async (lat: number, lng: number) => {
    try {
      const types = [
        { query: 'police station', type: 'police' as const },
        { query: 'hospital', type: 'hospital' as const },
        { query: 'women shelter', type: 'shelter' as const },
      ];

      const allPlaces: SafePlace[] = [];

      for (const { query, type } of types) {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${lng},${lat}&limit=3&access_token=${mapboxToken}`
        );
        const data = await response.json();

        if (data.features) {
          const places = data.features.map((feature: any, index: number) => ({
            id: `${type}-${index}`,
            name: feature.text || feature.place_name,
            type,
            coordinates: feature.center as [number, number],
            distance: feature.properties?.distance,
          }));
          allPlaces.push(...places);
        }
      }

      setSafePlaces(allPlaces);
      toast.success(`Found ${allPlaces.length} nearby safe places`);
    } catch (error) {
      console.error('Error fetching safe places:', error);
      toast.error('Unable to fetch nearby safe places');
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.lng, location.lat],
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add marker for user location
    marker.current = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([location.lng, location.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<p class="font-semibold text-base">Your Location</p><p class="text-sm text-gray-600">Emergency Alert Active</p>`)
      )
      .addTo(map.current);

    // Fetch nearby safe places
    fetchNearbySafePlaces(location.lat, location.lng);

    // Cleanup
    return () => {
      marker.current?.remove();
      safePlaceMarkers.current.forEach(m => m.remove());
      map.current?.remove();
    };
  }, [location, mapboxToken]);

  // Update marker position when location changes
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat([location.lng, location.lat]);
      map.current.setCenter([location.lng, location.lat]);
    }
  }, [location]);

  // Add safe place markers to map
  useEffect(() => {
    if (!map.current || safePlaces.length === 0) return;

    // Remove existing markers
    safePlaceMarkers.current.forEach(m => m.remove());
    safePlaceMarkers.current = [];

    const markerColors = {
      police: '#3b82f6', // blue
      hospital: '#10b981', // green
      shelter: '#8b5cf6', // purple
    };

    const markerIcons = {
      police: '🚓',
      hospital: '🏥',
      shelter: '🏠',
    };

    safePlaces.forEach((place) => {
      const el = document.createElement('div');
      el.className = 'safe-place-marker';
      el.style.backgroundColor = markerColors[place.type];
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';
      el.style.cursor = 'pointer';
      el.textContent = markerIcons[place.type];

      const popupContent = `
        <div class="p-2">
          <p class="font-semibold text-base mb-1">${place.name}</p>
          <p class="text-sm text-gray-600 capitalize">${place.type.replace('-', ' ')}</p>
        </div>
      `;

      const newMarker = new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(map.current!);

      safePlaceMarkers.current.push(newMarker);
    });
  }, [safePlaces]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-glow border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default LocationMap;

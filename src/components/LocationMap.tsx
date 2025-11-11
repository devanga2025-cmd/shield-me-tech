import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationMapProps {
  location: { lat: number; lng: number };
  mapboxToken: string;
}

const LocationMap = ({ location, mapboxToken }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.lng, location.lat],
      zoom: 15,
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
          .setHTML(`<p class="font-semibold">Your Location</p><p class="text-sm">Emergency Alert Active</p>`)
      )
      .addTo(map.current);

    // Cleanup
    return () => {
      marker.current?.remove();
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

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-glow border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default LocationMap;

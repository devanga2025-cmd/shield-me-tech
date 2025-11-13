import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from 'sonner';
import { getGoogleMapsApiKey } from '@/config/google-maps';

interface LocationMapProps {
  location?: { lat: number; lng: number };
}

interface SafePlace {
  id: string;
  name: string;
  type: 'police_station' | 'hospital' | 'shelter';
  location: { lat: number; lng: number };
  vicinity?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const LocationMap = ({ location }: LocationMapProps) => {
  // Default to Bangalore, India coordinates if no location provided
  const defaultLocation = { lat: 12.881362, lng: 77.7367596 };
  const mapCenter = location || defaultLocation;
  
  const [safePlaces, setSafePlaces] = useState<SafePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SafePlace | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = getGoogleMapsApiKey();
  const hasValidKey = !!apiKey && !/YOUR_GOOGLE_MAPS_API_KEY_HERE/i.test(String(apiKey));

  // Fetch nearby safe places using Google Places API
  const fetchNearbySafePlaces = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);
    const types = [
      { type: 'police', keyword: 'police_station' },
      { type: 'hospital', keyword: 'hospital' },
      { type: 'shelter', keyword: 'women shelter' },
    ];

    const allPlaces: SafePlace[] = [];
    let completedRequests = 0;

    types.forEach(({ type, keyword }) => {
      const request = {
        location: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
        radius: 5000, // 5km radius
        keyword: keyword,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places = results.slice(0, 3).map((place, index) => ({
            id: `${type}-${index}`,
            name: place.name || 'Unknown',
            type: type as 'police_station' | 'hospital' | 'shelter',
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
            vicinity: place.vicinity,
          }));
          allPlaces.push(...places);
        }

        completedRequests++;
        if (completedRequests === types.length) {
          setSafePlaces(allPlaces);
          if (allPlaces.length > 0) {
            toast.success(`Found ${allPlaces.length} nearby safe places`);
          }
        }
      });
    });
  };

  const getMarkerIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      police_station: '🚓',
      hospital: '🏥',
      shelter: '🏠',
    };
    return icons[type] || '📍';
  };

  const getMarkerColor = (type: string) => {
    const colors: { [key: string]: string } = {
      police_station: '#3b82f6', // blue
      hospital: '#10b981', // green
      shelter: '#8b5cf6', // purple
    };
    return colors[type] || '#ef4444';
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-glow border border-border">
      {!hasValidKey ? (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Google Maps API key not configured. Add a valid key in
            <code className="bg-muted px-1 py-0.5 rounded ml-1">src/config/google-maps.ts</code>
            or set VITE_GOOGLE_MAPS_API_KEY. Enable “Maps JavaScript API” and “Places API”, attach billing, and restrict by HTTP referrer.
          </p>
        </div>
      ) : (
        <LoadScript 
          googleMapsApiKey={apiKey} 
          libraries={['places']}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(false);
            toast.error('Google Maps failed to load. Check API key, billing, and referrer restrictions.');
          }}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
            onLoad={(map) => {
              fetchNearbySafePlaces(map);
            }}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {/* User location marker */}
            {isLoaded && location && (
              <Marker
                position={location}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#ef4444',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3,
                }}
                title="Your Location"
              />
            )}

            {/* Safe place markers */}
            {isLoaded && safePlaces.map((place) => (
              <Marker
                key={place.id}
                position={place.location}
                onClick={() => setSelectedPlace(place)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: getMarkerColor(place.type),
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3,
                }}
                label={{
                  text: getMarkerIcon(place.type),
                  fontSize: '16px',
                }}
              />
            ))}

            {/* Info window for selected place */}
            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.location}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div className="p-2">
                  <p className="font-semibold text-base mb-1">{selectedPlace.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedPlace.type.replace('_', ' ')}
                  </p>
                  {selectedPlace.vicinity && (
                    <p className="text-xs text-gray-500 mt-1">{selectedPlace.vicinity}</p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
      
      <p className="text-xs text-muted-foreground mt-2 text-center p-2">
        💡 Update your Google Maps API key in{' '}
        <code className="bg-muted px-1 py-0.5 rounded">src/config/google-maps.ts</code>
      </p>
    </div>
  );
};

export default LocationMap;

// Google Maps API Key
// Get your API key from: https://console.cloud.google.com/google/maps-apis
// This is a PUBLIC API key - safe to include in frontend code (with proper restrictions)
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// Alternative: Use environment variable if available (for Vite)
export const getGoogleMapsApiKey = () => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY;
};

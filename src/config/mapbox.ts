// Mapbox public access token
// Get your token from: https://account.mapbox.com/access-tokens/
// This is a PUBLIC token - safe to include in frontend code
export const MAPBOX_TOKEN = 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE';

// Alternative: Use environment variable if available (for Vite)
export const getMapboxToken = () => {
  return import.meta.env.VITE_MAPBOX_TOKEN || MAPBOX_TOKEN;
};

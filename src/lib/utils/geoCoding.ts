// lib/utils/geocoding.ts
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'your_google_maps_api_key';

/**
 * Converts latitude and longitude coordinates to a human-readable address
 * using Google Maps Geocoding API
 * 
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns A promise that resolves to the formatted address string
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            return data.results[0].formatted_address;
        }
        return '';
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return '';
    }
};

/**
 * Converts a text address to coordinates using Google Maps Geocoding API
 * 
 * @param address The address to geocode
 * @returns A promise that resolves to an object containing lat and lng coordinates
 */
export const geocode = async (address: string): Promise<{lat: number, lng: number} | null> => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`,
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};
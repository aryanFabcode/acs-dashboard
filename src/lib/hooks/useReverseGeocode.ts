// lib/hooks/useReverseGeocode.ts
import { useState, useEffect } from 'react';

type Coordinates = {
  lat: number;
  lng: number;
};

type GeocodingResult = {
  address: string;
  loading: boolean;
  error: string | null;
};

/**
 * A custom hook for reverse geocoding coordinates to human-readable addresses
 * @param coordinates Latitude and longitude coordinates
 * @param enabled Whether to enable the geocoding (defaults to true)
 * @returns Object containing address, loading state, and error
 */
export function useReverseGeocode(
  coordinates: Coordinates | null,
  enabled: boolean = true
): GeocodingResult {
  const [result, setResult] = useState<GeocodingResult>({
    address: '',
    loading: false,
    error: null,
  });

  useEffect(() => {
    // Don't do anything if disabled or no coordinates
    if (!enabled || !coordinates) {
      return;
    }

    const fetchAddress = async () => {
      setResult(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Using Nominatim OpenStreetMap API (free, no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`,
          { 
            headers: { 
              'Accept-Language': 'en',
              // Add a user-agent as recommended by Nominatim's usage policy
              'User-Agent': 'YourAppName (your@email.com)'
            } 
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch address: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the address from the response
        const address = data.display_name || 'Address not found';
        setResult({
          address,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        setResult({
          address: '',
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch address'
        });
      }
    };

    fetchAddress();
  }, [coordinates, enabled]);

  return result;
}

// Alternative implementation as a pure function (not a hook)
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { 
        headers: { 
          'Accept-Language': 'en',
          'User-Agent': 'acs-dashboard (aryan@thefabcode.org)'
        } 
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch address: ${response.status}`);
    }
    
    const data = await response.json();
    return data.display_name || 'Address not found';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}
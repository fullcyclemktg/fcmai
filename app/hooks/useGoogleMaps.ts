import { useEffect, useRef, useState } from 'react';
import { GooglePlace } from '../types/google';

interface UseGoogleMapsProps {
  onPlaceSelect: (place: GooglePlace) => void;
}

export function useGoogleMaps({ onPlaceSelect }: UseGoogleMapsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const initializationAttempts = useRef(0);
  const maxAttempts = 50; // 5 seconds with 100ms interval

  useEffect(() => {
    if (!inputRef.current) {
      console.log('Input ref not available yet');
      return;
    }

    const initAutocomplete = () => {
      try {
        // Debug: Log the state of the Google Maps object
        console.log('Checking Google Maps availability:', {
          googleExists: !!window.google,
          mapsExists: !!window.google?.maps,
          placesExists: !!window.google?.maps?.places,
        });

        if (!window.google?.maps?.places) {
          throw new Error('Google Maps Places API not loaded');
        }

        if (autocompleteRef.current) {
          console.log('Autocomplete already initialized');
          return;
        }

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current!, {
          types: ['address'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.formatted_address) {
            console.log('Place selected:', place);
            onPlaceSelect(place as GooglePlace);
          } else {
            console.warn('Place selected but no formatted address found');
          }
        });

        setIsInitialized(true);
        setError(null);
        console.log('Google Maps Places initialized successfully');
      } catch (err) {
        console.error('Error initializing Google Maps Places:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Google Maps');
      }
    };

    // Try to initialize immediately if Google Maps is already loaded
    if (window.google?.maps?.places) {
      console.log('Google Maps already loaded, initializing immediately');
      initAutocomplete();
    } else {
      console.log('Google Maps not loaded yet, starting polling');
      // Poll for Google Maps to be loaded
      const checkGoogleMaps = setInterval(() => {
        initializationAttempts.current += 1;
        console.log(`Attempt ${initializationAttempts.current} to initialize Google Maps`);

        if (window.google?.maps?.places) {
          console.log('Google Maps found, clearing interval');
          clearInterval(checkGoogleMaps);
          initAutocomplete();
        } else if (initializationAttempts.current >= maxAttempts) {
          console.error('Max initialization attempts reached');
          clearInterval(checkGoogleMaps);
          setError('Google Maps failed to load after multiple attempts');
        }
      }, 100);

      return () => {
        clearInterval(checkGoogleMaps);
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }
  }, [onPlaceSelect]);

  return {
    inputRef,
    error,
    isInitialized,
  };
} 
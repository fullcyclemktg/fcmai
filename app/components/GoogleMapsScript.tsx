'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function GoogleMapsScript() {
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Debug: Log API key availability (not the actual key)
    console.log('Google Maps API Key available:', !!apiKey);
    
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      console.log('Google Maps already loaded on mount');
      setScriptLoaded(true);
    }

    // Handle Google Maps authentication errors
    window.gm_authFailure = function() {
      console.error('Google Maps authentication failed');
      setError('Google Maps authentication failed. Please check your API key.');
    };

    return () => {
      delete window.gm_authFailure;
    };
  }, [apiKey]);

  const handleLoad = () => {
    console.log('Google Maps script load attempted');
    setScriptLoaded(true);
    
    // Verify the script actually loaded correctly
    if (window.google?.maps) {
      console.log('Google Maps objects verified after load');
      setError(null);
    } else {
      console.error('Google Maps objects not found after script load');
      setError('Failed to load Google Maps properly');
    }
  };

  const handleError = (e: Error) => {
    console.error('Error loading Google Maps script:', e);
    setError('Failed to load Google Maps. Please check your API key and try again.');
    setScriptLoaded(false);
  };

  if (!apiKey) {
    console.error('Google Maps API key is not configured');
    return null;
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`}
        onLoad={handleLoad}
        onError={handleError}
        strategy="afterInteractive"
        async
      />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          <p className="font-bold">Error loading Google Maps</p>
          <p>{error}</p>
        </div>
      )}
    </>
  );
} 
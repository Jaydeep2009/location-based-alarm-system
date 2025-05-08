import { useState, useEffect } from 'react';

const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(null); // New: for direction
  const [error, setError] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        
        // New: Capture heading if available
        if (position.coords.heading) {
          setHeading(position.coords.heading);
        }
      },
      (err) => setError(err.message),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
        ...options
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [options]);

  return { location, heading, error };
};

export default useLocation;
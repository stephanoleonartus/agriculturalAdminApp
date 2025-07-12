import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext(null);

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null); // 'granted', 'denied', 'prompt'

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setPermissionStatus('unsupported');
      return;
    }

    setLoading(true);
    setError(null);

    // Check permission status first if browser supports it
    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then(status => {
            setPermissionStatus(status.state);
            status.onchange = () => setPermissionStatus(status.state);

            if (status.state === 'granted') {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        });
                        setError(null);
                        setLoading(false);
                    },
                    (err) => {
                        setError(`Error (${err.code}): ${err.message}`);
                        setLoading(false);
                    }
                );
            } else if (status.state === 'prompt') {
                // Prompt user for permission
                 navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        });
                        setError(null);
                        setLoading(false);
                        setPermissionStatus('granted'); // Update status after prompt
                    },
                    (err) => {
                        setError(`Error (${err.code}): ${err.message}`);
                        setLoading(false);
                        if(err.code === 1) setPermissionStatus('denied'); // User denied
                    }
                );
            } else if (status.state === 'denied') {
                setError("Geolocation access denied. Please enable it in your browser settings.");
                setLoading(false);
            }
        });
    } else {
        // Fallback for browsers not supporting Permissions API
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                });
                setError(null);
                setLoading(false);
                setPermissionStatus('granted');
            },
            (err) => {
                setError(`Error (${err.code}): ${err.message}`);
                setLoading(false);
                if(err.code === 1) setPermissionStatus('denied');
            }
        );
    }
  };

  // Optionally, fetch location automatically on load, or provide a button for user to trigger
  useEffect(() => {
    fetchLocation(); // Example: fetch on initial load if desired
  }, []);

  const value = {
    location,
    locationError: error,
    locationLoading: loading,
    permissionStatus,
    fetchLocation, // Expose method to trigger fetching
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

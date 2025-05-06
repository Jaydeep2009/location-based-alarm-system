import React, { useEffect, useState, useRef } from 'react';

const LocationTracker = ({ destination, alarmDistance }) => {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [alarmPlayed, setAlarmPlayed] = useState(false);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const audioRef = useRef(null);
  const watchIdRef = useRef(null);

  const playAlarm = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/alarm.wav');
      audioRef.current.loop = true;
    }

    audioRef.current.play()
      .then(() => console.log('Alarm playing...'))
      .catch(err => console.error('Error playing alarm:', err));
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlarmPlayed(false);
  };

  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    if (!trackingStarted) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        if (destination) {
          const dist = getDistanceFromLatLonInMeters(
            latitude,
            longitude,
            destination.lat,
            destination.lng
          );
          setDistance(dist);
          console.log(`Current distance: ${Math.round(dist)} meters`);

          if (dist <= alarmDistance && !alarmPlayed) {
            playAlarm();
            setAlarmPlayed(true);
          }
        }
      },
      (error) => console.error('Location error:', error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [trackingStarted, destination, alarmDistance, alarmPlayed]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🚩 Location Tracker</h2>

      {!trackingStarted ? (
        <button onClick={() => setTrackingStarted(true)} style={{ padding: '10px 20px' }}>
          Start Tracking
        </button>
      ) : (
        <>
          {location ? (
            <div>
              <p><strong>Latitude:</strong> {location.latitude}</p>
              <p><strong>Longitude:</strong> {location.longitude}</p>
              <p><strong>Distance to Destination:</strong> {distance ? `${Math.round(distance)} meters` : 'Calculating...'}</p>

              {distance <= alarmDistance && (
                <>
                  <p style={{ color: 'red', fontWeight: 'bold' }}>🔔 You are near your destination!</p>
                  <button onClick={stopAlarm} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white' }}>
                    Stop Alarm
                  </button>
                </>
              )}
            </div>
          ) : (
            <p>Getting location...</p>
          )}
        </>
      )}
    </div>
  );
};

export default LocationTracker;

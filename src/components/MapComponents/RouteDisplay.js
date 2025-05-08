import React from 'react';
import { Marker, DirectionsRenderer, Polyline } from '@react-google-maps/api';

const RouteDisplay = ({ 
  currentLocation, 
  routeData, 
  trainData, 
  mode, 
  onSetAlert 
}) => {
  return (
    <>
      {currentLocation && (
        <Marker 
          position={currentLocation} 
          label="You" 
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }}
        />
      )}

      {mode === 'road' && routeData && (
        <DirectionsRenderer directions={routeData} />
      )}

      {mode === 'train' && trainData?.paths?.length > 0 && (
        <>
          {/* Render each train segment */}
          {trainData.paths.map((path, index) => (
            <Polyline
              key={`train-path-${index}`}
              path={path}
              options={{
                strokeColor: '#FF0000',
                strokeWeight: 6,
                strokeOpacity: 0.8,
                geodesic: true,
                icons: [{
                  icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: '#FF0000',
                    scale: 3
                  },
                  offset: '100%',
                  repeat: '100px'
                }]
              }}
            />
          ))}

          {/* Render train stations */}
          {trainData.stops.map((stop) => (
            <Marker
              key={stop.id}
              position={stop.position}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/rail.png',
                scaledSize: new window.google.maps.Size(32, 32)
              }}
              onClick={() => {
                onSetAlert(stop.position);
                alert(`Alert set for ${stop.name} station (Departure: ${stop.time || 'N/A'})`);
              }}
            />
          ))}
        </>
      )}
    </>
  );
};

export default RouteDisplay;
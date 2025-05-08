
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import MapControls from './MapControls';
import RouteDisplay from './RouteDisplay';
import AlertSystem from './AlertSystem';
import useLocation from '../../hooks/useLocation';
import mapService from '../../services/mapService';
import { getDistanceFromLatLonInMeters } from '../../utils/geoUtils';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const MapComponent = () => {
  const { location: currentLocation } = useLocation();
  const [map, setMap] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [trainData, setTrainData] = useState(null);
  const [alertLocation, setAlertLocation] = useState(null);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [mode, setMode] = useState('road');
  const mapRef = useRef(null);

  const handleRouteCalculation = async (source, destination) => {
    const result = await mapService.calculateRoute(source, destination, mode);
    
    if (result.success) {
      setRouteData(result.data);
      
      if (mode === 'train') {
        setTrainData(mapService.extractTrainData(result.data));
      } else {
        setTrainData(null);
      }
    } else {
      alert(`Route calculation failed: ${result.error}`);
    }
  };

  // Alert proximity check
  useEffect(() => {
    if (!currentLocation || !alertLocation || alertTriggered) return;

    const distance = getDistanceFromLatLonInMeters(
      currentLocation.lat,
      currentLocation.lng,
      alertLocation.lat,
      alertLocation.lng
    );

    if (distance < 100) {
      setAlertTriggered(true);
      // AlertSystem will handle the actual notification
    }
  }, [currentLocation, alertLocation, alertTriggered]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <div className="map-container">
        <MapControls 
          onRouteCalculate={handleRouteCalculation}
          mode={mode}
          setMode={setMode}
        />
        
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation || { lat: 18.5204, lng: 73.8567 }}
          zoom={13}
          onLoad={(map) => {
            setMap(map);
            mapRef.current = map;
          }}
        >
          <RouteDisplay 
            currentLocation={currentLocation}
            routeData={routeData}
            trainData={trainData}
            mode={mode}
            onSetAlert={setAlertLocation}
          />
          
          <AlertSystem 
            alertLocation={alertLocation}
            isTriggered={alertTriggered}
            onReset={() => setAlertTriggered(false)}
          />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
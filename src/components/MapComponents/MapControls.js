import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const MapControls = ({ onRouteCalculate, mode, setMode }) => {
  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  const handleCalculateRoute = () => {
    const source = sourceRef.current?.getPlace();
    const destination = destinationRef.current?.getPlace();

    if (!source || !destination || !source.geometry || !destination.geometry) {
      alert('Please select both source and destination locations');
      return;
    }

    onRouteCalculate(
      {
        lat: source.geometry.location.lat(),
        lng: source.geometry.location.lng()
      },
      {
        lat: destination.geometry.location.lat(),
        lng: destination.geometry.location.lng()
      }
    );
  };

  return (
    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '10px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            value="road"
            checked={mode === 'road'}
            onChange={() => setMode('road')}
            style={{ marginRight: '5px' }}
          />
          Road
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            value="train"
            checked={mode === 'train'}
            onChange={() => setMode('train')}
            style={{ marginRight: '5px' }}
          />
          Train
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <Autocomplete
          onLoad={(ref) => (sourceRef.current = ref)}
          fields={['geometry', 'name']}
          options={{ types: ['geocode'] }}
        >
          <input
            type="text"
            placeholder="Enter source location"
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minWidth: '200px'
            }}
          />
        </Autocomplete>

        <Autocomplete
          onLoad={(ref) => (destinationRef.current = ref)}
          fields={['geometry', 'name']}
          options={{ types: ['geocode'] }}
        >
          <input
            type="text"
            placeholder="Enter destination"
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minWidth: '200px'
            }}
          />
        </Autocomplete>
      </div>

      <button
        onClick={handleCalculateRoute}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Calculate Route
      </button>
    </div>
  );
};

export default MapControls;
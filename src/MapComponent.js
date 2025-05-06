import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 18.5204,
  lng: 73.8567,
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [alertLocation, setAlertLocation] = useState(null);
  const [alertTriggered, setAlertTriggered] = useState(false);

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const calculateRoute = async () => {
    if (!source || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: source,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(result);
  };

  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Watch user's real-time location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(loc);
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Check distance from alert location
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
      const audio = new Audio("/alarm.wav");
      audio.play();
      alert("📍 You are near the alert location!");
    }
  }, [currentLocation, alertLocation, alertTriggered]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBtYOUC7Wgvs8KNBXhgZN_xjg4-_9B3bpU" libraries={["places"]}>
      <div style={{ padding: "10px" }}>
        <Autocomplete onLoad={(ref) => (sourceRef.current = ref)} onPlaceChanged={() => {
          const place = sourceRef.current.getPlace();
          setSource({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }}>
          <input type="text" placeholder="Enter source" style={{ width: "200px", marginRight: "10px" }} />
        </Autocomplete>

        <Autocomplete onLoad={(ref) => (destinationRef.current = ref)} onPlaceChanged={() => {
          const place = destinationRef.current.getPlace();
          setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }}>
          <input type="text" placeholder="Enter destination" style={{ width: "200px", marginRight: "10px" }} />
        </Autocomplete>

        <button onClick={calculateRoute}>Set Route</button>
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13} onLoad={onLoad} onClick={(e) => {
        setAlertLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setAlertTriggered(false); // reset alert for new location
      }}>
        {currentLocation && <Marker position={currentLocation} label="You" />}
        {alertLocation && <Marker position={alertLocation} label="Alert" />}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;

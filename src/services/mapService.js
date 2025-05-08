const mapService = {
    calculateRoute: async (origin, destination, mode) => {
      const directionsService = new window.google.maps.DirectionsService();
      
      try {
        const request = {
          origin,
          destination,
          travelMode: mode === 'train' 
            ? window.google.maps.TravelMode.TRANSIT 
            : window.google.maps.TravelMode.DRIVING,
          ...(mode === 'train' && {
            transitOptions: {
              modes: [window.google.maps.TransitMode.TRAIN],
              routingPreference: window.google.maps.TransitRoutePreference.FEWER_TRANSFERS
            }
          })
        };
  
        const result = await directionsService.route(request);
        return {
          success: true,
          data: result
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    },
  
    extractTrainData: (routeResult) => {
      if (!routeResult) return null;
      
      const stops = new Map();
      let trainPolylines = [];
  
      routeResult.routes[0].legs.forEach(leg => {
        leg.steps.forEach(step => {
          if (step.travel_mode === 'TRANSIT' && step.transit?.line?.vehicle?.type === 'TRAIN') {
            // Add stops
            stops.set(step.transit.departure_stop.name, {
              id: step.transit.departure_stop.name,
              position: {
                lat: step.transit.departure_stop.location.lat(),
                lng: step.transit.departure_stop.location.lng()
              },
              name: step.transit.departure_stop.name,
              time: step.transit.departure_time?.text
            });
  
            stops.set(step.transit.arrival_stop.name, {
              id: step.transit.arrival_stop.name,
              position: {
                lat: step.transit.arrival_stop.location.lat(),
                lng: step.transit.arrival_stop.location.lng()
              },
              name: step.transit.arrival_stop.name,
              time: step.transit.arrival_time?.text
            });
  
            // Extract the actual train path
            if (step.polyline) {
              const path = step.polyline.map(point => ({
                lat: point.lat(),
                lng: point.lng()
              }));
              trainPolylines.push(path);
            }
          }
        });
      });
  
      return {
        stops: Array.from(stops.values()),
        polylines: trainPolylines
      };
    }
  };
  
  export default mapService;
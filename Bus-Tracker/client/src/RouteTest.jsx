import React, { useState } from 'react';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const RouteTest = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Geocode function to convert address to coordinates
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address + ', Kolkata, West Bengal, India')}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=IN&proximity=88.3639,22.5726&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return {
          coordinates: data.features[0].center,
          placeName: data.features[0].place_name
        };
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Get route between two points using Mapbox Directions API
  const getRoute = async (startCoords, endCoords) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        return data.routes[0];
      }
      throw new Error('Route not found');
    } catch (error) {
      console.error('Routing error:', error);
      return null;
    }
  };

  const handleFindRoute = async () => {
    if (!startPoint || !endPoint) {
      alert('Please enter both start and end points');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Finding route...');
      
      // Geocode start and end points
      const startLocation = await geocodeAddress(startPoint);
      const endLocation = await geocodeAddress(endPoint);
      
      if (!startLocation || !endLocation) {
        alert('Could not find one or both locations. Please check the addresses.');
        setLoading(false);
        return;
      }
      
      // Get route
      const route = await getRoute(startLocation.coordinates, endLocation.coordinates);
      
      if (!route) {
        alert('Could not find a route between these locations.');
        setLoading(false);
        return;
      }
      
      // Show route info
      const distance = (route.distance / 1000).toFixed(1); // Convert to km
      const duration = Math.round(route.duration / 60); // Convert to minutes
      
      setRouteInfo({
        startLocation,
        endLocation,
        distance,
        duration,
        route
      });
      
      console.log('✅ Route found!', {
        start: startLocation,
        end: endLocation,
        distance: distance + ' km',
        duration: duration + ' min'
      });
      
    } catch (error) {
      console.error('Route finding error:', error);
      alert('Error finding route. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">🗺️ Route Planner Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Point:</label>
          <input
            type="text"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            placeholder="e.g., Sealdah Station"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">End Point:</label>
          <input
            type="text"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            placeholder="e.g., Park Street"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={handleFindRoute}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '🔍 Finding Route...' : '🗺️ Find Route'}
        </button>
      </div>
      
      {routeInfo && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">✅ Route Found!</h3>
          <div className="space-y-2 text-sm">
            <p><strong>From:</strong> {routeInfo.startLocation.placeName}</p>
            <p><strong>To:</strong> {routeInfo.endLocation.placeName}</p>
            <p><strong>Distance:</strong> {routeInfo.distance} km</p>
            <p><strong>Duration:</strong> ~{routeInfo.duration} minutes</p>
            <p className="text-xs text-gray-600 mt-2">
              Check browser console for detailed route data
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteTest;
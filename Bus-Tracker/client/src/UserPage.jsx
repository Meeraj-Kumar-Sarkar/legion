import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Menu,
  X,
  MapPin,
  Settings,
  User,
  Bus,
  ArrowRight,
  Bell,
  Search,
  Clock,
  Users,
  Route,
  LogOut, // ## 1. Import the LogOut icon
} from "lucide-react";

// Mapbox Access Token - replace with your actual token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

// Debug: Log the token to check if it's being loaded
console.log('MAPBOX_ACCESS_TOKEN:', MAPBOX_ACCESS_TOKEN);
console.log('All env vars:', import.meta.env);

// Utility function to create safe CSS IDs from route names
const createSafeCSSId = (str) => {
  return str.replace(/[^a-zA-Z0-9-_]/g, '-');
};

// Predefined original routes for major Kolkata bus routes with bidirectional support
const ORIGINAL_ROUTES = {
  'howrah-sealdah': {
    name: 'Howrah to Sealdah Route',
    routeNumber: 'HW-SLD',
    color: '#FF5722', // Deep Orange
    coordinates: [
      [88.3419, 22.5804], // Howrah Station
      [88.3432, 22.5835], // Foreshore Road
      [88.3445, 22.5866], // Howrah Bridge approach road
      [88.3458, 22.5897], // Howrah Bridge (on bridge structure)
      [88.3471, 22.5908], // Howrah Bridge middle
      [88.3484, 22.5899], // Howrah Bridge Kolkata end
      [88.3497, 22.5880], // Strand Road (after bridge)
      [88.3510, 22.5861], // BBD Bagh area
      [88.3523, 22.5842], // Dalhousie area
      [88.3550, 22.5810], // Central Avenue
      [88.3580, 22.5780], // College Street
      [88.3610, 22.5750], // Shyama Charan Street
      [88.3697, 22.5675]  // Sealdah Station
    ],
    description: 'Major route connecting Howrah Railway Station to Sealdah Station via BBD Bag'
  },
  'sealdah-howrah': {
    name: 'Sealdah to Howrah Route',
    routeNumber: 'SLD-HW',
    color: '#FF5722', // Deep Orange (same route, reverse direction)
    coordinates: [
      [88.3697, 22.5675], // Sealdah Station
      [88.3610, 22.5750], // Shyama Charan Street
      [88.3580, 22.5780], // College Street
      [88.3550, 22.5810], // Central Avenue
      [88.3523, 22.5842], // Dalhousie area
      [88.3510, 22.5861], // BBD Bagh area
      [88.3497, 22.5880], // Strand Road (before bridge)
      [88.3484, 22.5899], // Howrah Bridge Kolkata end
      [88.3471, 22.5908], // Howrah Bridge middle
      [88.3458, 22.5897], // Howrah Bridge (on bridge structure)
      [88.3445, 22.5866], // Howrah Bridge approach road
      [88.3432, 22.5835], // Foreshore Road
      [88.3419, 22.5804]  // Howrah Station
    ],
    description: 'Major route connecting Sealdah Station to Howrah Railway Station via BBD Bag'
  },
  'sealdah-esplanade': {
    name: 'Sealdah to Esplanade Route', 
    routeNumber: 'SLD-ESP',
    color: '#9C27B0', // Purple
    coordinates: [
      [88.3697, 22.5675], // Sealdah Station
      [88.3670, 22.5660], // Sealdah area roads
      [88.3640, 22.5645], // College Street
      [88.3610, 22.5630], // Central Avenue
      [88.3580, 22.5615], // Dalhousie area
      [88.3550, 22.5600], // BBD Bagh
      [88.3520, 22.5590], // GPO area
      [88.3490, 22.5600], // Park Street approach
      [88.3460, 22.5610], // Chowringhee area
      [88.3512167, 22.5626583]  // Esplanade
    ],
    description: 'Popular route from Sealdah to Esplanade via College Street and Dalhousie'
  },
  'esplanade-sealdah': {
    name: 'Esplanade to Sealdah Route', 
    routeNumber: 'ESP-SLD',
    color: '#9C27B0', // Purple (same route, reverse direction)
    coordinates: [
      [88.3512167, 22.5626583], // Esplanade
      [88.3460, 22.5610], // Chowringhee area
      [88.3490, 22.5600], // Park Street approach
      [88.3520, 22.5590], // GPO area
      [88.3550, 22.5600], // BBD Bagh
      [88.3580, 22.5615], // Dalhousie area
      [88.3610, 22.5630], // Central Avenue
      [88.3640, 22.5645], // College Street
      [88.3670, 22.5660], // Sealdah area roads
      [88.3697, 22.5675]  // Sealdah Station
    ],
    description: 'Popular route from Esplanade to Sealdah via College Street and Dalhousie'
  },
  'howrah-esplanade': {
    name: 'Howrah to Esplanade Route',
    routeNumber: 'HW-ESP', 
    color: '#795548', // Brown
    coordinates: [
      [88.3419, 22.5804], // Howrah Station
      [88.3432, 22.5835], // Foreshore Road
      [88.3445, 22.5866], // Howrah Bridge approach road
      [88.3458, 22.5897], // Howrah Bridge (on bridge structure)
      [88.3471, 22.5908], // Howrah Bridge middle
      [88.3484, 22.5899], // Howrah Bridge Kolkata end
      [88.3497, 22.5880], // Strand Road (after bridge)
      [88.3510, 22.5861], // BBD Bagh area
      [88.3500, 22.5820], // Direct towards Esplanade
      [88.3495, 22.5780], // Park Street area
      [88.3500, 22.5740], // Chowringhee approach
      [88.3512167, 22.5626583]  // Esplanade
    ],
    description: 'Direct route from Howrah to Esplanade via Strand Road and Central Kolkata'
  },
  'esplanade-howrah': {
    name: 'Esplanade to Howrah Route',
    routeNumber: 'ESP-HW', 
    color: '#795548', // Brown (same route, reverse direction)
    coordinates: [
      [88.3512167, 22.5626583], // Esplanade
      [88.3500, 22.5740], // Chowringhee approach
      [88.3495, 22.5780], // Park Street area
      [88.3500, 22.5820], // Direct from Esplanade
      [88.3510, 22.5861], // BBD Bagh area
      [88.3497, 22.5880], // Strand Road (before bridge)
      [88.3484, 22.5899], // Howrah Bridge Kolkata end
      [88.3471, 22.5908], // Howrah Bridge middle
      [88.3458, 22.5897], // Howrah Bridge (on bridge structure)
      [88.3445, 22.5866], // Howrah Bridge approach road
      [88.3432, 22.5835], // Foreshore Road
      [88.3419, 22.5804]  // Howrah Station
    ],
    description: 'Direct route from Esplanade to Howrah via Strand Road and Central Kolkata'
  },
  'sealdah-kalighat': {
    name: 'Sealdah to Kalighat Route',
    routeNumber: 'SLD-KLG',
    color: '#4CAF50', // Green
    coordinates: [
      [88.3697, 22.5675], // Sealdah Station
      [88.3670, 22.5650], // Sealdah area
      [88.3640, 22.5620], // College Street
      [88.3610, 22.5590], // Shyama Charan Street
      [88.3580, 22.5560], // Central Avenue
      [88.3550, 22.5530], // Park Street area
      [88.3520, 22.5500], // Chowringhee Road
      [88.3490, 22.5470], // Alipore Road
      [88.3460, 22.5440], // Kalighat area
      [88.346462, 22.520383]  // Kalighat Bus Stop
    ],
    description: 'Route from Sealdah to Kalighat via College Street and Park Street'
  },
  'kalighat-sealdah': {
    name: 'Kalighat to Sealdah Route',
    routeNumber: 'KLG-SLD',
    color: '#4CAF50', // Green (same route, reverse direction)
    coordinates: [
      [88.346462, 22.520383], // Kalighat Bus Stop
      [88.3460, 22.5440], // Kalighat area
      [88.3490, 22.5470], // Alipore Road
      [88.3520, 22.5500], // Chowringhee Road
      [88.3550, 22.5530], // Park Street area
      [88.3580, 22.5560], // Central Avenue
      [88.3610, 22.5590], // Shyama Charan Street
      [88.3640, 22.5620], // College Street
      [88.3670, 22.5650], // Sealdah area
      [88.3697, 22.5675]  // Sealdah Station
    ],
    description: 'Route from Kalighat to Sealdah via Park Street and College Street'
  }
};

// Function to detect route based on start and end points
const detectRoute = (startPoint, endPoint) => {
  const normalizeLocation = (location) => {
    return location.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  };

  const start = normalizeLocation(startPoint);
  const end = normalizeLocation(endPoint);

  // Check for Howrah-Sealdah routes (bidirectional)
  if ((start.includes('howrah') && end.includes('sealdah')) ||
      (start.includes('sealdah') && end.includes('howrah'))) {
    return start.includes('howrah') ? 'howrah-sealdah' : 'sealdah-howrah';
  }
  
  // Check for Sealdah-Esplanade routes (bidirectional)
  if ((start.includes('sealdah') && end.includes('esplanade')) ||
      (start.includes('esplanade') && end.includes('sealdah'))) {
    return start.includes('sealdah') ? 'sealdah-esplanade' : 'esplanade-sealdah';
  }
  
  // Check for Howrah-Esplanade routes (bidirectional)
  if ((start.includes('howrah') && end.includes('esplanade')) ||
      (start.includes('esplanade') && end.includes('howrah'))) {
    return start.includes('howrah') ? 'howrah-esplanade' : 'esplanade-howrah';
  }
  
  // Check for Sealdah-Kalighat routes (bidirectional)
  if ((start.includes('sealdah') && end.includes('kalighat')) ||
      (start.includes('kalighat') && end.includes('sealdah'))) {
    return start.includes('sealdah') ? 'sealdah-kalighat' : 'kalighat-sealdah';
  }
  
  return null;
};

// Mapbox Map Component with Geolocation
const MapView = forwardRef((_, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);
  const currentBusMarkerRef = useRef(null);
  const routeSourceRef = useRef(null);

  useEffect(() => {
    console.log('🔍 MapView useEffect running', { 
      MAPBOX_ACCESS_TOKEN: MAPBOX_ACCESS_TOKEN ? 'Present' : 'Missing', 
      mapContainer: !!mapContainer.current 
    });
    
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error("❌ Mapbox access token is missing");
      setError("Mapbox access token is missing.");
      setIsLoading(false);
      return;
    }

    const initializeMap = () => {
      console.log('🗺️ Initializing map...', { 
        hasContainer: !!mapContainer.current, 
        hasExistingMap: !!map.current 
      });
      
      if (!mapContainer.current) {
        console.log('⏳ Map container not ready yet, retrying...');
        // Retry after a short delay if container isn't ready
        setTimeout(initializeMap, 100);
        return;
      }
      
      if (map.current) {
        console.log('ℹ️ Map already exists, skipping initialization');
        return;
      }

      try {
        console.log('🚀 Setting Mapbox access token and creating map...');
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [88.3639, 22.5726], // Kolkata city center
          zoom: 11,
          attributionControl: false,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        
        // Add geolocation control
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'top-right'
        );

        map.current.on("load", () => {
          console.log("✅ Map loaded successfully!");
          setIsLoading(false);
          setError(null);
          addBusStops(); // Keep bus stops
          addCurrentBusLocation('215A'); // Default route with default color
        });

        map.current.on("error", (e) => {
          console.error("❌ Mapbox error:", e);
          setError(`Map error: ${e.error?.message || "Unknown error"}`);
          setIsLoading(false);
        });
        
        map.current.on("styledata", () => {
          console.log("🎨 Style data loaded");
        });
        
        let routeLoggedSources = new Set();
        map.current.on("sourcedata", (e) => {
          // Only log when significant sources load to reduce noise and avoid duplicates
          if (e.sourceId && (e.sourceId.includes('route') || e.sourceId.includes('directions'))) {
            if (!routeLoggedSources.has(e.sourceId)) {
              console.log(`📡 Source data loaded: ${e.sourceId}`);
              routeLoggedSources.add(e.sourceId);
              // Clear the set periodically to avoid memory leaks
              if (routeLoggedSources.size > 10) {
                routeLoggedSources.clear();
              }
            }
          }
        });
        
        // Add timeout as fallback
        setTimeout(() => {
          if (map.current && !map.current.loaded()) {
            console.warn('⏰ Map loading timeout - forcing error state');
            setError('Map loading timeout. Please check your internet connection.');
            setIsLoading(false);
          }
        }, 15000); // 15 second timeout
        
      } catch (err) {
        console.error("❌ Error initializing Mapbox:", err);
        setError(`Initialization error: ${err.message}`);
        setIsLoading(false);
      }
    };

    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(initializeMap, 1000);

    return () => {
      console.log('🧹 Cleaning up MapView...');
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Add bus stops with realistic locations
  const addBusStops = () => {
    if (!map.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const busStops = [
      {
        coordinates: [88.3697, 22.5675],
        name: 'Sealdah Station',
        routes: ['215A', 'S-7', 'AC-9'],
        type: 'major'
      },
      {
        coordinates: [88.3698, 22.5675],
        name: 'Park Street',
        routes: ['215A', 'AC-9'],
        type: 'major'
      },
      {
        coordinates: [88.346462, 22.520383],
        name: 'Kalighat',
        routes: ['215A', 'S-7'],
        type: 'major'
      },
      {
        coordinates: [88.4067, 22.5958],
        name: 'Salt Lake Sector V',
        routes: ['S-7', 'AC-9'],
        type: 'major'
      },
      {
        coordinates: [88.3419, 22.5804],
        name: 'Howrah Station',
        routes: ['AC-9'],
        type: 'major'
      },
      {
        coordinates: [88.3512167, 22.5626583],
        name: 'Esplanade',
        routes: ['215A'],
        type: 'major'
      }
    ];

    busStops.forEach(stop => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'bus-stop-marker';
      markerElement.style.cssText = `
        width: ${stop.type === 'major' ? '24px' : '18px'};
        height: ${stop.type === 'major' ? '24px' : '18px'};
        background: ${stop.type === 'major' ? '#1976D2' : '#42A5F5'};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      `;
      markerElement.innerHTML = '🚏';

      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });

      // Create popup with stop information
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        className: 'bus-stop-popup'
      }).setHTML(`
        <div style="padding: 8px; min-width: 150px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1976D2;">${stop.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Bus Routes:</p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${stop.routes.map(route => 
              `<span style="background: #E3F2FD; color: #1976D2; padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: bold;">${route}</span>`
            ).join('')}
          </div>
          <div style="margin-top: 8px; font-size: 11px; color: #888;">
            📍 ${stop.type === 'major' ? 'Major Stop' : 'Regular Stop'}
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(stop.coordinates)
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  };

  // Add current bus location with real-time tracking
  const addCurrentBusLocation = (selectedRoute = '215A', customCoord = null, customName = null, customColor = null) => {
    if (!map.current) return;

    // Route-specific data with distinct colors
    const routeData = {
      '215A': {
        coordinates: [88.3639, 22.5726], // Sealdah area
        color: '#2196F3', // Blue
        bgGradient: 'linear-gradient(135deg, #2196F3, #64B5F6)',
        nextStop: 'Park Street'
      },
      'S-7': {
        coordinates: [88.4067, 22.5958], // Salt Lake area  
        color: '#4CAF50', // Green
        bgGradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
        nextStop: 'Sealdah'
      },
      'AC-9': {
        coordinates: [88.3698, 22.5675], // Park Street area
        color: '#FF9800', // Orange
        bgGradient: 'linear-gradient(135deg, #FF9800, #FFB74D)',
        nextStop: 'Salt Lake Sector V'
      },
      'howrah-sealdah': {
        coordinates: [88.3450, 22.5900], // Mid-route position
        color: '#FF5722', // Deep Orange
        bgGradient: 'linear-gradient(135deg, #FF5722, #FF7043)',
        nextStop: 'BBD Bag'
      },
      'sealdah-howrah': {
        coordinates: [88.3450, 22.5900], // Mid-route position
        color: '#FF5722', // Deep Orange (same route color)
        bgGradient: 'linear-gradient(135deg, #FF5722, #FF7043)',
        nextStop: 'BBD Bag'
      },
      'sealdah-esplanade': {
        coordinates: [88.3580, 22.5650], // Mid-route position
        color: '#9C27B0', // Purple
        bgGradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
        nextStop: 'College Street'
      },
      'esplanade-sealdah': {
        coordinates: [88.3580, 22.5650], // Mid-route position
        color: '#9C27B0', // Purple (same route color)
        bgGradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
        nextStop: 'College Street'
      },
      'howrah-esplanade': {
        coordinates: [88.3400, 22.5800], // Mid-route position
        color: '#795548', // Brown
        bgGradient: 'linear-gradient(135deg, #795548, #A1887F)',
        nextStop: 'Strand Road'
      },
      'esplanade-howrah': {
        coordinates: [88.3400, 22.5800], // Mid-route position
        color: '#795548', // Brown (same route color)
        bgGradient: 'linear-gradient(135deg, #795548, #A1887F)',
        nextStop: 'Strand Road'
      },
      'sealdah-kalighat': {
        coordinates: [88.3580, 22.5560], // Mid-route position
        color: '#4CAF50', // Green
        bgGradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
        nextStop: 'Park Street'
      },
      'kalighat-sealdah': {
        coordinates: [88.3580, 22.5560], // Mid-route position
        color: '#4CAF50', // Green (same route color)
        bgGradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
        nextStop: 'College Street'
      }
    };

    const currentRouteData = routeData[selectedRoute] || routeData['215A'];
    
    // Use custom values if provided (for original routes)
    const coordinates = customCoord || currentRouteData.coordinates;
    const color = customColor || currentRouteData.color;
    const name = customName || selectedRoute;
    const bgGradient = customColor ? `linear-gradient(135deg, ${customColor}, ${customColor}CC)` : currentRouteData.bgGradient;
    
    // Simulate current bus location (in real app, this would come from GPS/MQTT)
    const currentBusData = {
      coordinates: coordinates,
      routeNumber: selectedRoute,
      driverName: 'Driver 1',
      speed: 25, // km/h
      nextStop: currentRouteData.nextStop,
      passengers: 42,
      color: color,
      bgGradient: bgGradient
    };

    // Remove existing current bus marker if any
    if (currentBusMarkerRef.current) {
      currentBusMarkerRef.current.remove();
    }

    // Create animated current bus marker with route-specific colors
    const currentBusElement = document.createElement('div');
    const safeRouteId = createSafeCSSId(selectedRoute);
    currentBusElement.className = `current-bus-marker current-bus-marker-${safeRouteId}`;
    currentBusElement.style.cssText = `
      width: 50px;
      height: 50px;
      background: ${currentBusData.bgGradient};
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 12px ${currentBusData.color}40;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      animation: pulse-${safeRouteId} 2s infinite;
      position: relative;
    `;
    currentBusElement.innerHTML = '🚌';

    // Add CSS animation for the pulsing effect with route-specific colors
    if (!document.querySelector(`#bus-marker-styles-${safeRouteId}`)) {
      const style = document.createElement('style');
      style.id = `bus-marker-styles-${safeRouteId}`;
      style.textContent = `
        @keyframes pulse-${safeRouteId} {
          0% { transform: scale(1); box-shadow: 0 4px 12px ${currentBusData.color}40; }
          50% { transform: scale(1.1); box-shadow: 0 6px 16px ${currentBusData.color}60; }
          100% { transform: scale(1); box-shadow: 0 4px 12px ${currentBusData.color}40; }
        }
        .current-bus-marker-${safeRouteId}::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px solid ${currentBusData.color};
          border-radius: 50%;
          opacity: 0.6;
          animation: ripple-${safeRouteId} 3s infinite;
        }
        @keyframes ripple-${safeRouteId} {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Create detailed popup for current bus with route-specific styling
    const currentBusPopup = new mapboxgl.Popup({
      offset: 30,
      closeButton: true,
      className: 'current-bus-popup'
    }).setHTML(`
      <div style="padding: 12px; min-width: 200px; background: ${currentBusData.bgGradient}; color: white; border-radius: 8px; margin: -10px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; display: flex; align-items: center;">
          🚌 ${name} - Live Bus
        </h3>
        <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 6px; margin-bottom: 8px;">
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Driver:</strong> ${currentBusData.driverName}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Speed:</strong> ${currentBusData.speed} km/h</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Next Stop:</strong> ${currentBusData.nextStop}</div>
          <div style="font-size: 12px;"><strong>Passengers:</strong> ${currentBusData.passengers}/60</div>
        </div>
        <div style="font-size: 11px; opacity: 0.9;">
          📍 Live location • Updated just now
        </div>
      </div>
    `);

    const currentBusMarker = new mapboxgl.Marker(currentBusElement)
      .setLngLat(currentBusData.coordinates)
      .setPopup(currentBusPopup)
      .addTo(map.current);

    currentBusMarkerRef.current = currentBusMarker;

    // Center map on current bus location
    map.current.flyTo({
      center: currentBusData.coordinates,
      zoom: 14,
      duration: 2000
    });
  };

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

  // Display route on map with route-specific colors
  const displayOriginalRoute = (routeKey) => {
    console.log('🗺️ displayOriginalRoute called with:', routeKey);
    console.log('🗺️ map.current exists:', !!map.current);
    console.log('🗺️ ORIGINAL_ROUTES[routeKey] exists:', !!ORIGINAL_ROUTES[routeKey]);
    
    if (!map.current || !ORIGINAL_ROUTES[routeKey]) return;

    const route = ORIGINAL_ROUTES[routeKey];
    console.log(`🗺️ Displaying original route: ${route.name} with color: ${route.color}`);

    // Remove existing route
    if (routeSourceRef.current && map.current.getSource('route')) {
      console.log('🗺️ Removing existing route');
      try {
        map.current.removeLayer('route');
        map.current.removeLayer('route-arrows');
        map.current.removeSource('route');
      } catch (error) {
        console.error('Error removing existing route:', error);
      }
    }

    // Create GeoJSON for the route
    const routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route.coordinates
      }
    };

    console.log('🗺️ Route GeoJSON created:', routeGeoJSON);

    try {
      // Add source and layer
      map.current.addSource('route', {
        type: 'geojson',
        data: routeGeoJSON
      });

      console.log('🗺️ Route source added');

      // Add route line
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': route.color,
          'line-width': 6,
          'line-opacity': 0.8
        }
      });

      console.log('🗺️ Route line layer added with color:', route.color);

      // Add directional arrows
      map.current.addLayer({
        id: 'route-arrows',
        type: 'symbol',
        source: 'route',
        layout: {
          'symbol-placement': 'line',
          'text-field': '▶',
          'text-size': 16,
          'symbol-spacing': 100,
          'text-keep-upright': false,
          'text-rotation-alignment': 'map'
        },
        paint: {
          'text-color': route.color,
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      });

      console.log('🗺️ Route arrows layer added');
      routeSourceRef.current = 'route';

      // Fit map to route bounds
      const coordinates = route.coordinates;
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
      
      map.current.fitBounds(bounds, {
        padding: 80,
        duration: 2000
      });

      console.log('🗺️ Map bounds fitted to route');

      // Add start and end markers
      const startCoord = coordinates[0];
      const endCoord = coordinates[coordinates.length - 1];

    // Start marker
    const startMarkerElement = document.createElement('div');
    startMarkerElement.style.cssText = `
      width: 40px;
      height: 40px;
      background: ${route.color};
      border-radius: 50%;
      border: 4px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    startMarkerElement.innerHTML = '🚏';

    new mapboxgl.Marker(startMarkerElement)
      .setLngLat(startCoord)
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>Start:</strong> ${route.name.split(' to ')[0]}<br/><small>${route.description}</small>`))
      .addTo(map.current);

    // End marker 
    const endMarkerElement = document.createElement('div');
    endMarkerElement.style.cssText = `
      width: 40px;
      height: 40px;
      background: ${route.color};
      border-radius: 50%;
      border: 4px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    endMarkerElement.innerHTML = '🏁';

      new mapboxgl.Marker(endMarkerElement)
        .setLngLat(endCoord)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>End:</strong> ${route.name.split(' to ')[1] || route.name.split(' to ')[0]}<br/><small>Route: ${route.routeNumber}</small>`))
        .addTo(map.current);
      
    } catch (error) {
      console.error('❌ Error adding route to map:', error);
    }
  };  const displayRoute = async (startPoint, endPoint, showNotification, selectedRoute = '215A') => {
    if (!map.current) return;

    // Route-specific colors for the drawn route
    const routeColors = {
      '215A': '#2196F3', // Blue
      'S-7': '#4CAF50',  // Green  
      'AC-9': '#FF9800'  // Orange
    };

    const routeColor = routeColors[selectedRoute] || routeColors['215A'];

    try {
      showNotification('🔍 Finding route...');
      
      // Geocode start and end points
      const startLocation = await geocodeAddress(startPoint);
      const endLocation = await geocodeAddress(endPoint);
      
      if (!startLocation || !endLocation) {
        showNotification('❌ Could not find one or both locations. Please check the addresses.');
        return;
      }
      
      // Get route
      const route = await getRoute(startLocation.coordinates, endLocation.coordinates);
      
      if (!route) {
        showNotification('❌ Could not find a route between these locations.');
        return;
      }
      
      // Clear existing route
      if (routeSourceRef.current && map.current.getSource('route')) {
        map.current.removeLayer('route-line');
        map.current.removeLayer('route-arrows');
        map.current.removeSource('route');
      }
      
      // Clear existing route markers
      markersRef.current.forEach(marker => {
        if (marker._element && marker._element.classList.contains('route-marker')) {
          marker.remove();
        }
      });
      
      // Add route to map with route-specific color
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      });
      
      // Add route line with dynamic color
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': routeColor,
          'line-width': 6,
          'line-opacity': 0.8
        }
      });
      
      // Add route arrows for direction with matching color
      map.current.addLayer({
        id: 'route-arrows',
        type: 'symbol',
        source: 'route',
        layout: {
          'symbol-placement': 'line',
          'text-field': '▶',
          'text-size': 16,
          'symbol-spacing': 100,
          'text-keep-upright': false,
          'text-rotation-alignment': 'map'
        },
        paint: {
          'text-color': routeColor,
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      });
      
      routeSourceRef.current = 'route';
      
      // Add start marker
      const startMarkerElement = document.createElement('div');
      startMarkerElement.className = 'route-marker';
      startMarkerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #4CAF50, #81C784);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(76,175,80,0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: white;
      `;
      startMarkerElement.innerHTML = '🚀';
      
      const startPopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px; text-align: center;">
            <h4 style="margin: 0 0 4px 0; color: #4CAF50; font-size: 14px;">📍 Start Point</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">${startLocation.placeName}</p>
          </div>
        `);
      
      const startMarker = new mapboxgl.Marker(startMarkerElement)
        .setLngLat(startLocation.coordinates)
        .setPopup(startPopup)
        .addTo(map.current);
      
      markersRef.current.push(startMarker);
      
      // Add end marker
      const endMarkerElement = document.createElement('div');
      endMarkerElement.className = 'route-marker';
      endMarkerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #F44336, #EF5350);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(244,67,54,0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: white;
      `;
      endMarkerElement.innerHTML = '🏁';
      
      const endPopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px; text-align: center;">
            <h4 style="margin: 0 0 4px 0; color: #F44336; font-size: 14px;">🏁 End Point</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">${endLocation.placeName}</p>
          </div>
        `);
      
      const endMarker = new mapboxgl.Marker(endMarkerElement)
        .setLngLat(endLocation.coordinates)
        .setPopup(endPopup)
        .addTo(map.current);
      
      markersRef.current.push(endMarker);
      
      // Fit map to show entire route
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(startLocation.coordinates);
      bounds.extend(endLocation.coordinates);
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 2000
      });
      
      // Show route info
      const distance = (route.distance / 1000).toFixed(1); // Convert to km
      const duration = Math.round(route.duration / 60); // Convert to minutes
      
      showNotification(`✅ Route found! Distance: ${distance} km, Duration: ~${duration} min`);
      
    } catch (error) {
      console.error('Route display error:', error);
      showNotification('❌ Error displaying route. Please try again.');
    }
  };

  // Function to update current bus location with new route
  const updateCurrentBusRoute = (selectedRoute) => {
    addCurrentBusLocation(selectedRoute);
  };

  // Expose displayRoute and updateCurrentBusRoute functions to parent component
  useImperativeHandle(ref, () => ({
    displayRoute,
    displayOriginalRoute,
    updateCurrentBusRoute,
    addCurrentBusLocation
  }));

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg h-96 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Map Failed to Load
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded border-l-4 border-yellow-400">
            <p>
              <strong>To fix this:</strong>
            </p>
            <ol className="text-left mt-2 space-y-1">
              <li>1. Check your Mapbox token</li>
              <li>2. Ensure token starts with 'pk.'</li>
              <li>3. Restart your development server</li>
              <li>4. Check browser console for errors</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96 relative">
      {/* Always render the map container */}
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ position: "relative" }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white rounded-xl shadow-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Map...</p>
            <p className="text-xs text-slate-400 mt-2">Initializing Mapbox...</p>
          </div>
        </div>
      )}
    </div>
  );
});

// ## Main UserPage Component
export default function UserPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState("Journey");
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // ## 2. Create the logout handler function
  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem("userData");
    // Reset the user state in the application
    setUser(null);
    // Show a confirmation message
    showNotification("You have been successfully logged out.");
    // Redirect to the sign-in page after a short delay
    setTimeout(() => {
      window.location.href = "/App";
    }, 1500);
  };

  const mainContentVariants = {
    open: {
      marginLeft: window.innerWidth >= 1024 ? "16rem" : "0",
      width: window.innerWidth >= 1024 ? "calc(100% - 16rem)" : "100%",
    },
    closed: {
      marginLeft: "0",
      width: "100%",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showNotification={showNotification}
        user={user}
        onLogout={handleLogout} // ## 3. Pass the function as a prop
      />
      <motion.main
        className="relative"
        variants={mainContentVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
      >
        <Header
          sidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          userName={user ? `${user.firstName}` : "Guest"}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <DashboardContent
            activeTab={activeTab}
            showNotification={showNotification}
          />
        </div>
      </motion.main>
      <Notification message={notification} />
    </div>
  );
}

// ## Sidebar Component
const Sidebar = ({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  showNotification,
  user,
  onLogout, // ## 4. Receive the onLogout prop
}) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };
  const navItems = [
    { name: "Journey", icon: MapPin },
    { name: "Settings", icon: Settings },
  ];
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    showNotification(`Switched to ${tabName} view`);
    if (window.innerWidth < 1024) setIsOpen(false);
  };
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
            className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-100 p-6 flex flex-col shadow-2xl z-50"
          >
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-2xl font-bold text-white tracking-wider">
                BUZZ
              </h1>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 rounded-full hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === item.name
                      ? "bg-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-700/50"
                  }`}
                  onClick={() => handleTabClick(item.name)}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
            {/* ## 5. Add the Logout button and structure for user profile */}
            <div className="mt-auto flex flex-col space-y-3">
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-slate-300 hover:bg-red-500/20 hover:text-red-400"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
              <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
                <img
                  src={`https://placehold.co/40x40/a78bfa/ffffff?text=${
                    user ? user.firstName[0] : "G"
                  }`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">
                    {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        ></div>
      )}
    </>
  );
};

// ## Header Component
const Header = ({ sidebarToggle, userName }) => (
  <header className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-30 p-4 sm:p-6 flex justify-between items-center border-b border-slate-200">
    <div className="flex items-center gap-4">
      <button
        onClick={sidebarToggle}
        className="p-2 rounded-full hover:bg-slate-200 transition-colors"
      >
        <Menu size={24} />
      </button>
      <h2 className="text-xl md:text-2xl font-bold text-slate-800">
        User Dashboard
      </h2>
    </div>
    <div className="flex items-center space-x-4">
      <button className="p-2 rounded-full hover:bg-slate-200 transition-colors relative">
        <Bell size={22} />
        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-50"></span>
      </button>
      <div className="w-px h-6 bg-slate-300 hidden sm:block"></div>
      <div className="hidden sm:flex items-center space-x-2">
        <span className="font-semibold text-slate-600">{userName}</span>
        <User size={22} className="text-slate-500" />
      </div>
    </div>
  </header>
);

// ## Content Area Component
const DashboardContent = ({ activeTab, showNotification }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {activeTab === "Journey" && (
        <JourneyView showNotification={showNotification} />
      )}
      {activeTab === "Settings" && (
        <PlaceholderView
          title="User Settings"
          text="Customize your application preferences and profile information here."
        />
      )}
    </motion.div>
  </AnimatePresence>
);

// ## Journey View Component
const JourneyView = ({ showNotification }) => {
  const mapViewRef = useRef(null);
  const [busResults, setBusResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchType, setSearchType] = useState('initial');

  // Function to detect route key based on start and end points
  const detectRoute = (from, to) => {
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();
    
    // Route mapping based on common locations
    const routeMapping = {
      'howrah-sealdah': ['howrah', 'sealdah'],
      'sealdah-esplanade': ['sealdah', 'esplanade'],
      'sealdah-kalighat': ['sealdah', 'kalighat'],
      'howrah-esplanade': ['howrah', 'esplanade']
    };
    
    for (const [routeKey, locations] of Object.entries(routeMapping)) {
      if ((locations.includes(fromLower) && locations.includes(toLower)) ||
          (locations.includes(toLower) && locations.includes(fromLower))) {
        return routeKey;
      }
    }
    
    return null;
  };

  const mockBusData = [
    {
      id: 1,
      number: "HW-SLD",
      routeKey: "howrah-sealdah",
      eta: 5,
      currentLocation: "Howrah Bridge",
      capacity: 75,
      route: "Howrah ↔ Sealdah",
      color: "#FF5722"
    },
    {
      id: 2,
      number: "SLD-ESP",
      routeKey: "sealdah-esplanade",
      eta: 12,
      currentLocation: "College Street",
      capacity: 90,
      route: "Sealdah ↔ Esplanade",
      color: "#9C27B0"
    },
    {
      id: 3,
      number: "SLD-KLG",
      routeKey: "sealdah-kalighat",
      eta: 8,
      currentLocation: "Park Street",
      capacity: 60,
      route: "Sealdah ↔ Kalighat",
      color: "#4CAF50"
    },
    {
      id: 4,
      number: "HW-ESP",
      routeKey: "howrah-esplanade",
      eta: 15,
      currentLocation: "Strand Road",
      capacity: 85,
      route: "Howrah ↔ Esplanade",
      color: "#795548"
    },
  ];

  const handleRouteSearch = (from, to) => {
    setIsLoading(true);
    setBusResults(null);
    setSelectedBus(null);
    setShowMap(false);
    setSearchType('route');
    showNotification(`Finding buses from ${from} to ${to}...`);

    // Detect the route and filter buses
    const detectedRoute = detectRoute(from, to);
    let availableBuses = [];
    
    if (detectedRoute) {
      // Filter buses that match the detected route
      availableBuses = mockBusData.filter(bus => {
        return bus.routeKey === detectedRoute;
      });
    }

    setTimeout(() => {
      setBusResults(availableBuses);
      setIsLoading(false);
      if (availableBuses.length > 0) {
        showNotification(`Found ${availableBuses.length} bus(es) for route ${from} to ${to}`);
      } else {
        showNotification(`No buses found for route ${from} to ${to}`);
      }
    }, 1500);
  };

  const handleBusSearch = (busNumber) => {
    setIsLoading(true);
    setBusResults(null);
    setShowMap(true);
    setSearchType('bus');
    showNotification(`Finding Bus No. ${busNumber}...`);
    
    // Find the bus by number or route key
    const foundBus = mockBusData.find(bus => 
      bus.number.toLowerCase().includes(busNumber.toLowerCase()) ||
      bus.routeKey.toLowerCase().includes(busNumber.toLowerCase())
    );
    
    if (foundBus) {
      setSelectedBus(foundBus);
      
      // Display the route on map
      setTimeout(() => {
        if (mapViewRef.current && ORIGINAL_ROUTES[foundBus.routeKey]) {
          const route = ORIGINAL_ROUTES[foundBus.routeKey];
          
          // Display colored route
          if (mapViewRef.current.displayOriginalRoute) {
            mapViewRef.current.displayOriginalRoute(foundBus.routeKey);
          }
          
          // Add bus marker at current position
          const positionIndex = Math.floor(route.coordinates.length * foundBus.positionProgress);
          const busPosition = route.coordinates[positionIndex];
          if (mapViewRef.current.addCurrentBusLocation) {
            mapViewRef.current.addCurrentBusLocation(foundBus.routeKey, busPosition, `${foundBus.number} - ${foundBus.route}`, route.color);
          }
          
          setIsLoading(false);
          showNotification(`🚌 Found ${foundBus.number} on ${foundBus.route}`);
        } else {
          setIsLoading(false);
          showNotification(`❌ Bus ${busNumber} not found`);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        showNotification(`❌ Bus ${busNumber} not found`);
      }, 1000);
    }
  };

  // Handle bus selection from the results
  const handleBusSelection = (bus) => {
    setSelectedBus(bus);
    setShowMap(true);
    setSearchType('selected');
    
    // Display the selected bus route and position on map
    setTimeout(() => {
      if (mapViewRef.current && ORIGINAL_ROUTES[bus.routeKey]) {
        const route = ORIGINAL_ROUTES[bus.routeKey];
        
        // Display colored route
        if (mapViewRef.current.displayOriginalRoute) {
          mapViewRef.current.displayOriginalRoute(bus.routeKey);
        }
        
        // Add bus marker at current position using stored progress
        const positionIndex = Math.floor(route.coordinates.length * bus.positionProgress);
        const busPosition = route.coordinates[positionIndex];
        
        if (mapViewRef.current.addCurrentBusLocation) {
          mapViewRef.current.addCurrentBusLocation(
            bus.routeKey, 
            busPosition, 
            `${bus.number} - ${bus.route}`, 
            route.color
          );
        }
        
        showNotification(`🚌 Showing ${bus.number} route and current position`);
      }
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <div className="bg-white p-6 rounded-xl shadow-lg h-96 xl:h-full flex flex-col">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSpinner key="loader" />
            ) : showMap ? (
              <MapView key="map" ref={mapViewRef} />
            ) : busResults ? (
              <BusSelection key="bus-selection" buses={busResults} onSelectBus={handleBusSelection} />
            ) : (
              <InitialMessage key="initial" />
            )}
          </AnimatePresence>
          {selectedBus && showMap && (
            <div className="mt-2 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full" style={{ backgroundColor: selectedBus.color + '20' }}>
                    <Bus size={20} style={{ color: selectedBus.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{selectedBus.number}</h4>
                    <p className="text-sm text-gray-600">{selectedBus.route}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">ETA: <span className="font-bold text-green-600">{selectedBus.eta} min</span></p>
                  <p className="text-xs text-gray-500">{selectedBus.currentLocation}</p>
                </div>
              </div>
            </div>
          )}
          {selectedBus && !showMap && (
            <div className="mt-2 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="bg-white p-2 rounded-full" style={{ backgroundColor: selectedBus.color + '20' }}>
                    <Bus size={24} style={{ color: selectedBus.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{selectedBus.number}</h4>
                    <p className="text-sm text-gray-600">{selectedBus.route}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="text-green-600 font-medium">ETA: {selectedBus.eta} min</span>
                  <span className="text-blue-600">Current: {selectedBus.currentLocation}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Bus selected from available options</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="xl:col-span-2">
        <JourneyForm
          showNotification={showNotification}
          onRouteSearch={handleRouteSearch}
          onBusSearch={handleBusSearch}
        />
      </div>
    </div>
  );
};

// ## New Components for Dynamic Content Area
const InitialMessage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-full text-center"
  >
    <Route size={48} className="text-slate-300 mb-4" />
    <h3 className="text-xl font-bold text-slate-700">Find Your Bus</h3>
    <p className="text-slate-500 mt-2 max-w-sm">
      Enter your start and end points in the form to see a list of available
      buses for your journey.
    </p>
  </motion.div>
);

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-full"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full"
    ></motion.div>
    <p className="mt-4 font-semibold text-slate-600">Finding buses...</p>
  </motion.div>
);

const BusResults = ({ data }) => {
  const listVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    hidden: { opacity: 0 },
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex-shrink-0">
        Available Buses
      </h3>
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 overflow-y-auto pr-2 flex-grow"
      >
        {data.map((bus) => (
          <motion.li
            key={bus.id}
            variants={itemVariants}
            className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 text-purple-600 font-bold p-3 rounded-md">
                {bus.number}
              </div>
              <div>
                <p className="font-semibold text-slate-700">
                  Near: {bus.currentLocation}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {bus.eta} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {bus.capacity}% full
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight size={20} className="text-slate-400" />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

// ## Bus Selection Component  
const BusSelection = ({ buses, onSelectBus }) => (
  <div className="h-full overflow-y-auto">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Buses</h3>
      <p className="text-sm text-gray-600">Buses available for your selected route</p>
    </div>
    <div className="space-y-3">
      {buses.map((bus) => (
        <div
          key={bus.id}
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onSelectBus(bus)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full" style={{ backgroundColor: bus.color + '20' }}>
                <Bus size={20} style={{ color: bus.color }} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{bus.number}</h4>
                <p className="text-sm text-gray-600">{bus.route}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">ETA: {bus.eta} min</p>
              <p className="text-xs text-gray-500">{bus.capacity}% full</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ## Form Component
const JourneyForm = ({ showNotification, onRouteSearch, onBusSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busNo, setBusNo] = useState("");

  const handleFindRoute = () => {
    if (!from || !to) {
      showNotification("Please enter both start and end points.");
      return;
    }
    onRouteSearch(from, to);
  };

  const handleFindBus = () => {
    if (!busNo) {
      showNotification("Please enter a bus number.");
      return;
    }
    onBusSearch(busNo);
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Bus className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-bold">Plan Your Journey</h3>
        </div>

        <label className="block">
          <span className="text-slate-600 font-medium text-sm">
            Start Point
          </span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="e.g., Central Station"
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </label>
        <label className="block">
          <span className="text-slate-600 font-medium text-sm">End Point</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="e.g., Tech Park"
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </label>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 shadow-md"
          onClick={handleFindRoute}
        >
          Find Route <ArrowRight size={20} className="ml-2" />
        </motion.button>

        <div className="relative my-4 flex items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <label className="block">
          <span className="text-slate-600 font-medium text-sm">
            Find by Bus Number
          </span>
          <input
            type="text"
            value={busNo}
            onChange={(e) => setBusNo(e.target.value)}
            placeholder="e.g., 215A"
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md"
          onClick={handleFindBus}
        >
          Find Buses <Search size={20} className="ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ## Placeholder and Notification Components
const PlaceholderView = ({ title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center">
    <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md">{text}</p>
  </div>
);

const Notification = ({ message }) => (
  <>
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-5 right-5 z-[100] bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-3"
        >
          <Bell size={20} className="text-purple-400" />
          <p className="font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
    <style jsx="true">{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }

      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }

      /* ---- STYLES FOR MAP MARKERS ---- */
      .user-marker {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #1e90ff;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 2px #1e90ff;
        cursor: pointer;
      }
    `}</style>
  </>
);

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Menu,
  X,
  MapPin,
  Award,
  Settings,
  User,
  Bus,
  ArrowRight,
  Bell,
  LogOut,
} from "lucide-react";

// Mapbox Access Token - replace with your actual token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiYW53YXkiLCJhIjoiY204cnBnMTI4MGJhZTJqcW9zanFsdHQ5dyJ9.8vPWczyzy17xKv0wYenDOg';

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

// Main DriverPage Component
export default function DriverPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Journey");
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState({
    firstName: "Guest",
    lastName: "",
  });

  // Effect to handle window resize for sidebar visibility
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

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to show a notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Logout handler function
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

  const mainContentClass =
    isSidebarOpen && window.innerWidth >= 1024
      ? "ml-64 transition-all duration-500 ease-out"
      : "transition-all duration-500 ease-out";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showNotification={showNotification}
        user={user}
        onLogout={handleLogout}
      />

      <main className={mainContentClass}>
        <Header
          sidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <DashboardContent
            activeTab={activeTab}
            showNotification={showNotification}
          />
        </div>
      </main>

      <Notification message={notification} />
    </div>
  );
}

// Sidebar Component
const Sidebar = ({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  showNotification,
  user,
  onLogout,
}) => {
  const navItems = [
    { name: "Journey", icon: MapPin },
    { name: "Rewards", icon: Award },
    { name: "Settings", icon: Settings },
  ];

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    showNotification(`Switched to ${tabName} view`);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-100 p-6 flex flex-col shadow-2xl z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-white tracking-wider">BUZZ</h1>
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
                  ? "bg-blue-500 text-white shadow-lg"
                  : "hover:bg-slate-700/50"
              }`}
              onClick={() => handleTabClick(item.name)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col space-y-3">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-slate-300 hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0] || "D"}
            </div>
            <div>
              <p className="font-semibold text-white">
                {user ? `${user.firstName} ${user.lastName}` : "Driver"}
              </p>
              <p className="text-xs text-slate-400">Expert Driver</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
    </>
  );
};

// Header Component
const Header = ({ sidebarToggle, user }) => {
  return (
    <header className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-30 p-4 sm:p-6 flex justify-between items-center border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button
          onClick={sidebarToggle}
          className="p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          Driver Dashboard
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-50"></span>
        </button>
        <div className="w-px h-6 bg-slate-300 hidden sm:block"></div>
        <div className="hidden sm:flex items-center space-x-2">
          <span className="font-semibold text-slate-600">
            {user.firstName} {user.lastName}
          </span>
          <User size={22} className="text-slate-500" />
        </div>
      </div>
    </header>
  );
};

// Content Area
const DashboardContent = ({ activeTab, showNotification }) => {
  return (
    <div key={activeTab} className="animate-fadeIn">
      {activeTab === "Journey" && (
        <JourneyView showNotification={showNotification} />
      )}
      {activeTab === "Rewards" && (
        <PlaceholderView
          title="Your Rewards"
          text="Check back soon for exciting rewards!"
        />
      )}
      {activeTab === "Settings" && (
        <PlaceholderView
          title="Application Settings"
          text="Customize your experience here."
        />
      )}
    </div>
  );
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

const JourneyView = ({ showNotification }) => {
  const mapViewRef = useRef(null);

  const handleRouteDisplay = async (startPoint, endPoint, routeName, showNotification) => {
    if (mapViewRef.current) {
      // First, check if this matches a predefined route
      const detectedRoute = detectRoute(startPoint, endPoint);
      
      if (detectedRoute && ORIGINAL_ROUTES[detectedRoute]) {
        console.log('Using predefined route:', detectedRoute);
        // Display original route
        if (mapViewRef.current.displayOriginalRoute) {
          mapViewRef.current.displayOriginalRoute(detectedRoute);
        }
        
        // Add bus marker for the route
        const route = ORIGINAL_ROUTES[detectedRoute];
        const startCoord = route.coordinates[0];
        if (mapViewRef.current.addCurrentBusLocation) {
          mapViewRef.current.addCurrentBusLocation(detectedRoute, startCoord, route.name, route.color);
        }
        
        showNotification(`🚌 Original route found: ${route.name}`);
        return;
      }
      
      // Fall back to custom route display using Mapbox Directions API
      console.log('Using dynamic routing for:', startPoint, 'to', endPoint);
      if (mapViewRef.current.displayRoute) {
        await mapViewRef.current.displayRoute(startPoint, endPoint, showNotification, routeName);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <MapView ref={mapViewRef} />
      </div>
      <div className="xl:col-span-2">
        <JourneyForm 
          showNotification={showNotification} 
          onRouteDisplay={handleRouteDisplay}
        />
      </div>
    </div>
  );
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
        coordinates: [88.2649, 22.4707],
        name: 'Garia',
        routes: ['215A'],
        type: 'regular'
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
      markerElement.innerHTML = '�';

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
    if (!map.current || !ORIGINAL_ROUTES[routeKey]) return;

    const route = ORIGINAL_ROUTES[routeKey];
    console.log(`🗺️ Displaying original route: ${route.name}`);

    // Remove existing route
    if (routeSourceRef.current && map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeLayer('route-arrows');
      map.current.removeSource('route');
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

    // Add source and layer
    map.current.addSource('route', {
      type: 'geojson',
      data: routeGeoJSON
    });

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
  };

  const displayRoute = async (startPoint, endPoint, showNotification, selectedRoute = '215A') => {
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Map...</p>
            <p className="text-xs text-slate-400 mt-2">Initializing Mapbox...</p>
          </div>
        </div>
      )}
    </div>
  );
});

// Journey Form Component
const JourneyForm = ({ showNotification, onRouteDisplay }) => {
  const [routeNo, setRouteNo] = useState("215A");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  const handleStartJourney = async () => {
    if (!startPoint || !endPoint) {
      showNotification("Please fill in start and end points!");
      return;
    }
    
    // Display the route on map with automatic detection
    if (onRouteDisplay) {
      await onRouteDisplay(startPoint, endPoint, routeNo, showNotification);
    }
    
    showNotification(
      `🚌 Journey started: Route ${routeNo} from ${startPoint} to ${endPoint}!`
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-96 opacity-0 animate-fadeIn">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Bus className="text-white" size={24} />
          </div>
          <h3 className="text-xl font-bold">Plan Your Journey</h3>
        </div>

        <label className="block">
          <span className="text-slate-600 font-medium text-sm">
            Bus Route No.
          </span>
          <input
            type="text"
            placeholder="e.g., AC-9, 215A, S-7"
            value={routeNo}
            onChange={(e) => setRouteNo(e.target.value)}
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50"
          />
        </label>
        
        <label className="block">
          <span className="text-slate-600 font-medium text-sm">
            Start Point
          </span>
          <input
            type="text"
            placeholder="e.g., Howrah Station"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </label>
        <label className="block">
          <span className="text-slate-600 font-medium text-sm">End Point</span>
          <input
            type="text"
            placeholder="e.g., Salt Lake Sector V"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </label>
        <button
          className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          onClick={handleStartJourney}
        >
          Start Journey <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

// Placeholder for other tabs
const PlaceholderView = ({ title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center opacity-0 animate-fadeIn">
    <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md">{text}</p>
  </div>
);

// Notification Component
const Notification = ({ message }) => (
  <>
    {message && (
      <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-3 animate-slideUp">
        <Bell size={20} className="text-blue-500" />
        <p className="font-medium">{message}</p>
      </div>
    )}
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

      /* ---- NEW: STYLE FOR USER LOCATION MARKER ---- */
      .user-marker {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #1e90ff; /* Dodger Blue */
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 2px #1e90ff;
        cursor: pointer;
      }
    `}</style>
  </>
);

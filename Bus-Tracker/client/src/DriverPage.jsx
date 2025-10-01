import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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

// Mapbox Access Token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

// Utility function to create safe CSS IDs from route names
const createSafeCSSId = (str) => {
  return str.replace(/[^a-zA-Z0-9-_]/g, "-");
};

// Main DriverPage Component
export default function DriverPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Journey");
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState({ firstName: "Guest", lastName: "" });

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
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    showNotification("You have been successfully logged out.");
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

const JourneyView = ({ showNotification }) => {
  const mapViewRef = useRef(null);

  const handleRouteDisplay = async (route, showNotification) => {
    if (mapViewRef.current && mapViewRef.current.displayRoute) {
      await mapViewRef.current.displayRoute(route, showNotification);
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

const MapView = forwardRef((_, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);
  const currentBusMarkerRef = useRef(null);
  const routeSourceRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error("❌ Mapbox access token is missing");
      setError("Mapbox access token is missing.");
      setIsLoading(false);
      return;
    }

    const initializeMap = () => {
      if (!mapContainer.current) {
        setTimeout(initializeMap, 100);
        return;
      }

      if (map.current) {
        return;
      }

      try {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [88.3639, 22.5726], // Kolkata city center
          zoom: 11,
          attributionControl: false,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true,
          }),
          "top-right"
        );

        map.current.on("load", () => {
          setIsLoading(false);
          setError(null);
          addCurrentBusLocation("Your Location");
        });

        map.current.on("error", (e) => {
          setError(`Map error: ${e.error?.message || "Unknown error"}`);
          setIsLoading(false);
        });

        setTimeout(() => {
          if (map.current && !map.current.loaded()) {
            setError(
              "Map loading timeout. Please check your internet connection."
            );
            setIsLoading(false);
          }
        }, 15000);
      } catch (err) {
        setError(`Initialization error: ${err.message}`);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(initializeMap, 1000);
    return () => {
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!map.current || isLoading) return;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoordinates = [longitude, latitude];
        setCurrentPosition(newCoordinates);
        if (currentBusMarkerRef.current) {
          currentBusMarkerRef.current.setLngLat(newCoordinates);
        } else {
          addCurrentBusLocation("Your Location", newCoordinates);
        }
        // Send location to backend
        sendLocationToBackend(newCoordinates);
      },
      (err) => {
        setError(
          "Could not get location. Please grant permission and ensure you have a signal."
        );
      },
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isLoading]);

  const sendLocationToBackend = async (coordinates) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const driverId = userData?.id || "unknown";
      const response = await fetch(
        "http://localhost:5000/api/driver/publish-location",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId,
            latitude: coordinates[1],
            longitude: coordinates[0],
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to send location:", data.error);
      }
    } catch (err) {
      console.error("Error sending location:", err);
    }
  };

  const addCurrentBusLocation = (
    routeName = "Live Bus",
    customCoord = null,
    customColor = null
  ) => {
    if (!map.current) return;

    const color = customColor || "#2196F3";
    const name = routeName;
    const bgGradient = `linear-gradient(135deg, ${color}, ${color}CC)`;
    const coordinates = customCoord || [88.3639, 22.5726];

    const currentBusData = {
      coordinates,
      name,
      driverName:
        JSON.parse(localStorage.getItem("userData"))?.firstName || "Driver 1",
      color,
      bgGradient,
    };

    if (currentBusMarkerRef.current) {
      currentBusMarkerRef.current.remove();
    }

    const currentBusElement = document.createElement("div");
    const safeRouteId = createSafeCSSId(name);
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
    currentBusElement.innerHTML = "🚌";

    if (!document.querySelector(`#bus-marker-styles-${safeRouteId}`)) {
      const style = document.createElement("style");
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
          top: -8px; left: -8px; right: -8px; bottom: -8px;
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

    const currentBusPopup = new mapboxgl.Popup({
      offset: 30,
      closeButton: true,
      className: "current-bus-popup",
    }).setHTML(`
      <div style="padding: 12px; min-width: 200px; background: ${currentBusData.bgGradient}; color: white; border-radius: 8px; margin: -10px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; display: flex; align-items: center;">
          🚌 ${currentBusData.name}
        </h3>
        <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 6px; margin-bottom: 8px;">
          <div style="font-size: 12px;"><strong>Driver:</strong> ${currentBusData.driverName}</div>
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
  };

  const displayRoute = async (route, showNotification) => {
    if (!map.current) return;

    const routeColor = "#FF5722";
    try {
      showNotification("🗺️ Fetching navigation route...");

      // Clear existing route layers and markers
      if (routeSourceRef.current && map.current.getSource("route")) {
        map.current.removeLayer("route-line");
        map.current.removeLayer("route-arrows");
        map.current.removeSource("route");
      }
      markersRef.current.forEach((marker) => {
        if (
          marker._element &&
          marker._element.classList.contains("route-marker")
        ) {
          marker.remove();
        }
      });
      markersRef.current = [];

      // Add stops as markers
      route.stops.forEach((stop, index) => {
        const markerElement = document.createElement("div");
        markerElement.className = "route-marker";
        markerElement.style.cssText = `
          width: 40px; height: 40px; background: linear-gradient(135deg, #4CAF50, #81C784);
          border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(76,175,80,0.4);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 18px; color: white;
        `;
        markerElement.innerHTML =
          index === 0 ? "🚀" : index === route.stops.length - 1 ? "🏁" : "🛑";

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; text-align: center;">
            <h4 style="margin: 0 0 4px 0; color: #4CAF50; font-size: 14px;">
              ${
                index === 0
                  ? "Start"
                  : index === route.stops.length - 1
                  ? "End"
                  : "Stop"
              }: ${stop.name}
            </h4>
            <p style="margin: 0; font-size: 12px; color: #666;">${
              stop.coordinates.latitude
            }, ${stop.coordinates.longitude}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([stop.coordinates.longitude, stop.coordinates.latitude])
          .setPopup(popup)
          .addTo(map.current);
        markersRef.current.push(marker);
      });

      // Get navigation route instead of straight lines
      const waypoints = route.stops
        .map(
          (stop) => `${stop.coordinates.longitude},${stop.coordinates.latitude}`
        )
        .join(";");

      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (!response.ok || !data.routes || data.routes.length === 0) {
        throw new Error(
          data.message || "Failed to fetch route from Mapbox API."
        );
      }

      const routeGeometry = data.routes[0].geometry;

      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: routeGeometry,
        },
      });

      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": routeColor,
          "line-width": 6,
          "line-opacity": 0.8,
        },
      });

      map.current.addLayer({
        id: "route-arrows",
        type: "symbol",
        source: "route",
        layout: {
          "symbol-placement": "line",
          "text-field": "▶",
          "text-size": 16,
          "symbol-spacing": 100,
          "text-keep-upright": false,
          "text-rotation-alignment": "map",
        },
        paint: {
          "text-color": routeColor,
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      routeSourceRef.current = "route";

      // Update bus marker
      addCurrentBusLocation(
        route.route_name,
        [
          route.start_location.coordinates.longitude,
          route.start_location.coordinates.latitude,
        ],
        routeColor
      );

      // Fit map to route bounds
      const bounds = new mapboxgl.LngLatBounds();
      routeGeometry.coordinates.forEach((coord) => bounds.extend(coord));
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 2000,
      });

      showNotification(
        `✅ Route ${route.route_name} displayed with ${route.stops.length} stops.`
      );
    } catch (error) {
      console.error("Route display error:", error);
      showNotification("❌ Error displaying route. Please try again.");
    }
  };

  useImperativeHandle(ref, () => ({
    displayRoute,
    addCurrentBusLocation,
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
              <li>1. Check your Mapbox token in your .env file</li>
              <li>2. Ensure the token starts with 'pk.'</li>
              <li>3. Restart your development server</li>
              <li>4. Check your browser's developer console for errors</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96 relative">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ position: "relative" }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-white rounded-xl shadow-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Map...</p>
            <p className="text-xs text-slate-400 mt-2">
              Initializing Mapbox...
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

const JourneyForm = ({ showNotification, onRouteDisplay }) => {
  const [allRoutes, setAllRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/route");
        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setAllRoutes(data);
      } catch (error) {
        console.error("Failed to fetch routes:", error);
        showNotification("❌ Could not load bus routes.");
      }
    };
    fetchRoutes();
  }, [showNotification]);

  const handleStartJourney = async () => {
    if (!selectedRouteId) {
      showNotification("Please select a bus route!");
      return;
    }

    const selectedRoute = allRoutes.find(
      (route) => route.route_id === selectedRouteId
    );
    if (!selectedRoute) {
      showNotification("Selected route not found!");
      return;
    }

    await onRouteDisplay(selectedRoute, showNotification);
    showNotification(
      `🚌 Journey started for route ${selectedRoute.route_name}!`
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
            Select Bus Route
          </span>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-slate-50"
          >
            <option value="">Select a route</option>
            {allRoutes.map((route) => (
              <option key={route.route_id} value={route.route_id}>
                {route.route_id}
                {route.route_name}
              </option>
            ))}
          </select>
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

const PlaceholderView = ({ title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center opacity-0 animate-fadeIn">
    <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md">{text}</p>
  </div>
);

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

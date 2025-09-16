import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// Main DriverPage Component
export default function DriverPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Journey");
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
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
        <div className="mt-auto">
          <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {user.firstName[0]}
            </div>
            <div>
              <p className="font-semibold text-white">
                {user.firstName} {user.lastName}
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

const JourneyView = ({ showNotification }) => (
  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
    <div className="xl:col-span-3">
      <MapView />
    </div>
    <div className="xl:col-span-2">
      <JourneyForm showNotification={showNotification} />
    </div>
  </div>
);

// Simplified Map View Component (without Google Maps dependency)
const MapView = () => {
  const [center, setCenter] = useState({ lat: 22.5726, lng: 88.3639 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }, []);

  return (
    <div className="bg-slate-800 p-1 rounded-xl shadow-lg h-96 xl:h-full overflow-hidden opacity-0 animate-fadeIn">
      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center relative">
        {/* Mock map interface */}
        <div className="absolute inset-4 bg-slate-600 rounded-lg opacity-20"></div>
        <div className="text-center z-10">
          <MapPin className="text-blue-400 mx-auto mb-2" size={48} />
          <p className="text-white font-semibold">Interactive Map</p>
          <p className="text-slate-400 text-sm mt-1">
            Location: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </p>
          <div className="mt-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto animate-pulse"></div>
            <p className="text-xs text-slate-300 mt-1">Current Location</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Journey Form Component
const JourneyForm = ({ showNotification }) => {
  const [routeNo, setRouteNo] = useState("215A");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  const handleStartJourney = () => {
    if (!startPoint || !endPoint) {
      showNotification("Please fill in start and end points!");
      return;
    }
    showNotification(
      `Journey started: Route ${routeNo} from ${startPoint} to ${endPoint}!`
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full opacity-0 animate-fadeIn">
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
            placeholder="e.g., Central Station"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </label>
        <label className="block">
          <span className="text-slate-600 font-medium text-sm">End Point</span>
          <input
            type="text"
            placeholder="e.g., Tech Park"
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
    <style jsx>{`
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
    `}</style>
  </>
);

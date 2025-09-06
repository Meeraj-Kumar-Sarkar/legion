import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState("Journey");
  const [notification, setNotification] = useState(null);

  // Effect to handle window resize for sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
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
      />

      <motion.main
        className="relative" // Simplified className
        variants={mainContentVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        // CHANGED: Synced transition with the sidebar for a cohesive and smooth feel.
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
      >
        <Header sidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
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

// Sidebar Component
const Sidebar = ({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  showNotification,
}) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

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
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            // CHANGED: Replaced 'spring' with a custom 'ease' curve for a much smoother slide.
            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
            className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-100 p-6 flex flex-col shadow-2xl z-50"
          >
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-2xl font-bold text-white tracking-wider">
                DriverHub
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
                      ? "bg-indigo-600 text-white shadow-lg"
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
                <img
                  src="https://placehold.co/40x40/6366f1/ffffff?text=U"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">John Doe</p>
                  <p className="text-xs text-slate-400">Expert Driver</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        ></div>
      )}
    </>
  );
};

// (The rest of the components remain unchanged as the fix is in the main layout animation.)
// Header Component
const Header = ({ sidebarToggle }) => (
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
        <span className="font-semibold text-slate-600">John Doe</span>
        <User size={22} className="text-slate-500" />
      </div>
    </div>
  </header>
);

// Content Area
const DashboardContent = ({ activeTab, showNotification }) => {
  return (
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
      </motion.div>
    </AnimatePresence>
  );
};

const JourneyView = ({ showNotification }) => (
  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
    <div className="xl:col-span-3">
      <MapPlaceholder />
    </div>
    <div className="xl:col-span-2">
      <JourneyForm showNotification={showNotification} />
    </div>
  </div>
);

// Map Placeholder Component
const MapPlaceholder = () => (
  <motion.div
    className="bg-slate-800 p-4 rounded-xl shadow-lg h-96 xl:h-full flex flex-col justify-between"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.1, duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-white">Live Map View</h3>
      <span className="text-xs font-medium bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
        ● Live
      </span>
    </div>
    <div className="flex-grow flex items-center justify-center">
      <p className="text-slate-400 text-lg">[ Interactive Map Placeholder ]</p>
    </div>
  </motion.div>
);

// Journey Form Component
const JourneyForm = ({ showNotification }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg h-full"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
  >
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Bus className="text-indigo-600" size={24} />
        </div>
        <h3 className="text-xl font-bold">Plan Your Journey</h3>
      </div>

      <label className="block">
        <span className="text-slate-600 font-medium text-sm">
          Bus Route No.
        </span>
        <input
          type="text"
          defaultValue="215A"
          className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50"
        />
      </label>
      <label className="block">
        <span className="text-slate-600 font-medium text-sm">Start Point</span>
        <input
          type="text"
          placeholder="e.g., Central Station"
          className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
      </label>
      <label className="block">
        <span className="text-slate-600 font-medium text-sm">End Point</span>
        <input
          type="text"
          placeholder="e.g., Tech Park"
          className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
      </label>
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
        onClick={() => showNotification("Your journey has started!")}
      >
        Start Journey <ArrowRight size={20} className="ml-2" />
      </motion.button>
    </div>
  </motion.div>
);

// Placeholder for other tabs
const PlaceholderView = ({ title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center">
    <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md">{text}</p>
  </div>
);

// Notification Component
const Notification = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-3"
      >
        <Bell size={20} className="text-indigo-400" />
        <p className="font-medium">{message}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

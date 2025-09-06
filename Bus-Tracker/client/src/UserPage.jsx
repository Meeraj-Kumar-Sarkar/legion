import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

// ## Main UserPage Component
export default function UserPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState("Journey");
  const [notification, setNotification] = useState(null);

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
        <Header
          sidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          userName="Jane Doe"
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
            // CHANGED: Replaced 'spring' with a custom 'ease' curve for a much smoother slide.
            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
            className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-100 p-6 flex flex-col shadow-2xl z-50"
          >
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-2xl font-bold text-white tracking-wider">
                CommuteApp
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
            <div className="mt-auto">
              <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg">
                <img
                  src="https://placehold.co/40x40/a78bfa/ffffff?text=U"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">Jane Doe</p>
                  <p className="text-xs text-slate-400">Daily Commuter</p>
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

// (The rest of the components: Header, DashboardContent, JourneyView, JourneyForm, etc., remain unchanged as the fix is only in the animation timing of the main layout.)
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
  // ** State to hold bus results and loading status
  const [busResults, setBusResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ** Mock bus data for demonstration
  const mockBusData = [
    {
      id: 1,
      number: "215A",
      eta: 5,
      currentLocation: "Market Square",
      capacity: 75,
    },
    {
      id: 2,
      number: "101C",
      eta: 12,
      currentLocation: "City Library",
      capacity: 90,
    },
    {
      id: 3,
      number: "45B",
      eta: 18,
      currentLocation: "Park Street",
      capacity: 60,
    },
  ];

  // ** Function to handle the search, passed to the form
  const handleRouteSearch = (from, to) => {
    setIsLoading(true);
    setBusResults(null); // Clear previous results
    showNotification(`Searching routes from ${from} to ${to}...`);

    // ** Simulate an API call
    setTimeout(() => {
      setBusResults(mockBusData);
      setIsLoading(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        {/* ## Dynamic Content Area */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-96 xl:h-full flex flex-col">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSpinner key="loader" />
            ) : busResults ? (
              <BusResults key="results" data={busResults} />
            ) : (
              <InitialMessage key="initial" />
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="xl:col-span-2">
        <JourneyForm
          showNotification={showNotification}
          onRouteSearch={handleRouteSearch}
        />
      </div>
    </div>
  );
};

// ## Form Component
const JourneyForm = ({ showNotification, onRouteSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busNo, setBusNo] = useState("");

  const handleFindRoute = () => {
    if (!from || !to) {
      showNotification("Please enter both start and end points.");
      return;
    }
    // ** Call the parent function to trigger search
    onRouteSearch(from, to);
  };

  const handleFindBus = () => {
    if (!busNo) {
      showNotification("Please enter a bus number.");
      return;
    }
    showNotification(`Searching for Bus No. ${busNo}...`);
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

// ## New Components for Dynamic Content Area

// ** Component to show before any search
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

// ** Loading Spinner Component
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

// ** Bus Results List Component
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

// ## Placeholder and Notification Components
const PlaceholderView = ({ title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center">
    <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md">{text}</p>
  </div>
);

const Notification = ({ message }) => (
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
);

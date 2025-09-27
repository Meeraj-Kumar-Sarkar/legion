import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Settings,
  User,
  Bus,
  Bell,
  LogOut,
  PlusCircle,
  Trash2,
  Save,
  Route,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building,
} from "lucide-react";

// ## Main AdminPage Component
export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState("Manage Routes");
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
    // Mock admin user data, in a real app you'd fetch this
    setUser({
      firstName: "Admin",
      lastName: "User",
      role: "Administrator",
    });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLogout = () => {
    showNotification("You have been successfully logged out.");
    // In a real app, you would redirect or clear auth tokens
    setTimeout(() => {
      // window.location.href = "/signin";
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
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showNotification={showNotification}
        user={user}
        onLogout={handleLogout}
      />
      <motion.main
        className="relative"
        variants={mainContentVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
      >
        <Header
          sidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          userName={user ? `${user.firstName}` : "Admin"}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <DashboardContent
            activeTab={activeTab}
            showNotification={showNotification}
          />
        </div>
      </motion.main>
      <Notification item={notification} />
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
  onLogout,
}) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };
  const navItems = [
    { name: "Manage Routes", icon: Route },
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
                BUZZ ADMIN
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
                  src={`https://placehold.co/40x40/a78bfa/ffffff?text=A`}
                  alt="Admin Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">
                    {user ? `${user.firstName} ${user.lastName}` : "Admin"}
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
        Admin Dashboard
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
      {activeTab === "Manage Routes" && (
        <ManageRoutesView showNotification={showNotification} />
      )}
      {activeTab === "Settings" && (
        <PlaceholderView
          title="Admin Settings"
          text="Manage application-wide settings and administrator preferences here."
        />
      )}
    </motion.div>
  </AnimatePresence>
);

// ## Bus Data Management View
const ManageRoutesView = ({ showNotification }) => {
  const initialBusData = {
    route_id: "215",
    route_name: "Moonbeam to Howrah Station",
    start_location: {
      name: "Moonbeam",
      address: "Moonbeam, Kolkata",
      coordinates: { latitude: 22.627116, longitude: 88.464429 },
    },
    end_location: {
      name: "Howrah Station",
      address: "Howrah Station, Howrah",
      coordinates: { latitude: 22.5833, longitude: 88.3369 },
    },
    distance_km: 18.2,
    estimated_travel_time_minutes: 50,
    frequency_minutes: 20,
    operating_hours: { start_time: "05:30", end_time: "22:30" },
    bus_type: "Standard Non-AC",
    capacity: 50,
    fare: { standard: 15.0, discounted: 5.0, currency: "INR" },
    stops: [
      {
        stop_id: "S215_01",
        name: "Akankha More",
        sequence: 1,
        coordinates: { latitude: 22.6186, longitude: 88.4632 },
      },
    ],
    accessibility_features: ["Priority seating", "Audio announcements"],
    operator: {
      name: "West Bengal Transport Corporation",
      contact: { phone: "+91-33-1234-5678", email: "info@wbtc.co.in" },
    },
    last_updated: new Date().toISOString(),
  };

  const [busData, setBusData] = useState(initialBusData);
  const [stops, setStops] = useState(initialBusData.stops);

  const handleInputChange = (e, path) => {
    const { name, value } = e.target;
    const keys = path ? `${path}.${name}`.split(".") : [name];

    setBusData((prev) => {
      let current = { ...prev };
      let pointer = current;
      for (let i = 0; i < keys.length - 1; i++) {
        pointer[keys[i]] = { ...pointer[keys[i]] };
        pointer = pointer[keys[i]];
      }
      pointer[keys[keys.length - 1]] = value;
      return current;
    });
  };

  const handleStopChange = (index, field, value) => {
    const newStops = [...stops];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newStops[index][parent][child] = value;
    } else {
      newStops[index][field] = value;
    }
    setStops(newStops);
  };

  const addStop = () => {
    setStops([
      ...stops,
      {
        stop_id: "",
        name: "",
        sequence: stops.length + 1,
        coordinates: { latitude: "", longitude: "" },
      },
    ]);
  };

  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const finalBusData = {
      ...busData,
      stops,
      last_updated: new Date().toISOString(),
    };
    console.log("Saving Bus Data:", JSON.stringify(finalBusData, null, 2));
    showNotification("Bus route data saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Bus Route</h2>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
        >
          <Save size={20} />
          Save Route
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Route Information" icon={<Route />}>
            <Input
              label="Route ID"
              name="route_id"
              value={busData.route_id}
              onChange={handleInputChange}
            />
            <Input
              label="Route Name"
              name="route_name"
              value={busData.route_name}
              onChange={handleInputChange}
            />
          </Card>
          <Card title="Start Location" icon={<MapPin />}>
            <Input
              label="Name"
              name="name"
              value={busData.start_location.name}
              onChange={(e) => handleInputChange(e, "start_location")}
            />
            <Input
              label="Address"
              name="address"
              value={busData.start_location.address}
              onChange={(e) => handleInputChange(e, "start_location")}
            />
            <Input
              label="Latitude"
              name="latitude"
              value={busData.start_location.coordinates.latitude}
              onChange={(e) =>
                handleInputChange(e, "start_location.coordinates")
              }
              type="number"
            />
            <Input
              label="Longitude"
              name="longitude"
              value={busData.start_location.coordinates.longitude}
              onChange={(e) =>
                handleInputChange(e, "start_location.coordinates")
              }
              type="number"
            />
          </Card>
          <Card title="End Location" icon={<MapPin />}>
            <Input
              label="Name"
              name="name"
              value={busData.end_location.name}
              onChange={(e) => handleInputChange(e, "end_location")}
            />
            <Input
              label="Address"
              name="address"
              value={busData.end_location.address}
              onChange={(e) => handleInputChange(e, "end_location")}
            />
            <Input
              label="Latitude"
              name="latitude"
              value={busData.end_location.coordinates.latitude}
              onChange={(e) => handleInputChange(e, "end_location.coordinates")}
              type="number"
            />
            <Input
              label="Longitude"
              name="longitude"
              value={busData.end_location.coordinates.longitude}
              onChange={(e) => handleInputChange(e, "end_location.coordinates")}
              type="number"
            />
          </Card>
        </div>

        {/* Column 2 */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Timings & Operations" icon={<Clock />}>
            <Input
              label="Distance (km)"
              name="distance_km"
              value={busData.distance_km}
              onChange={handleInputChange}
              type="number"
            />
            <Input
              label="Travel Time (mins)"
              name="estimated_travel_time_minutes"
              value={busData.estimated_travel_time_minutes}
              onChange={handleInputChange}
              type="number"
            />
            <Input
              label="Frequency (mins)"
              name="frequency_minutes"
              value={busData.frequency_minutes}
              onChange={handleInputChange}
              type="number"
            />
            <Input
              label="Operating Start Time"
              name="start_time"
              value={busData.operating_hours.start_time}
              onChange={(e) => handleInputChange(e, "operating_hours")}
              type="time"
            />
            <Input
              label="Operating End Time"
              name="end_time"
              value={busData.operating_hours.end_time}
              onChange={(e) => handleInputChange(e, "operating_hours")}
              type="time"
            />
          </Card>
          <Card title="Fare & Capacity" icon={<DollarSign />}>
            <Input
              label="Bus Type"
              name="bus_type"
              value={busData.bus_type}
              onChange={handleInputChange}
            />
            <Input
              label="Capacity"
              name="capacity"
              value={busData.capacity}
              onChange={handleInputChange}
              type="number"
            />
            <Input
              label="Standard Fare"
              name="standard"
              value={busData.fare.standard}
              onChange={(e) => handleInputChange(e, "fare")}
              type="number"
            />
            <Input
              label="Discounted Fare"
              name="discounted"
              value={busData.fare.discounted}
              onChange={(e) => handleInputChange(e, "fare")}
              type="number"
            />
            <Input
              label="Currency"
              name="currency"
              value={busData.fare.currency}
              onChange={(e) => handleInputChange(e, "fare")}
            />
          </Card>
          <Card title="Operator" icon={<Building />}>
            <Input
              label="Name"
              name="name"
              value={busData.operator.name}
              onChange={(e) => handleInputChange(e, "operator")}
            />
            <Input
              label="Contact Phone"
              name="phone"
              value={busData.operator.contact.phone}
              onChange={(e) => handleInputChange(e, "operator.contact")}
            />
            <Input
              label="Contact Email"
              name="email"
              value={busData.operator.contact.email}
              onChange={(e) => handleInputChange(e, "operator.contact")}
              type="email"
            />
          </Card>
          <Card title="Accessibility" icon={<Users />}>
            <Input
              label="Features (comma-separated)"
              name="accessibility_features"
              value={busData.accessibility_features.join(", ")}
              onChange={(e) =>
                setBusData({
                  ...busData,
                  accessibility_features: e.target.value
                    .split(",")
                    .map((s) => s.trim()),
                })
              }
            />
          </Card>
        </div>

        {/* Column 3 */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Stops" icon={<Bus />}>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {stops.map((stop, index) => (
                <div
                  key={index}
                  className="p-3 border border-slate-200 rounded-lg space-y-2 relative"
                >
                  <button
                    onClick={() => removeStop(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                  <p className="font-semibold text-sm text-slate-600">
                    Stop {index + 1}
                  </p>
                  <Input
                    label="Stop ID"
                    value={stop.stop_id}
                    onChange={(e) =>
                      handleStopChange(index, "stop_id", e.target.value)
                    }
                  />
                  <Input
                    label="Name"
                    value={stop.name}
                    onChange={(e) =>
                      handleStopChange(index, "name", e.target.value)
                    }
                  />
                  <Input
                    label="Sequence"
                    value={stop.sequence}
                    onChange={(e) =>
                      handleStopChange(index, "sequence", e.target.value)
                    }
                    type="number"
                  />
                  <Input
                    label="Latitude"
                    value={stop.coordinates.latitude}
                    onChange={(e) =>
                      handleStopChange(
                        index,
                        "coordinates.latitude",
                        e.target.value
                      )
                    }
                    type="number"
                  />
                  <Input
                    label="Longitude"
                    value={stop.coordinates.longitude}
                    onChange={(e) =>
                      handleStopChange(
                        index,
                        "coordinates.longitude",
                        e.target.value
                      )
                    }
                    type="number"
                  />
                </div>
              ))}
            </div>
            <motion.button
              onClick={addStop}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
            >
              <PlusCircle size={18} /> Add Stop
            </motion.button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ## Reusable UI Components
const Card = ({ title, icon, children }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center space-x-3 mb-4">
      <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
        {icon || <Bus size={24} />}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <label className="block">
    <span className="text-slate-600 font-medium text-sm">{label}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition-shadow"
    />
  </label>
);

const PlaceholderView = ({ title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center">
    <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md">{text}</p>
  </div>
);

const Notification = ({ item }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-5 right-5 z-[100] text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-3 ${
          item.type === "error" ? "bg-red-600" : "bg-slate-900"
        }`}
      >
        <Bell size={20} className="text-purple-400" />
        <p className="font-medium">{item.message}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

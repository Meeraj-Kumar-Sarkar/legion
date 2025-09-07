import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import UserPage from "./UserPage";
import DriverPage from "./DriverPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/driver" element={<DriverPage />} />
    </Routes>
  );
}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("passenger"); // "passenger" or "admin"
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    licenseNumber: "",
    busNumber: "",
    experience: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all required fields!");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const action = isLogin ? "Login" : "Registration";
    const role = userType === "admin" ? "Bus Driver" : "Passenger";



    console.log(`${action} attempt for ${role}:`, formData);
    alert(`${action} successful for ${role}: ${formData.email}`);

    if (isLogin) {
      if (userType === "admin") {
        navigate("/driver");
      } else {
        navigate("/user");
      }
    }
  };



  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      licenseNumber: "",
      busNumber: "",
      experience: "",
    });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const switchUserType = (type) => {
    setUserType(type);
    resetForm();
  };

  return (
    <div className="min-h-screen background-container flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-sm rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4 text-4xl">
            {userType === "admin" ? "🚌" : "👤"}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600 mt-1">
            {userType === "admin" ? "Bus Driver Portal" : "Passenger Portal"}
          </p>
        </div>

        {/* User Type Toggle - FIXED VERSION */}
        <div className="mb-6">
          <div className="relative flex bg-gray-200 rounded-full p-1 max-w-sm mx-auto overflow-hidden">
            {/* Sliding pill - Fixed positioning */}
            <div
              className={`absolute top-1 bottom-1 bg-white rounded-full shadow-lg transition-all duration-500 ease-out ${
                userType === "passenger"
                  ? "left-1 right-1/2 mr-0.5"
                  : "left-1/2 right-1 ml-0.5"
              }`}
            />

            <button
              onClick={() => switchUserType("passenger")}
              className={`relative flex-1 flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
                userType === "passenger" ? "text-green-600" : "text-gray-600"
              }`}
            >
              👤 Passenger
            </button>

            <button
              onClick={() => switchUserType("admin")}
              className={`relative flex-1 flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
                userType === "admin" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              🚌 Bus Driver
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Registration Fields */}
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Meeraj"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Sarkar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📞
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+91 8697142536"
                  />
                </div>
              </div>

              {/* Admin-specific fields */}
              {userType === "admin" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver's License
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="DL123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years Experience
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ✉️
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={
                  userType === "admin"
                    ? "driver@company.com"
                    : "passenger@email.com"
                }
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              userType === "admin"
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                : "bg-green-600 hover:bg-green-700 shadow-green-200"
            } shadow-lg hover:shadow-xl`}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </div>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={switchMode}
              className={`ml-1 font-medium hover:underline transition-colors ${
                userType === "admin"
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-green-600 hover:text-green-700"
              }`}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Forgot Password */}
        {isLogin && (
          <div className="mt-4 text-center">
            <button
              className={`text-sm hover:underline transition-colors ${
                userType === "admin"
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-green-600 hover:text-green-700"
              }`}
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

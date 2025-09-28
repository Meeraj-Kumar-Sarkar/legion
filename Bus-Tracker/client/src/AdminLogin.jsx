"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      alert("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (!isLogin && (!formData.name || !formData.username)) {
      alert("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    try {
      const action = isLogin ? "login" : "signup";

      const apiData = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      console.log(
        "Sending request to:",
        `http://localhost:5000/api/admin/${action}`
      );
      console.log("Request data:", apiData);

      const response = await fetch(
        `http://localhost:5000/api/admin/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      // Check if response is HTML (error page)
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error(
          "Server returned an invalid response. Check if backend is running."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      // Save token and admin data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "admin");
      localStorage.setItem("userData", JSON.stringify(data.admin));

      alert(`${isLogin ? "Login" : "Registration"} successful!`);

      if (isLogin) {
        navigate("/AdminLogin/Admin");
      } else {
        setIsLogin(true);
        resetForm();
      }
    } catch (error) {
      console.error("API Error:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen w-full background-container flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4 text-4xl text-gray-800">
            <Bus />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Admin Login" : "Admin Registration"}
          </h1>
          <p className="text-gray-600 mt-1">Administrator Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User />
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Choose a username"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl disabled:opacity-70"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={switchMode}
              className="ml-1 font-medium text-blue-600 hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

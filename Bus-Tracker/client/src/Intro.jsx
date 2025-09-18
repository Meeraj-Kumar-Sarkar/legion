import { Routes, Route, useNavigate } from "react-router-dom";
import App from "./App.jsx";
import UserPage from "./UserPage.jsx";

export default function EnterpriseHomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-green-600">TransitHub</h1>
        <div className="space-x-6 hidden md:flex">
          <a href="#services" className="hover:text-green-600">
            Services
          </a>
          <a href="#features" className="hover:text-green-600">
            Features
          </a>
          <a href="#about" className="hover:text-green-600">
            About
          </a>
          <a href="#contact" className="hover:text-green-600">
            Contact
          </a>
        </div>
        <button className="md:hidden text-gray-700">☰</button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-xl">
          <h2 className="text-4xl font-extrabold mb-4">
            Smart Transit Management
          </h2>
          <p className="text-lg mb-6">
            A unified platform for passengers and drivers — secure, efficient,
            and built for enterprise-level transport systems.
          </p>
          <div className="flex space-x-4">
            {/* <button
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium shadow-lg hover:scale-105 transition"
              onClick={() => navigate("/App/user")}
            >
              Search Bus
            </button> */}
            <button
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium shadow-lg hover:scale-105 transition"
              onClick={() => navigate("/App")}
            >
              Login
            </button>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1627163814192-97f2e2d76bac?q=80&w=1090&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Bus illustration"
          className="mt-8 md:mt-0 rounded-xl shadow-2xl w-full md:w-1/2"
        />
      </section>

      {/* Services Section */}
      <section id="services" className="px-8 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">Passenger Portal</h4>
            <p className="text-gray-600">
              Book rides, view schedules, and track journeys with ease.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">Driver Dashboard</h4>
            <p className="text-gray-600">
              Manage trips, monitor routes, and get real-time updates.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">Admin Control</h4>
            <p className="text-gray-600">
              Verify users, manage services, and ensure smooth operations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-16 bg-gray-100">
        <h3 className="text-3xl font-bold text-center mb-12">Core Features</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-semibold mb-2">
              Real-time Journey Tracking
            </h4>
            <p className="text-gray-600">
              Track your bus in real time with GPS integration.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-semibold mb-2">Seamless Payments</h4>
            <p className="text-gray-600">
              Secure, enterprise-grade payment gateway for smooth transactions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-semibold mb-2">Driver Verification</h4>
            <p className="text-gray-600">
              Multi-step authentication ensures safety for all passengers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-semibold mb-2">Analytics Dashboard</h4>
            <p className="text-gray-600">
              Admins get insights into fleet efficiency and passenger activity.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="px-8 py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">
          Ready to transform your transport system?
        </h3>
        <p className="mb-6">
          Join TransitHub today and experience the future of smart mobility.
        </p>
        <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium shadow-lg hover:scale-105 transition">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 bg-white border-t text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} TransitHub Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

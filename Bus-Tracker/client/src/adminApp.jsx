// ✅ ALL IMPORTS MUST BE AT THE TOP
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Component imports - make sure these are at the top too
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PassengerAuth from './components/PassengerAuth';
import DriverAuth from './components/DriverAuth';
// ... other imports

function App() {
  // ✅ Component logic goes here, after imports but before return
  
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/passenger/auth" element={<PassengerAuth />} />
          <Route path="/driver/auth" element={<DriverAuth />} />
          {/* ... other routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
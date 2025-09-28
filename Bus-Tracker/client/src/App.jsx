import { Routes, Route } from "react-router-dom";
import "./App.css";

// Import your page components
import LoginPage from "./LoginPage";
import UserPage from "./UserPage";
import DriverPage from "./DriverPage";

function App() {
  return (
    <Routes>
      {/* The LoginPage is now the root route */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/driver" element={<DriverPage />} />

      {/* A catch-all route for any undefined paths */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;

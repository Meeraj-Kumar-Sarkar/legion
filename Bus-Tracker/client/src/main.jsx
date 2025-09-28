import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Intro from "./Intro.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminPage from "./Admin.jsx"; // Make sure AdminPage is imported

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/AdminLogin/Admin" element={<AdminPage />} />
        <Route path="/App/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

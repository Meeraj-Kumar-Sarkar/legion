import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// ⭐️ IMPORT MQTT SERVICE TO INITIALIZE CONNECTION ⭐️
// Note the .js extension, which is good practice in ES Modules
import "./mqttService.js";

// --- Route Imports ---
import passengerAuth from "./routes/passengerAuth.js";
import driverAuth from "./routes/driverAuth.js";
import adminAuth from "./routes/adminAuth.js";
import router from "./routes/busRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas URI from environment variables
const MONGO_URI = process.env.MONGO_URI || process.env.VITE_SERVER_SRV;

// --- Connect to MongoDB ---
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// --- API Routes ---
app.use("/api/passenger", passengerAuth);
app.use("/api/driver", driverAuth);
app.use("/api/admin", adminAuth);
app.use("/api/route", router);

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("🚀 Server is running with MongoDB Atlas, MQTT, and Admin Auth");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
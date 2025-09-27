const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // for environment variables

// ⭐️ IMPORT MQTT SERVICE TO INITIALIZE CONNECTION ⭐️
const mqttClient = require("./mqttService");

// Routes
const passengerAuth = require("./routes/passengerAuth");
const driverAuth = require("./routes/driverAuth");
const adminAuth = require("./routes/adminAuth"); // ✅ NEW

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Atlas URI (use .env for security)
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://turnabroy_db_user:Turnab2006@cluster0.ex59emi.mongodb.net/authDB?retryWrites=true&w=majority";

// Connect MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Routes
app.use("/api/passenger", passengerAuth);
app.use("/api/driver", driverAuth);
app.use("/api/admin", adminAuth); // ✅ NEW

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running with MongoDB Atlas, MQTT, and Admin Auth");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
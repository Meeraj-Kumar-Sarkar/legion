// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const passengerAuth = require("./routes/passengerAuth");
const driverAuth = require("./routes/driverAuth");

const app = express();
app.use(express.json());
app.use(cors());

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/authDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Connection Error:", err));

// Routes
app.use("/api/passenger", passengerAuth);
app.use("/api/driver", driverAuth);

// test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

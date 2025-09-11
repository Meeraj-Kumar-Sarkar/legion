const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const passengerAuth = require("./routes/passengerAuth");
const driverAuth = require("./routes/driverAuth");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas URI
const MONGO_URI =
  "mongodb+srv://turnabroy_db_user:Turnab2006@cluster0.ex59emi.mongodb.net/authDB?retryWrites=true&w=majority";

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

// test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running with MongoDB Atlas");
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

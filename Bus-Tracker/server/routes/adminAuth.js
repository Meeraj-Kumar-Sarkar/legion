import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// 🔹 Admin Signup
router.post("/signup", async (req, res) => {
  try {
    // FIXED: Destructure the correct fields sent from the frontend
    const { first_name, last_name, driving_licence, email, password } = req.body;

    // check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // FIXED: Create the new admin with the correct field names
    const newAdmin = new Admin({
      first_name,
      last_name,
      driving_licence,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    // FIXED: Return the correct data in the success response
    res.status(201).json({
      message: "Admin registered successfully",
      admin: { first_name, last_name, email },
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err); // Added for better debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔹 Admin Login (This route was already correct)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      // FIXED: Sign the token with the correct user data fields
      { id: admin._id, email: admin.email, first_name: admin.first_name },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    // FIXED: Return the correct admin data fields
    res.json({
      message: "Login successful",
      token,
      admin: { first_name: admin.first_name, last_name: admin.last_name, email: admin.email },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err); // Added for better debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
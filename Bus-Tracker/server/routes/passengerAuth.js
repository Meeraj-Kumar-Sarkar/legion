import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Passenger from '../models/Passenger.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Passenger signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const exists = await Passenger.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (exists) return res.status(400).json({ error: 'Passenger with this email or phone already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const passenger = new Passenger({ firstName, lastName, phone, email: email.toLowerCase(), password: hashed });
    await passenger.save();

    const token = jwt.sign({ id: passenger._id, role: 'passenger' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Passenger registered successfully',
      token,
      user: { id: passenger._id, firstName, lastName, phone, email }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email or phone already exists' });
    }
    if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ error: 'Database connection error' });
    }
    console.error('Error in /signup:', err.message, err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Passenger login (email + password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const passenger = await Passenger.findOne({ email: email.toLowerCase() });
    if (!passenger) {
      return res.status(400).json({ error: 'Passenger not found' });
    }

    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: passenger._id, role: 'passenger' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: passenger._id,
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        phone: passenger.phone,
        email: passenger.email
      }
    });
  } catch (err) {
    console.error('Error in /login:', err.message, err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

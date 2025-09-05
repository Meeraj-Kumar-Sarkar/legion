const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Passenger = require('../models/Passenger');

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

    // check unique email/phone
    const exists = await Passenger.findOne({ $or: [{ email }, { phone }] });
    if (exists) return res.status(400).json({ error: 'Passenger with this email or phone already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const passenger = new Passenger({ firstName, lastName, phone, email, password: hashed });
    await passenger.save();

    // optional: return token so frontend can auto-login after signup
    const token = jwt.sign({ id: passenger._id, role: 'passenger' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Passenger registered successfully',
      token,
      user: { id: passenger._id, firstName, lastName, phone, email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Passenger login (email + password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const passenger = await Passenger.findOne({ email });
    if (!passenger) return res.status(400).json({ error: 'Passenger not found' });

    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: passenger._id, role: 'passenger' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: passenger._id, firstName: passenger.firstName, email: passenger.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

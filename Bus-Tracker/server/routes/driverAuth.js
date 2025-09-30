import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Driver from '../models/Driver.js';
import mqttClient from '../mqttService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Driver signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, confirmPassword, license, yearsExperience } = req.body;
    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword || !license || yearsExperience == null) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const exists = await Driver.findOne({ $or: [{ email }, { phone }] });
    if (exists) return res.status(400).json({ error: 'Driver with this email or phone already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const driver = new Driver({
      firstName, lastName, phone, email, password: hashed,
      license, yearsExperience: Number(yearsExperience)
    });
    await driver.save();

    const token = jwt.sign({ id: driver._id, role: 'driver' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Driver registered successfully',
      token,
      user: { id: driver._id, firstName, lastName, email, phone, license, yearsExperience }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Driver login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(400).json({ error: 'Driver not found' });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: driver._id, role: 'driver' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: driver._id, firstName: driver.firstName, lastName: driver.lastName, email: driver.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Publish real-time location
router.post('/publish-location', async (req, res) => {
  const { driverId, latitude, longitude } = req.body;

  if (!driverId || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Missing driver ID or location data' });
  }

  const topic = `bus/location/${driverId}`;
  const payload = JSON.stringify({
    lat: latitude,
    lng: longitude,
    timestamp: new Date().toISOString()
  });

  try {
    mqttClient.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error(`MQTT Publish Error for ${topic}:`, err);
        return res.status(500).json({ error: 'Failed to publish location via MQTT' });
      }
      console.log(`Published location for Driver ${driverId} to ${topic}`);
      res.status(200).json({ status: 'Location published successfully', topic });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during publish' });
  }
});

export default router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const mqttClient = require('../mqttService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Driver signup
router.post('/signup', async (req, res) => {
  // ... (existing signup logic remains the same) ...
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
  // ... (existing login logic remains the same) ...
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

// 2. ⭐️ NEW ROUTE: PUBLISH REAL-TIME LOCATION ⭐️
// A driver's device posts its location to this Express endpoint, 
// and the server relays it to the MQTT broker for passengers/admin to subscribe to.
router.post('/publish-location', async (req, res) => {
  // Assuming the device sends driverId, latitude, and longitude
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
    // Publish the message to the HiveMQ broker
    // QoS 1 (at least once) is a good standard for location data
    mqttClient.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error(`MQTT Publish Error for ${topic}:`, err);
        // Even if MQTT fails, we might still return success if the HTTP request is all we care about
        // But generally, you want to log and handle the error.
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

module.exports = router;
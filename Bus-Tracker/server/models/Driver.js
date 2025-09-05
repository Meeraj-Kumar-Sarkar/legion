const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  firstName:       { type: String, required: true },
  lastName:        { type: String, required: true },
  phone:           { type: String, required: true, unique: true },
  email:           { type: String, required: true, unique: true },
  password:        { type: String, required: true },
  license:         { type: String, required: true },
  yearsExperience: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);


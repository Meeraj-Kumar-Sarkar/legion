const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    password: { type: String, required: true, minlength: 6 }
});

module.exports = mongoose.model('Passenger', passengerSchema);
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define a schema that matches the structure of your busRoute.json data
const stopSchema = new mongoose.Schema({
    stop_id: String,
    name: String,
    sequence: Number,
    coordinates: {
        latitude: Number,
        longitude: Number,
    },
});

const busRouteSchema = new mongoose.Schema({
    route_id: { type: String, required: true, unique: true },
    route_name: String,
    start_location: { name: String, address: String },
    end_location: { name: String, address: String },
    stops: [stopSchema],
    distance_km: Number,
    bus_type: String,
});

// Create a Mongoose model. 
// Mongoose will look for the plural, lowercased version of this name,
// so 'BusRoute' becomes the 'busroutes' collection.
// If your collection is named 'bus_routes', specify it as the third argument.
const BusRoute = mongoose.model('BusRoute', busRouteSchema, 'bus_routes');


// --- API Endpoint to GET all bus routes ---
router.get('/', async (req, res) => {
    try {
        // Find all documents in the collection
        const routes = await BusRoute.find({});
        if (!routes || routes.length === 0) {
            return res.status(404).json({ message: 'No bus routes found.' });
        }
        // Send the routes as a JSON response
        res.status(200).json(routes);
    } catch (error) {
        console.error('Error fetching bus routes:', error);
        res.status(500).json({ message: 'Server error while fetching routes.' });
    }
});

export default router;
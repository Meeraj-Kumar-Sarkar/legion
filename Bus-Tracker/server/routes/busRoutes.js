import express from 'express';
// ✅ IMPORT THE CORRECT, DETAILED MODEL FROM 'routes.js'
import BusRoute from '../models/routes.js'; // Adjust path if needed

const router = express.Router();

// --- API Endpoint to GET all bus routes ---
// (Your existing GET code is here)
router.get('/', async (req, res) => {
    // ... your existing code
});


// ⭐ ADD THIS NEW ENDPOINT TO SAVE A ROUTE ⭐
router.post('/', async (req, res) => {
    try {
        // Create a new document in memory from the request body
        // This uses the detailed schema from 'routes.js'
        const newRoute = new BusRoute(req.body);

        // Save the new document to the MongoDB 'bus_routes' collection
        const savedRoute = await newRoute.save();

        // Send a success response back to the frontend
        res.status(201).json({
            message: 'Route successfully saved!',
            data: savedRoute
        });

    } catch (error) {
        // If there's an error (e.g., validation fails)
        console.error('Error saving route:', error);
        res.status(400).json({ message: 'Error saving route', error: error.message });
    }
});


export default router;
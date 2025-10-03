import mongoose from "mongoose";

// Sub-schema for coordinates to ensure consistency
const coordinateSchema = new mongoose.Schema(
    {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

// Sub-schema for location details (used for start, end, and stops)
const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        coordinates: {
            type: coordinateSchema,
            required: true,
        },
    },
    { _id: false }
);

// Sub-schema for individual stops along the route
const stopSchema = new mongoose.Schema(
    {
        stop_id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        sequence: {
            type: Number,
            required: true,
        },
        coordinates: {
            type: coordinateSchema,
            required: true,
        },
    },
    { _id: false }
);

const routeSchema = new mongoose.Schema(
    {
        route_id: {
            type: String,
            required: [true, "Route ID is required"],
            unique: true,
            trim: true,
        },
        route_name: {
            type: String,
            required: [true, "Route name is required"],
            trim: true,
        },
        start_location: {
            type: locationSchema,
            required: true,
        },
        end_location: {
            type: locationSchema,
            required: true,
        },
        distance_km: {
            type: Number,
        },
        estimated_travel_time_minutes: {
            type: Number,
        },
        frequency_minutes: {
            type: Number,
        },
        operating_hours: {
            start_time: String,
            end_time: String,
        },
        bus_type: {
            type: String,
        },
        capacity: {
            type: Number,
        },
        fare: {
            standard: Number,
            discounted: Number,
            currency: {
                type: String,
                default: "INR",
            },
        },
        stops: [stopSchema],
        accessibility_features: [String],
        operator: {
            name: String,
            contact: {
                phone: String,
                email: String,
            },
        },
        last_updated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// The variable name 'route' was used in the original file.
// We rename it to 'routeSchema' for clarity before exporting the model.
const Route = mongoose.model("Route", routeSchema);

export default Route;
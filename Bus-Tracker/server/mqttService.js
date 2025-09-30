// server/mqttService.js

// const mqtt = require('mqtt');
import mqtt from 'mqtt';
// ⚠️ REPLACE these placeholders with your actual HiveMQ Cloud details ⚠️
const HIVEMQ_HOST = "tls://a8c1ffa8b6454f88b0c7e1932ceba271.s1.eu.hivemq.cloud"; // e.g., tls://abcde12345.s1.eu.hivemq.cloud
const HIVEMQ_PORT = 8883; // Secure port for MQTT over TLS
const HIVEMQ_USERNAME = 'Meeraj';
const HIVEMQ_PASSWORD = 'Meeraj1234';

const options = {
    // Client ID must be unique
    clientId: `BusTrackerServer_${Math.random().toString(16).slice(2, 10)}`,
    username: HIVEMQ_USERNAME,
    password: HIVEMQ_PASSWORD,
    clean: true, // Clean session: start a fresh session on connect
    protocol: 'mqtts',
    port: HIVEMQ_PORT,
    reconnectPeriod: 1000, // Reconnect after 1 second if connection is lost
};

// Establish the connection
const mqttClient = mqtt.connect(HIVEMQ_HOST, options);

// --- Event Listeners ---

mqttClient.on('connect', () => {
    console.log('✅ MQTT Client Connected to HiveMQ Cloud');

    // Subscribe to topics the server needs to receive data from.
    // Example: Subscribing to bus location updates and status messages.
    // The '#' is a multi-level wildcard (matches anything after "bus/").
    mqttClient.subscribe('bus/#', (err) => {
        if (!err) {
            console.log("Subscribed to 'bus/#' for real-time data.");
        } else {
            console.error("Subscription Error:", err);
        }
    });
});

mqttClient.on('error', (error) => {
    console.error('❌ MQTT Connection/Client Error:', error);
});

mqttClient.on('message', (topic, message) => {
    // The message is a Buffer object, convert it to a string.
    const payload = message.toString();

    console.log(`[MQTT] Received on ${topic}: ${payload}`);

    // *** PLACE YOUR DATA PROCESSING LOGIC HERE ***
    // e.g., 
    // if (topic.startsWith('bus/location')) {
    //     const locationData = JSON.parse(payload);
    //     // Save to MongoDB, update live map state, etc.
    // } 
    //
    // if (topic.startsWith('bus/status')) {
    //     // Handle status updates
    // }
});

// Export the client so other Express routes can use the .publish() method
export default mqttClient;
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

// ✅ FIX: Add CORS options to allow connections from React frontend
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend to connect
        methods: ["GET", "POST"]
    }
});

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

if (!TOMTOM_API_KEY) {
    console.error("❌ Missing TomTom API Key! Check your .env file.");
} else {
    console.log("✅ TomTom API Key Loaded:", TOMTOM_API_KEY);
}

// Ski resorts with latitude & longitude
const resorts = {
    "Winter Park": { lat: 39.8860, lon: -105.7631 },
    "Breckenridge": { lat: 39.4822, lon: -106.0465 },
    "Eldora": { lat: 39.9375, lon: -105.5829 }
};

// Serve static frontend files
app.use(express.static("public"));

// ✅ FIX: Serve socket.io client script manually (if needed)
app.get("/socket.io/socket.io.js", (req, res) => {
    res.sendFile(require.resolve("socket.io-client/dist/socket.io.js"));
});

// Function to get route distance
async function getRouteDistance(origin, destination) {
    try {
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${origin.lat},${origin.lon}:${destination.lat},${destination.lon}/json?key=${TOMTOM_API_KEY}&routeType=fastest&travelMode=car`;

        console.log("🔗 TomTom API Request:", url);

        const response = await axios.get(url);

        console.log("📡 TomTom API Response:", JSON.stringify(response.data, null, 2));

        if (response.data.routes && response.data.routes.length > 0) {
            const distanceMeters = response.data.routes[0].summary.lengthInMeters;
            return (distanceMeters / 1609).toFixed(2); // Convert meters to miles
        } else {
            console.warn("⚠️ No valid routes found:", JSON.stringify(response.data, null, 2));
            return "N/A";
        }
    } catch (error) {
        console.error("❌ Error fetching distance from TomTom:", error.response?.data || error.message);
        return "N/A";
    }
}

// WebSocket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user-location", async (userCoords) => {
        console.log("Received user location:", userCoords);

        let distances = {};
        for (let resort in resorts) {
            distances[resort] = await getRouteDistance(userCoords, resorts[resort]);
        }

        // Send real-time distances to frontend
        socket.emit("distance-update", distances);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 3001; // ✅ FIX: Change port to avoid conflict with frontend
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
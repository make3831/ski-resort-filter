import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // ✅ Connect to WebSocket Server

const App = () => {
  const [distances, setDistances] = useState({}); // Store real-time distances
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [userLocation, setUserLocation] = useState("");

  // ✅ Listen for distance updates from WebSocket server
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket Server");
    });

    socket.on("distance-update", (updatedDistances) => {
      console.log("Received Distance Updates:", updatedDistances);
      setDistances(updatedDistances);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ✅ Fetch user’s real-time location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude.toFixed(4);
        const userLon = position.coords.longitude.toFixed(4);

        setLat(userLat);
        setLon(userLon);
        setUserLocation(`📍 Your Location: ${userLat}, ${userLon}`);
      }, (error) => {
        alert("⚠️ Location access denied. Please enable GPS.");
      });
    } else {
      alert("⚠️ Geolocation is not supported by this browser.");
    }
  };

  // ✅ Send user location to WebSocket server
  const sendUserLocation = () => {
    if (!lat || !lon) {
      alert("⚠️ Please enter valid coordinates or use '📍 Use My Location'");
      return;
    }

    const userCoords = { lat: parseFloat(lat), lon: parseFloat(lon) };
    console.log("📍 Sending User Location:", userCoords);
    socket.emit("user-location", userCoords);
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "30px" }}>
      <h1>🏔️ Find Your Ski Resort Distance</h1>

      {/* ✅ "Use My Location" Button */}
      <button onClick={getUserLocation}>📍 Use My Location</button>
      <p style={{ color: "#007bff", fontSize: "16px" }}>{userLocation}</p>

      {/* Latitude & Longitude Input Fields */}
      <label>Latitude:</label>
      <input
        type="text"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Enter your latitude"
      /><br/>

      <label>Longitude:</label>
      <input
        type="text"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        placeholder="Enter your longitude"
      /><br/>

      {/* ✅ "Get Distance" Button */}
      <button onClick={sendUserLocation}>📍 Get Distance</button>

      {/* ✅ Distance Results */}
      <h2>Distances to Ski Resorts:</h2>
      {Object.entries(distances).map(([resort, distance]) => (
        <p key={resort}>
          <strong>{resort}:</strong> {distance} miles
        </p>
      ))}
    </div>
  );
};

export default App;
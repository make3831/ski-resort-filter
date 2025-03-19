import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DistanceFinder = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [distances, setDistances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getDistances = async () => {
    if (!latitude || !longitude) {
      setError("Please enter valid latitude and longitude.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiURL = `https://api.theperfectmountain.com/api/getDistances?lat=${latitude}&lon=${longitude}`;
      console.log(`Fetching data from: ${apiURL}`);

      const response = await fetch(apiURL);
      const data = await response.json();
      
      console.log("API Response:", data); // Debugging log

      if (!response.ok || data.error) {
        setError(data.error || "Error fetching distances.");
        setDistances([]);
      } else {
        setDistances(data);
      }
    } catch (err) {
      setError("Error fetching distances.");
      console.error("Fetch error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("Distances Updated:", distances);
  }, [distances]); // Debugging log to track updates

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        backgroundImage: "url('https://silvertonmountain.com/wp-content/uploads/2023/12/AB-shot-of-Sven-2014.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1>
          <span role="img" aria-label="mountain">🏔️</span> Find Your Ski Resort Distance
        </h1>

        <button
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px 20px",
          }}
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude.toFixed(4));
                setLongitude(position.coords.longitude.toFixed(4));
              },
              () => setError("Unable to retrieve location.")
            );
          }}
        >
          <span role="img" aria-label="location pin">📍</span> Use My Location
        </button>

        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          style={{
            textAlign: "center",
            width: "80%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            margin: "5px auto",
          }}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          style={{
            textAlign: "center",
            width: "80%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            margin: "5px auto",
          }}
        />

        <button onClick={getDistances} style={{ display: "block", margin: "10px auto", padding: "10px 20px" }}>
          <span role="img" aria-label="location pin">📍</span> Get Distance
        </button>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <h2>
          <span role="img" aria-label="ruler">📏</span> Distances to Ski Resorts:
        </h2>
        {distances.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {distances.map((resort, index) => (
              <li
                key={index}
                style={{
                  background: "#f8f8f8",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <strong>{resort.name}</strong>
                <br />
                Travel Time: {resort.travelTime}
                <br />
                Distance: {resort.distance} miles
                <br />
                Delay Due to Traffic: {resort.delay.includes("min") ? resort.delay : `${resort.delay} min`}
                <br />
                Estimated Average Speed: {resort.speed} mph
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available.</p>
        )}

        <Link to="/">
          <button
            style={{
              display: "block",
              margin: "10px auto",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              borderRadius: "5px",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            ⬅ Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DistanceFinder;

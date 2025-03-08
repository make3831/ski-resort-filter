import React, { useState, useEffect } from "react";

const DistanceFinder = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [distances, setDistances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch distances from backend API
  const getDistances = async () => {
    if (!latitude || !longitude) {
      setError("Please enter valid latitude and longitude.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log(`Fetching data from: http://127.0.0.1:5000/api/getDistances?lat=${latitude}&lon=${longitude}`);
      const response = await fetch(`http://127.0.0.1:5000/api/getDistances?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();

      console.log("API Response:", data); // Debugging log

      if (data.error) {
        setError(data.error);
        setDistances([]); // Ensure old data doesn't persist
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
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
      <h1>
        <span role="img" aria-label="mountain">🏔️</span> Find Your Ski Resort Distance
      </h1>

      <button onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude.toFixed(4));
            setLongitude(position.coords.longitude.toFixed(4));
          },
          () => setError("Unable to retrieve location.")
        );
      }}>
        <span role="img" aria-label="location pin">📍</span> Use My Location
      </button>

      <div>
        <p>
          <span role="img" aria-label="location pin">📍</span> Your Location: {latitude}, {longitude}
        </p>
        <input 
          type="text" 
          placeholder="Latitude" 
          value={latitude} 
          onChange={(e) => setLatitude(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Longitude" 
          value={longitude} 
          onChange={(e) => setLongitude(e.target.value)} 
        />
        <button onClick={getDistances}>
          <span role="img" aria-label="location pin">📍</span> Get Distance
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>
        <span role="img" aria-label="ruler">📏</span> Distances to Ski Resorts:
      </h2>
      {distances.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {distances.map((resort) => (
            <li key={resort.name} style={{ fontSize: "18px", marginBottom: "10px" }}>
              <strong>{resort.name}:</strong>
              <br />
              Travel Time: {resort.travelTime}
              <br />
              Delay Due to Traffic: {resort.delay}
              <br />
              Distance: {resort.distance} miles
              <br />
              Estimated Average Speed: {resort.speed} mph
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default DistanceFinder;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SkiResortFilter = () => {
  const [filters, setFilters] = useState({
    lifts: "Any",
    trails: "Any",
    terrainParks: "Any",
    terrainType: "beginner",
  });

  const [resorts, setResorts] = useState([]);
  const [filteredResorts, setFilteredResorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.theperfectmountain.com/api/resorts")
      .then((response) => response.json())
      .then((data) => {
        // Convert API data into proper format
        const formattedResorts = data.map((resort) => ({
          name: resort.name,
          lifts: resort["Total Lifts"] || "N/A",
          trails: resort["Total Runs"] || "N/A",
          terrainParks: resort["Terrain Parks"] || "N/A",
          beginner: resort["Beginner Terrain"] || "N/A",
          intermediate: resort["Intermediate Terrain"] || "N/A",
          advanced_expert: resort["Advanced/Expert Terrain"] || "N/A",
          skiableTerrain: resort["Skiable Terrain"] || "N/A",
          baseElevation: resort["Base Elevation"] || "N/A",
          highestElevation: resort["Highest Elevation"] || "N/A",
          averageSnowfall: resort["Average Snowfall"] || "N/A",
          mostDifficultTerrain: resort["Most Difficult Terrain"] || "N/A",
        }));

        setResorts(formattedResorts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFindResorts = () => {
    setFilteredResorts(resorts);
  };

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
      {/* Centered Content Box */}
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
          maxWidth: "700px",
          width: "90%",
        }}
      >
        <h1>
	  <span role="img" aria-label="ski">🎿</span> Ski Resort Finder
	</h1>

        {/* Filter Inputs */}
        <div style={{ width: "100%" }}>
          <label>Lifts: </label>
          <select name="lifts" value={filters.lifts} onChange={handleChange} style={{ width: "100%", padding: "10px", marginBottom: "10px" }}>
            <option value="Any">Any</option>
            <option value="5">5+</option>
            <option value="10">10+</option>
            <option value="20">20+</option>
          </select>

          <label> Trails: </label>
          <select name="trails" value={filters.trails} onChange={handleChange} style={{ width: "100%", padding: "10px", marginBottom: "10px" }}>
            <option value="Any">Any</option>
            <option value="50">50+</option>
            <option value="100">100+</option>
            <option value="150">150+</option>
          </select>

          <label> Terrain Parks: </label>
          <select name="terrainParks" value={filters.terrainParks} onChange={handleChange} style={{ width: "100%", padding: "10px", marginBottom: "10px" }}>
            <option value="Any">Any</option>
            <option value="1">1+</option>
            <option value="3">3+</option>
            <option value="5">5+</option>
          </select>

          <label> Select Terrain Type: </label>
          <select name="terrainType" value={filters.terrainType} onChange={handleChange} style={{ width: "100%", padding: "10px", marginBottom: "10px" }}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced_expert">Advanced/Expert</option>
          </select>
        </div>

        {/* Find Resorts Button */}
        <button
          onClick={handleFindResorts}
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px 20px",
            fontSize: "18px",
            background: "#fff",
            borderRadius: "5px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            transition: "0.3s",
          }}
        >
          Find Resorts
        </button>

        {/* Resort Results */}
        <h2>
	  <span role="img" aria-label="mountain">🏔️ </span> Best Ski Resorts for Selected Terrain
	</h2>
        {loading ? (
          <p>Loading ski resorts...</p>
        ) : filteredResorts.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, textAlign: "left", width: "100%" }}>
            {filteredResorts.map((resort) => (
              <li
                key={resort.name}
                style={{
                  background: "#f8f8f8",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <strong>{resort.name}</strong>
                <br />
                Lifts: {resort.lifts}, Trails: {resort.trails}, Terrain Parks: {resort.terrainParks}
                <br />
                Beginner Terrain: {resort.beginner}%
                <br />
                Intermediate Terrain: {resort.intermediate}%
                <br />
                Advanced/Expert Terrain: {resort.advanced_expert}%
                <br />
                Skiable Terrain: {resort.skiableTerrain}
                <br />
                Base Elevation: {resort.baseElevation} ft
                <br />
                Highest Elevation: {resort.highestElevation} ft
                <br />
                Average Snowfall: {resort.averageSnowfall} inches
                <br />
                Most Difficult Terrain: {resort.mostDifficultTerrain}
              </li>
            ))}
          </ul>
        ) : (
          <p>No resorts match your filters. Try adjusting them.</p>
        )}

        {/* Back Button */}
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

export default SkiResortFilter;

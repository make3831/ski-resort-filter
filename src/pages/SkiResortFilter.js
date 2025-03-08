import React, { useState, useEffect } from "react";

const SkiResortFilter = () => {
  const [filters, setFilters] = useState({
    lifts: "Any",
    trails: "Any",
    terrainParks: "Any",
    terrainType: "beginner", // Terrain selection inside filters
  });

  const [resorts, setResorts] = useState([]); // Store resorts from API
  const [filteredResorts, setFilteredResorts] = useState([]); // Store filtered results
  const [loading, setLoading] = useState(true); // Track loading state

  // Load ski resorts from Flask API
  useEffect(() => {
    fetch("http://localhost:5000/api/resorts") // Fetch from backend
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Resort Data:", data); // Debugging output

        const formattedResorts = data.map((resort) => ({
          name: resort.name, // Extract from "name" field
          lifts: parseInt(resort["Total Lifts"]) || 0,
          trails: parseInt(resort["Total Runs"]) || 0,
          terrainParks: parseInt(resort["Terrain Parks"]) || 0,
          beginner: parseFloat(resort["Beginner Terrain"].replace("%", "")) || 0,
          intermediate: parseFloat(resort["Intermediate Terrain"].replace("%", "")) || 0,
          advanced_expert: parseFloat(resort["Advanced/Expert Terrain"].replace("%", "")) || 0,
          skiableTerrain: resort["Skiable Terrain"],  // ✅ Ensure this field is retrieved
          baseElevation: resort["Base Elevation"],    // ✅ Ensure this field is retrieved
          highestElevation: resort["Highest Elevation"],  // ✅ Ensure this field is retrieved
          averageSnowfall: resort["Average Snowfall"],  // ✅ Ensure this field is retrieved
          mostDifficultTerrain: resort["Most Difficult Terrain"],  // ✅ Ensure this field is retrieved
        }));        

        setResorts(formattedResorts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading ski resorts:", error);
        setLoading(false);
      });
  }, []);

  // Handle user filter input
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filter resorts based on user selection
  const filterResorts = () => {
    if (!resorts.length) return [];

    return resorts
      .filter((resort) => {
        return (
          (filters.lifts === "Any" || resort.lifts >= Number(filters.lifts)) &&
          (filters.trails === "Any" || resort.trails >= Number(filters.trails)) &&
          (filters.terrainParks === "Any" || resort.terrainParks >= Number(filters.terrainParks))
        );
      })
      .sort((a, b) => (b[filters.terrainType] || 0) - (a[filters.terrainType] || 0));
  };

  // Find resorts when button is clicked
  const handleFindResorts = () => {
    setFilteredResorts(filterResorts());
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
      <h1>
        <span role="img" aria-label="ski">🎿</span> Ski Resort Finder
      </h1>
      <h2>
        <span role="img" aria-label="skier">⛷️</span> Filter Ski Resorts
      </h2>

      <label>Lifts: </label>
      <select name="lifts" value={filters.lifts} onChange={handleChange}>
        <option value="Any">Any</option>
        <option value="5">5+</option>
        <option value="10">10+</option>
        <option value="20">20+</option>
      </select>

      <label> Trails: </label>
      <select name="trails" value={filters.trails} onChange={handleChange}>
        <option value="Any">Any</option>
        <option value="50">50+</option>
        <option value="100">100+</option>
        <option value="150">150+</option>
      </select>

      <label> Terrain Parks: </label>
      <select name="terrainParks" value={filters.terrainParks} onChange={handleChange}>
        <option value="Any">Any</option>
        <option value="1">1+</option>
        <option value="3">3+</option>
        <option value="5">5+</option>
      </select>

      <label> Select Terrain Type: </label>
      <select name="terrainType" value={filters.terrainType} onChange={handleChange}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced_expert">Advanced/Expert</option>
      </select>

      <br />
      <button onClick={handleFindResorts} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
        Find Resorts
      </button>

      <h2>
        <span role="img" aria-label="mountain">🏔️</span> Best Ski Resorts for Selected Terrain
      </h2>
      {loading ? (
        <p>Loading ski resorts...</p>
      ) : filteredResorts.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredResorts.map((resort) => (
            <li key={resort.name} style={{ fontSize: "18px", marginBottom: "15px" }}>
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
              Base Elevation: {resort.baseElevation}
              <br />
              Highest Elevation: {resort.highestElevation}
              <br />
              Average Snowfall: {resort.averageSnowfall}
              <br />
              Most Difficult Terrain: {resort.mostDifficultTerrain}
            </li>
          ))}
        </ul>

      ) : (
        <p>No resorts match your filters. Try adjusting them.</p>
      )}
    </div>
  );
};

export default SkiResortFilter;
import React, { useState, useEffect } from "react";

const FilterComponent = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    baseElevation: "",
    highestElevation: "",
    averageSnowfall: "",
    skiableTerrain: "",
    lifts: "",
    trails: "",
    terrainParks: "",
    mostDifficultLift: "",
    beginnerTerrain: "",
    intermediateTerrain: "",
    advancedTerrain: "",
    mostDifficultTerrain: "",
    expertOnlyTerrain: "",
  });

  const [options, setOptions] = useState({
    baseElevations: [],
    highestElevations: [],
    averageSnowfalls: [],
    skiableTerrains: [],
    lifts: [],
    trails: [],
    terrainParks: [],
    mostDifficultLifts: [],
    beginnerTerrain: [],
    intermediateTerrain: [],
    advancedTerrain: [],
    mostDifficultTerrain: [],
    expertOnlyTerrain: [],
  });

useEffect(() => {
    fetch("http://localhost:5000/api/filters")
      .then((res) => {
          if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
      })
      .then((data) => setOptions(data))
      .catch((err) => console.error("Error fetching filters:", err));
}, []);

  const handleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div>
      <h2>
	<span role="img" aria-label="mountain">🏔️</span> Filter Ski Resorts
      </h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(options).map((key) => (
          <div key={key}>
            <label>{key.replace(/([A-Z])/g, " $1").trim()}:</label>
            <select name={key} value={filters[key]} onChange={handleChange}>
              <option value="">Any</option>
              {options[key].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit">Find Resorts</button>
      </form>
    </div>
  );
};

export default FilterComponent;
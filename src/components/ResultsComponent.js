import React from "react";

const ResultsComponent = ({ filteredResorts }) => {
  return (
    <div>
      <h2>
	<span role="img" aria-label="mountain">🏔️</span> Results
      </h2>
      {filteredResorts.length > 0 ? (
        filteredResorts.map((resort, index) => (
          <div key={index}>
            <h3>{resort.name}</h3>
            <p>
		<span role="img" aria-label="location">📍</span> Location: {resort.location}
            </p>
            <p>
		<span role="img" aria-label="mountain">🏔️</span> Base Elevation: {resort.baseElevation}
            </p>
            <p>
		<span role="img" aria-label="mountain">⛰️</span> Highest Elevation: {resort.highestElevation}
            </p>
	    <p>
		<span role="img" aria-label="snowflake">❄️</span> Average Snowfall: {resort.averageSnowfall}
	    </p>
	    <p>
		<span role="img" aria-label="skier">⛷️</span> Skiable Terrain: {resort.skiableTerrain}
	    </p>
	    <p>
		<span role="img" aria-label="gondola">🚡</span> Lifts: {resort.lifts}
	    </p>
	    <p>
		<span role="img" aria-label="skiing">🎿</span> Trails: {resort.trails}
	    </p>
	    <p>
		<span role="img" aria-label="snowboarder">🏂</span> Terrain Parks: {resort.terrainParks}
	    </p>
	    <p>
		<span role="img" aria-label="strong arm">💪</span> Most Difficult Lift: {resort.mostDifficultLift}
	    </p>
	    <p>
		<span role="img" aria-label="beginner terrain">🟢</span> Beginner Terrain: {resort.terrainDifficulty.beginner}
	    </p>
	    <p>
		<span role="img" aria-label="intermediate terrain">🔵</span> Intermediate Terrain: {resort.terrainDifficulty.intermediate}
	    </p>
	    <p>
		<span role="img" aria-label="advanced terrain">🔴</span> Advanced Terrain: {resort.terrainDifficulty.advanced}
	    </p>
	    <p>
		<span role="img" aria-label="most difficult terrain">⚫</span> Most Difficult Terrain: {resort.terrainDifficulty.mostDifficult}
	    </p>
	    <p>
		<span role="img" aria-label="expert only terrain">⚫⚫</span> Expert Only Terrain: {resort.terrainDifficulty.expertOnly}
	    </p>
          </div>
        ))
      ) : (
        <p>No resorts found. Try adjusting your filters.</p>
      )}
    </div>
  );
};

export default ResultsComponent;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DistanceFinder from "./pages/DistanceFinder";
import SkiResortFilter from "./pages/SkiResortFilter";

const Home = () => {
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
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>Ski Bums</h1>
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
          Your One Stop Shop for the Perfect Ski Day
        </p>

        {/* Navigation Buttons */}
        <Link
          to="/filter"
          style={{
            textDecoration: "none",
            display: "block",
            margin: "10px auto",
            padding: "15px 30px",
            fontSize: "18px",
            fontWeight: "bold",
            background: "#007bff",
            color: "white",
            borderRadius: "5px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "80%",
          }}
        >
          <span role="img" aria-label="ski">🎿</span> Ski Resort Finder
        </Link>

        <Link
          to="/distance"
          style={{
            textDecoration: "none",
            display: "block",
            margin: "10px auto",
            padding: "15px 30px",
            fontSize: "18px",
            fontWeight: "bold",
            background: "#28a745",
            color: "white",
            borderRadius: "5px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "80%",
          }}
        >
          <span role="img" aria-label="mountain">🏔️ </span> Distance to Resort
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      {/* Corrected Routes: Ensures only one page is displayed at a time */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/distance" element={<DistanceFinder />} />
        <Route path="/filter" element={<SkiResortFilter />} />
      </Routes>
    </Router>
  );
};

export default App;

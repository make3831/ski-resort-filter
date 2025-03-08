import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DistanceFinder from "./pages/DistanceFinder";
import SkiResortFilter from "./pages/SkiResortFilter";

const App = () => {
  return (
    <Router>
      <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
        <nav>
          <Link to="/distance" style={{ margin: "10px", fontSize: "18px" }}><span role="img" aria-label="mountain">🏔️</span> Find Distance</Link>
	  <Link to="/filter" style={{ margin: "10px", fontSize: "18px" }}><span role="img" aria-label="skis">🎿</span> Ski Resort Filter</Link>
        </nav>

        <Routes>
          <Route path="/distance" element={<DistanceFinder />} />
          <Route path="/filter" element={<SkiResortFilter />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
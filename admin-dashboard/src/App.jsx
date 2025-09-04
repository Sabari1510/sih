import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MapPage from "./pages/MapPage.jsx";

function HomePage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome Admin Dashboard</h1>
      <p>Use the navigation above to view reports on the map.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* Simple Navbar */}
      <nav style={{ padding: "10px", background: "#333" }}>
        <Link to="/" style={{ margin: "10px", color: "white", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/map" style={{ margin: "10px", color: "white", textDecoration: "none" }}>
          Map
        </Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;

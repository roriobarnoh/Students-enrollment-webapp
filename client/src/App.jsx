import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components and Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Enrollments from "./pages/Enrollments";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/enrollments" element={<Enrollments />} />
        </Routes>
      </div>
    </Router>
  );
}

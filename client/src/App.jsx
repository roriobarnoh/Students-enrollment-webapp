import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Enrollments from "./pages/Enrollments";
import Units from "./pages/Units";
import Instructors from "./pages/Instructors";
import Departments from "./pages/Departments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
          <Route path="/enrollments" element={<PrivateRoute><Enrollments /></PrivateRoute>} />
          <Route path="/units" element={<PrivateRoute><Units /></PrivateRoute>} />
          <Route path="/instructors" element={<PrivateRoute><Instructors /></PrivateRoute>} />
          <Route path="/departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

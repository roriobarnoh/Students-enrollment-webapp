import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5 text-center">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Welcome to the Student Enrollment App</h1>
          <p className="lead mb-4">
            Manage students, units, instructors, departments, and enrollments efficiently.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/students" className="btn btn-primary btn-lg">
              Manage Students
            </Link>
            <Link to="/enrollments" className="btn btn-outline-secondary btn-lg">
              View Enrollments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

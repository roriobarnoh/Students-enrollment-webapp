import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/enrollments")
      .then((response) => setEnrollments(response.data))
      .catch((error) => console.error("Error fetching enrollments:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Enrollments</h1>
      {enrollments.length > 0 ? (
        <ul className="list-group">
          {enrollments.map((enrollment) => (
            <li key={enrollment.id} className="list-group-item">
              Student <strong>{enrollment.student?.name}</strong> enrolled in Unit <strong>{enrollment.unit?.title}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-info">No enrollments found.</div>
      )}
    </div>
  );
}

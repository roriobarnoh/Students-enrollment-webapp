import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5555/instructors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setInstructors(res.data))
      .catch((err) => console.error("Error fetching instructors:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Instructors</h1>

      {loading ? (
        <div className="alert alert-secondary">Loading instructors...</div>
      ) : instructors.length > 0 ? (
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst) => (
              <tr key={inst.id}>
                <td>{inst.id}</td>
                <td>{inst.name}</td>
                <td>{inst.email}</td>
                <td>{inst.department?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">No instructors found.</div>
      )}
    </div>
  );
}

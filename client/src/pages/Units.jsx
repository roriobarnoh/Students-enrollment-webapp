import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Units() {
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized. Please log in.");
      return navigate("/login");
    }

    axios
      .get("http://localhost:5555/units", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUnits(res.data))
      .catch((err) => {
        console.error("Error fetching units:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Units</h1>
      {units.length > 0 ? (
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Instructor</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.id}>
                <td>{unit.id}</td>
                <td>{unit.title}</td>
                <td>{unit.instructor?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">No units found.</div>
      )}
    </div>
  );
}

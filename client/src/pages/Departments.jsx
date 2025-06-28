import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5555/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Departments</h1>
      {departments.length > 0 ? (
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{new Date(dept.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">No departments found.</div>
      )}
    </div>
  );
}

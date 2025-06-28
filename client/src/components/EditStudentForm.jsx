import React, { useState } from "react";
import axios from "axios";

export default function EditStudentForm({ student, setStudents, onClose }) {
  const [name, setName] = useState(student.name);
  const [age, setAge] = useState(student.age);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .patch(
        `http://localhost:5555/students/${student.id}`,
        { name, age },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? response.data : s))
        );
        onClose();
      })
      .catch((error) => console.error("Error updating student:", error));
  };

  return (
    <div className="p-4 bg-light rounded">
      <h3 className="mb-3">Edit Student</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Age:</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

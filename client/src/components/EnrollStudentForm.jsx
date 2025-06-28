import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EnrollStudentForm({ student, onClose }) {
  const [units, setUnits] = useState([]);
  const [unitId, setUnitId] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [grades, setGrades] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5555/units", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUnits(res.data))
      .catch((err) => console.error("Error fetching units:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!unitId || !enrollmentDate) {
      alert("Please select a unit and date.");
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:5555/enrollments",
        {
          student_id: student.id,
          unit_id: unitId,
          enrollment_date: enrollmentDate,
          grades: grades ? parseFloat(grades) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        onClose();
      })
      .catch((err) => console.error("Error enrolling student:", err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Select Unit</label>
        <select
          className="form-select"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
          required
        >
          <option value="">-- Select a Unit --</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Enrollment Date</label>
        <input
          type="date"
          className="form-control"
          value={enrollmentDate}
          onChange={(e) => setEnrollmentDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Grade (Optional)</label>
        <input
          type="number"
          className="form-control"
          value={grades}
          onChange={(e) => setGrades(e.target.value)}
          step="0.01"
        />
      </div>

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Enroll
        </button>
      </div>
    </form>
  );
}

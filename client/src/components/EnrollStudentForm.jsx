import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EnrollStudentForm({ student, onClose }) {
  const [unitId, setUnitId] = useState("");
  const [units, setUnits] = useState([]);
  const [enrollmentDate, setEnrollmentDate] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/units")
      .then((response) => setUnits(response.data))
      .catch((error) => console.error("Error fetching units:", error));
  }, []);

  const handleEnroll = () => {
    if (!unitId || !enrollmentDate) {
      alert("Please select a unit and provide an enrollment date.");
      return;
    }

    axios
      .post("http://localhost:5000/enrollments", {
        student_id: student.id,
        unit_id: parseInt(unitId),
        enrollment_date: enrollmentDate,
      })
      .then(() => {
        alert("Student enrolled successfully!");
        onClose();
      })
      .catch((error) => console.error("Error enrolling student:", error));
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h4 className="mb-3">Enroll {student.name}</h4>

      <div className="mb-3">
        <label className="form-label">Select a Unit:</label>
        <select
          className="form-select"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
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
        <label className="form-label">Enrollment Date:</label>
        <input
          type="date"
          className="form-control"
          value={enrollmentDate}
          onChange={(e) => setEnrollmentDate(e.target.value)}
          required
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-success" onClick={handleEnroll}>
          Enroll
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

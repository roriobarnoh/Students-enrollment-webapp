import React, { useEffect, useState } from "react";
import axiosWithAuth from "../utils/axiosWithAuth";

export default function UnitForm({ unit = null, setUnits, onClose }) {
  const [title, setTitle] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (unit) {
      setTitle(unit.title || "");
      setInstructorId(unit.instructor?.id || "");
    }
  }, [unit]);

  // Load instructors
  useEffect(() => {
    axiosWithAuth()
      .get("/instructors")
      .then((res) => setInstructors(res.data))
      .catch((err) => {
        console.error("Error fetching instructors:", err);
        alert("You must be logged in to view instructors.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title,
      instructor_id: instructorId ? Number(instructorId) : null,
    };

    try {
      if (unit) {
        // Edit mode
        const res = await axiosWithAuth().patch(`/units/${unit.id}`, payload);
        setUnits((prev) =>
          prev.map((u) => (u.id === unit.id ? res.data : u))
        );
      } else {
        // Create mode
        const res = await axiosWithAuth().post("/units", payload);
        setUnits((prev) => [...prev, res.data]);
      }

      onClose();
    } catch (err) {
      console.error("Error saving unit:", err);
      alert("Failed to save unit. Make sure you're logged in.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Unit Title</label>
        <input
          id="title"
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter unit title"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="instructor" className="form-label">Instructor (Optional)</label>
        <select
          id="instructor"
          className="form-select"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
        >
          <option value="">-- Select Instructor --</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : unit ? "Update Unit" : "Add Unit"}
        </button>
      </div>
    </form>
  );
}

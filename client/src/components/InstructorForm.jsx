import React, { useEffect, useState } from "react";
import axiosWithAuth from "../utils/axiosWithAuth";

export default function InstructorForm({ instructor = null, onClose }) {
  const [name, setName] = useState(instructor?.name || "");
  const [email, setEmail] = useState(instructor?.email || "");
  const [departmentId, setDepartmentId] = useState(instructor?.department?.id || "");
  const [departments, setDepartments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    axiosWithAuth()
      .get("/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const instructorData = {
      name,
      email,
      department_id: Number(departmentId),
    };

    try {
      if (instructor) {
        // Edit mode
        await axiosWithAuth().patch(`/instructors/${instructor.id}`, instructorData);
      } else {
        // Add mode
        await axiosWithAuth().post("/instructors", instructorData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving instructor:", error);
      alert("Failed to save instructor. Check form and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Instructor name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Instructor email"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Department</label>
        <select
          className="form-select"
          required
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSaving}>
        {isSaving ? "Saving..." : instructor ? "Update Instructor" : "Add Instructor"}
      </button>
    </form>
  );
}

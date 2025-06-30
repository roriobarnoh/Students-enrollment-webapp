import React, { useState, useEffect } from "react";
import axiosWithAuth from "../utils/axiosWithAuth";

export default function DepartmentForm({ onClose, department = null }) {
  const [name, setName] = useState(department?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (department) {
        // Edit mode
        await axiosWithAuth().patch(`/departments/${department.id}`, {
          name,
        });
      } else {
        // Add mode
        await axiosWithAuth().post("/departments", { name });
      }
      onClose();
    } catch (err) {
      console.error("Error saving department:", err);
      alert("Failed to save department.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
      <div className="mb-3">
        <label className="form-label">Department Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter department name"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSaving}>
        {isSaving ? "Saving..." : department ? "Update Department" : "Add Department"}
      </button>
    </form>
  );
}

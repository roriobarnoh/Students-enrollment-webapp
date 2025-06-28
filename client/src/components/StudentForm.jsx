import React, { useState } from "react";
import axiosWithAuth from "../utils/axiosWithAuth"; // uses token from localStorage

export default function StudentForm({ setStudents }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const newStudent = { name, age: Number(age) };

    try {
      const response = await axiosWithAuth().post("/students", newStudent);
      setStudents((prev) => [...prev, response.data]);
      setName("");
      setAge("");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("You must be logged in to add a student.");
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          required
          autoComplete="name"
          placeholder="Enter name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="form-control"
          required
          min="1"
          placeholder="Enter age"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="btn btn-primary"
      >
        {isSaving ? "Saving..." : "Add Student"}
      </button>
    </form>
  );
}

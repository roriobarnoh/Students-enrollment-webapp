import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InstructorForm from "../components/InstructorForm";

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchInstructors = async () => {
    if (!token) {
      alert("Unauthorized. Please log in.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5555/instructors", authHeaders);
      setInstructors(res.data);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      try {
        await axios.delete(`http://localhost:5555/instructors/${id}`, authHeaders);
        fetchInstructors();
      } catch (err) {
        console.error("Failed to delete instructor:", err);
        alert("Error deleting instructor.");
      }
    }
  };

  const handleEdit = (instructor) => {
    setSelectedInstructor(instructor);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedInstructor(null);
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Instructors</h1>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Add Instructor
      </button>

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Instructor</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModals}
                />
              </div>
              <div className="modal-body">
                <InstructorForm
                  onClose={() => {
                    handleCloseModals();
                    fetchInstructors();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Instructor Modal */}
      {showEditModal && selectedInstructor && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Instructor</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModals}
                />
              </div>
              <div className="modal-body">
                <InstructorForm
                  instructor={selectedInstructor}
                  onClose={() => {
                    handleCloseModals();
                    fetchInstructors();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Display */}
      {loading ? (
        <div className="alert alert-secondary">Loading instructors...</div>
      ) : instructors.length === 0 ? (
        <div className="alert alert-info">No instructors found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst) => (
                <tr key={inst.id}>
                  <td>{inst.id}</td>
                  <td>{inst.name}</td>
                  <td>{inst.email}</td>
                  <td>{inst.department?.name || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(inst)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(inst.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

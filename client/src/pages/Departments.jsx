import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartmentForm from "../components/DepartmentForm"; // should handle both add/edit

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDepartments = () => {
    axios
      .get("http://localhost:5555/departments", authHeaders)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:5555/departments/${id}`, authHeaders);
        fetchDepartments();
      } catch (err) {
        console.error("Error deleting department:", err);
        alert("Failed to delete department.");
      }
    }
  };

  const openEditModal = (dept) => {
    setSelectedDepartment(dept);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedDepartment(null);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Departments</h1>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Add Department
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Department</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModals}
                />
              </div>
              <div className="modal-body">
                <DepartmentForm
                  onClose={() => {
                    closeModals();
                    fetchDepartments();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDepartment && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Department</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModals}
                />
              </div>
              <div className="modal-body">
                <DepartmentForm
                  department={selectedDepartment}
                  onClose={() => {
                    closeModals();
                    fetchDepartments();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {departments.length > 0 ? (
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{new Date(dept.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEditModal(dept)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(dept.id)}
                  >
                    Delete
                  </button>
                </td>
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

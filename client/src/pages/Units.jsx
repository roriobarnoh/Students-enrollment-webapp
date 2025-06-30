import React, { useEffect, useState } from "react";
import axiosWithAuth from "../utils/axiosWithAuth";
import { useNavigate } from "react-router-dom";
import UnitForm from "../components/UnitForm";

export default function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const navigate = useNavigate();

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await axiosWithAuth().get("/units");
      setUnits(res.data);
    } catch (err) {
      console.error("Error fetching units:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      try {
        await axiosWithAuth().delete(`/units/${id}`);
        fetchUnits();
      } catch (err) {
        console.error("Error deleting unit:", err);
        alert("Failed to delete unit.");
      }
    }
  };

  const openEditModal = (unit) => {
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedUnit(null);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Units</h1>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Add Unit
      </button>

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Unit</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModals}
                />
              </div>
              <div className="modal-body">
                <UnitForm
                  setUnits={setUnits}
                  onClose={() => {
                    closeModals();
                    fetchUnits();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Unit Modal */}
      {showEditModal && selectedUnit && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Unit</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModals}
                />
              </div>
              <div className="modal-body">
                <UnitForm
                  unit={selectedUnit}
                  setUnits={setUnits}
                  onClose={() => {
                    closeModals();
                    fetchUnits();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unit Table */}
      {loading ? (
        <div className="alert alert-secondary">Loading units...</div>
      ) : units.length === 0 ? (
        <div className="alert alert-info">No units found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Instructor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td>{unit.id}</td>
                  <td>{unit.title}</td>
                  <td>{unit.instructor?.name || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEditModal(unit)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(unit.id)}
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

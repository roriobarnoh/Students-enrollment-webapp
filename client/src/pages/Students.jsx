import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentForm from "../components/StudentForm";
import EditStudentForm from "../components/EditStudentForm";
import EnrollStudentForm from "../components/EnrollStudentForm";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [enrollingStudent, setEnrollingStudent] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  const fetchEnrollments = (studentId) => {
    axios
      .get("http://localhost:5000/enrollments")
      .then((res) => {
        const filtered = res.data.filter(
          (enrollment) => enrollment.student_id === studentId
        );
        setEnrollments((prev) => ({ ...prev, [studentId]: filtered }));
      })
      .catch((err) => console.error("Error fetching enrollments:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`http://localhost:5000/students/${id}`)
        .then(() => fetchStudents())
        .catch((err) => console.error("Error deleting student:", err));
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Student List</h1>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Add Student
      </button>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Student</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                />
              </div>
              <div className="modal-body">
                <StudentForm
                  setStudents={setStudents}
                  onClose={() => {
                    setShowAddModal(false);
                    fetchStudents();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Student</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingStudent(null)}
                />
              </div>
              <div className="modal-body">
                <EditStudentForm
                  student={editingStudent}
                  setStudents={setStudents}
                  onClose={() => {
                    setEditingStudent(null);
                    fetchStudents();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {enrollingStudent && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enroll Student</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEnrollingStudent(null)}
                />
              </div>
              <div className="modal-body">
                <EnrollStudentForm
                  student={enrollingStudent}
                  onClose={() => {
                    setEnrollingStudent(null);
                    fetchEnrollments(enrollingStudent.id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Enrolled Units</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => {
              const studentEnrollments = enrollments[student.id] || [];
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>
                    {studentEnrollments.length > 0 ? (
                      <ul className="mb-0">
                        {studentEnrollments.map((en) => (
                          <li key={en.id}>{en.unit?.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <small>No enrollments</small>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setEditingStudent(student);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        fetchEnrollments(student.id);
                        setEnrollingStudent(student);
                      }}
                    >
                      Enroll
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

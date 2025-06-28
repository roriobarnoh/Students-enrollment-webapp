import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">StudentApp</Link>
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/students">Students</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/enrollments">Enrollments</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/units">Units</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/instructors">Instructors</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/departments">Departments</Link></li>
                <li className="nav-item">
                  <button className="btn nav-link text-white border-0" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

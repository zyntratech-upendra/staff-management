import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Staffing Management System</div>
      <div className="navbar-nav">
        <Link to={`/${user.role}`} className="navbar-link">
          Dashboard
        </Link>
        <Link to={`/${user.role}/profile`} className="navbar-link">
          Profile
        </Link>
        <span className="navbar-link" style={{ cursor: 'default' }}>
          {user.name} ({user.role})
        </span>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Array_Navbar.css';

const Array_Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  // Logic to determine the active sub-category for Arrays
  const getBase = () => {
    // This allows the navbar to work even if you add specific array variants later
    return { base: '/array', prefix: 'array' }; 
  };

  const { base, prefix } = getBase();

  return (
    <nav className="linear-nav-container">
      {/* Top Bar: Data Structure / Category */}
      <div className="nav-top-bar">
        <div className="nav-section mobile-header">
          <NavLink to="/" className="algo-btn home-btn">
            🏠 Home
          </NavLink>
          
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`nav-section algo-links ${isMenuOpen ? 'show' : ''}`}>
          <div className="v-separator" />
          <span className="nav-label">DATA STRUCTURE:</span>
          <NavLink 
            to="/array" 
            className={({ isActive }) => (isActive ? "algo-btn active" : "algo-btn")}
            onClick={() => setIsMenuOpen(false)}
          >
            Fixed Size Array
          </NavLink>
          {/* You can add Dynamic Array or 2D Array here later */}
        </div>
      </div>

      {/* Bottom Bar: Array Specific Operations */}
      <div className="nav-bottom-bar">
        <div className="nav-section scroll-container">
          <span className="nav-label">OPERATIONS:</span>
          <div className="nav-links">
            <NavLink 
              to={`${base}/${prefix}-insert`} 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Insertion & Shifting
            </NavLink>
            <NavLink 
              to={`${base}/${prefix}-delete`} 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Deletion & Shifting
            </NavLink>
            <NavLink 
              to={`${base}/${prefix}-search`} 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Searching
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Array_Navbar;
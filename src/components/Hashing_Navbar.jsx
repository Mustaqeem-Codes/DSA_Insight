import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/LinearNavbar.css';

const Hashing_Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const getBase = () => {
    if (path.includes('/quadratic')) return { base: '/quadratic', prefix: 'quad' };
    if (path.includes('/double')) return { base: '/double', prefix: 'double' };
    if (path.includes('/chaining')) return { base: '/chaining', prefix: 'chaining' };
    return { base: '/hashing', prefix: 'linear' };
  };

  const { base, prefix } = getBase();

  return (
    <nav className="linear-nav-container">
      {/* Top Bar: Algorithms */}
      <div className="nav-top-bar">
        <div className="nav-section mobile-header">
          <NavLink to="/" className="algo-btn home-btn">🏠 Home</NavLink>
          
          {/* Hamburger Icon for Mobile */}
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`nav-section algo-links ${isMenuOpen ? 'show' : ''}`}>
          <span className="nav-label">ALGORITHM:</span>
          <NavLink to="/hashing" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}>
            Linear
          </NavLink>
          <NavLink to="/quadratic" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}>
            Quadratic
          </NavLink>
          <NavLink to="/double" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}>
            Double
          </NavLink>
          <NavLink to="/chaining" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}>
            Chaining
          </NavLink>
        </div>
      </div>

      {/* Bottom Bar: Operations */}
      <div className="nav-bottom-bar">
        <div className="nav-section scroll-container">
          <span className="nav-label">OPERATIONS:</span>
          <div className="nav-links">
            <NavLink to={`${base}/${prefix}-insert`} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              Insert
            </NavLink>
            <NavLink to={`${base}/${prefix}-search`} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              Search
            </NavLink>
            <NavLink to={`${base}/${prefix}-delete`} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              Delete
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Hashing_Navbar;
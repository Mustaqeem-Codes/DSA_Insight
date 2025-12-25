import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Array_Navbar.css';

const Array_Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Determine active structure
  const is2DArray = path.includes('2d-array');
  const is3DArray = path.includes('3d-array');
  const is1DArray = !is2DArray && !is3DArray;

  return (
    <nav className="array-navbar">
      {/* Top Bar: Data Structure Selection */}
      <div className="navbar-top">
        {/* Left side: Home button and label */}
        <div className="navbar-left">
          <NavLink to="/" className="nav-home-btn">
            <span className="home-icon">🏠</span>
            Home
          </NavLink>
          
          <div className="vertical-separator"></div>
          
          <span className="navbar-label">DATA STRUCTURE:</span>
        </div>

        {/* Right side: Data Structure Links */}
        <div className="navbar-structure-links">
          <NavLink 
            to="/array" 
            className={({ isActive }) => 
              `structure-btn ${isActive ? 'structure-btn-active' : ''}`
            }
          >
            1D Array
          </NavLink>
          
          <NavLink 
            to="/2d-array" 
            className={({ isActive }) => 
              `structure-btn ${isActive ? 'structure-btn-active' : ''}`
            }
          >
            2D Array
          </NavLink>
          
          <NavLink 
            to="/3d-array" 
            className={({ isActive }) => 
              `structure-btn ${isActive ? 'structure-btn-active' : ''}`
            }
          >
            3D Array
          </NavLink>
        </div>
      </div>

      {/* Bottom Bar: Operations */}
      <div className="navbar-bottom ops-bar" role="navigation" aria-label="Array operations">
        <div className="ops-inner">
          <span className="ops-label">OPS:</span>

          <div className="ops-actions">
            <NavLink
              to={`${is2DArray ? '/2d-array' : is3DArray ? '/3d-array' : '/array'}/array-insert`}
              className={({ isActive }) => `ops-btn insert ${isActive ? 'ops-btn-active' : ''}`}
            >
              Insert
            </NavLink>

            <NavLink
              to={`${is2DArray ? '/2d-array' : is3DArray ? '/3d-array' : '/array'}/array-delete`}
              className={({ isActive }) => `ops-btn delete ${isActive ? 'ops-btn-active' : ''}`}
            >
              Delete
            </NavLink>

            <NavLink
              to={`${is2DArray ? '/2d-array' : is3DArray ? '/3d-array' : '/array'}/array-search`}
              className={({ isActive }) => `ops-btn search ${isActive ? 'ops-btn-active' : ''}`}
            >
              Search
            </NavLink>
          </div>
        </div>
      </div>

      {/* Active path indicator */}
      <div className="navbar-path-indicator">
        Active: {is2DArray ? '2D Array' : is3DArray ? '3D Array' : '1D Array'} 
        {path.includes('/insert') ? ' → Insertion' : 
         path.includes('/delete') ? ' → Deletion' : 
         path.includes('/search') ? ' → Search' : 
         ' → Overview'}
      </div>
    </nav>
  );
};

export default Array_Navbar;
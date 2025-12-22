import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/LinearNavbar.css';

const Hashing_Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [path]);

  const getBase = () => {
    if (path.includes('/quadratic')) return { base: '/quadratic', prefix: 'quad' };
    if (path.includes('/double')) return { base: '/double', prefix: 'double' };
    if (path.includes('/chaining')) return { base: '/chaining', prefix: 'chaining' };
    return { base: '/hashing', prefix: 'linear' };
  };

  const { base, prefix } = getBase();

  return (
    <nav 
      className={`linear-nav-container ${isLoading ? 'loading' : ''}`}
      role="navigation"
      aria-label="Hashing Algorithms Navigation"
    >
      {/* Top Bar: Algorithms */}
      <div className="nav-top-bar">
        <div className="nav-section mobile-header">
          <NavLink 
            to="/" 
            className="algo-btn home-btn"
            aria-label="Go to home page"
          >
            <span className="home-icon">🏠</span>
            <span className="home-text">Home</span>
          </NavLink>
        </div>

        <div 
          className="nav-section algo-links"
          role="menu"
        >
          <span className="nav-label" aria-hidden="true">ALGORITHM:</span>
          <NavLink 
            to="/hashing" 
            className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}
            role="menuitem"
            aria-current={path.includes('/hashing') && !path.includes('/quadratic') && !path.includes('/double') && !path.includes('/chaining') ? 'page' : undefined}
          >
            Linear Probing
          </NavLink>
          <NavLink 
            to="/quadratic" 
            className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}
            role="menuitem"
            aria-current={path.includes('/quadratic') ? 'page' : undefined}
          >
            Quadratic Probing
          </NavLink>
          <NavLink 
            to="/double" 
            className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}
            role="menuitem"
            aria-current={path.includes('/double') ? 'page' : undefined}
          >
            Double Hashing
          </NavLink>
          <NavLink 
            to="/chaining" 
            className={({ isActive }) => isActive ? "algo-btn active" : "algo-btn"}
            role="menuitem"
            aria-current={path.includes('/chaining') ? 'page' : undefined}
          >
            Separate Chaining
          </NavLink>
        </div>
      </div>

      {/* Bottom Bar: Operations */}
      <div className="nav-bottom-bar">
        <div className="nav-section scroll-container">
          <span className="nav-label" aria-hidden="true">OPERATIONS:</span>
          <div className="nav-links" role="menu" aria-label="Hashing operations">
            <NavLink 
              to={`${base}/${prefix}-insert`} 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              role="menuitem"
              aria-current={path.includes('insert') ? 'page' : undefined}
            >
              <span className="nav-item-icon">➕</span>
              <span className="nav-item-text">Insert</span>
            </NavLink>
            <NavLink 
              to={`${base}/${prefix}-search`} 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              role="menuitem"
              aria-current={path.includes('search') ? 'page' : undefined}
            >
              <span className="nav-item-icon">🔍</span>
              <span className="nav-item-text">Search</span>
            </NavLink>
            <NavLink 
              to={`${base}/${prefix}-delete`} 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              role="menuitem"
              aria-current={path.includes('delete') ? 'page' : undefined}
            >
              <span className="nav-item-icon">🗑️</span>
              <span className="nav-item-text">Delete</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Loading indicator (optional) */}
      {isLoading && (
        <div className="nav-loading-indicator" role="status" aria-label="Loading">
          <div className="loading-bar"></div>
        </div>
      )}
    </nav>
  );
};

export default Hashing_Navbar;
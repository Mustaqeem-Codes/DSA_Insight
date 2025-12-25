import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Array_Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Determine active structure
  const is2DArray = path.includes('2d-array');
  const is3DArray = path.includes('3d-array');

  return (
    <nav className="array-navbar" style={styles.navbar}>
      {/* Top Bar: Data Structure Selection */}
      <div className="navbar-top" style={styles.navbarTop}>
        {/* Left side: Home button and label */}
        <div className="navbar-left" style={styles.navbarLeft}>
          <NavLink to="/" className="nav-home-btn" style={styles.homeBtn}>
            <span className="home-icon" style={styles.homeIcon}>🏠</span>
            Home
          </NavLink>
          
          <div className="vertical-separator" style={styles.separator}></div>
          
          {/* STRUCTURE label - hidden on screens ≤430px */}
          <span className="navbar-label" style={{
            ...styles.navbarLabel,
            '@media (max-width: 430px)': {
              display: 'none'
            }
          }}>
            STRUCTURE:
          </span>
        </div>

        {/* Right side: Data Structure Links */}
        <div className="navbar-structure-links" style={styles.structureLinks}>
          <NavLink 
            to="/array" 
            className={({ isActive }) => 
              `structure-btn ${isActive ? 'structure-btn-active' : ''}`
            }
            style={({ isActive }) => ({
              ...styles.structureBtn,
              ...(isActive ? styles.structureBtnActive : {})
            })}
          >
            1D
          </NavLink>
          
          <NavLink 
            to="/2d-array" 
            className={({ isActive }) => 
              `structure-btn ${isActive ? 'structure-btn-active' : ''}`
            }
            style={({ isActive }) => ({
              ...styles.structureBtn,
              ...(isActive ? styles.structureBtnActive : {})
            })}
          >
            2D
          </NavLink>
          
          <NavLink 
            to="/3d-array" 
            className={({ isActive }) => 
              `structure-btn ${isActive ? 'structure-btn-active' : ''}`
            }
            style={({ isActive }) => ({
              ...styles.structureBtn,
              ...(isActive ? styles.structureBtnActive : {})
            })}
          >
            3D
          </NavLink>
        </div>
      </div>

      {/* Bottom Bar: Operations */}
      <div className="navbar-bottom ops-bar" role="navigation" aria-label="Array operations" style={styles.opsBar}>
        <div className="ops-inner" style={styles.opsInner}>
          {/* OPS label - also hidden on screens ≤430px */}
          <span className="ops-label" style={{
            ...styles.opsLabel,
            '@media (max-width: 430px)': {
              display: 'none'
            }
          }}>
            OPS:
          </span>

          <div className="ops-actions" style={styles.opsActions}>
            <NavLink
              to={`${is2DArray ? '/2d-array' : is3DArray ? '/3d-array' : '/array'}/insert`}
              className={({ isActive }) => `ops-btn insert ${isActive ? 'ops-btn-active' : ''}`}
              style={({ isActive }) => ({
                ...styles.opsBtn,
                ...styles.insertBtn,
                ...(isActive ? { 
                  ...styles.opsBtnActive,
                  background: 'linear-gradient(to right, #3b82f6, #2563eb)'
                } : {})
              })}
            >
              Insert
            </NavLink>

            <NavLink
              to={`${is2DArray ? '/2d-array' : is3DArray ? '/3d-array' : '/array'}/delete`}
              className={({ isActive }) => `ops-btn delete ${isActive ? 'ops-btn-active' : ''}`}
              style={({ isActive }) => ({
                ...styles.opsBtn,
                ...styles.deleteBtn,
                ...(isActive ? { 
                  ...styles.opsBtnActive,
                  background: 'linear-gradient(to right, #ef4444, #dc2626)'
                } : {})
              })}
            >
              Delete
            </NavLink>

            <NavLink
              to={`${is2DArray ? '/2d-array' : is3DArray ? '/3d-array' : '/array'}/search`}
              className={({ isActive }) => `ops-btn search ${isActive ? 'ops-btn-active' : ''}`}
              style={({ isActive }) => ({
                ...styles.opsBtn,
                ...styles.searchBtn,
                ...(isActive ? { 
                  ...styles.opsBtnActive,
                  background: 'linear-gradient(to right, #10b981, #059669)'
                } : {})
              })}
            >
              Search
            </NavLink>
          </div>
        </div>
      </div>

      {/* Active path indicator */}
      <div className="navbar-path-indicator" style={styles.pathIndicator}>
        <span style={{ color: '#9ca3af' }}>Active:</span> 
        <span style={{ fontWeight: 500, marginLeft: 4 }}>
          {is2DArray ? '2D Array' : is3DArray ? '3D Array' : '1D Array'}
        </span>
        {path.includes('/insert') ? 
          <span style={{ color: '#60a5fa', marginLeft: 8 }}>→ Insert</span> : 
         path.includes('/delete') ? 
          <span style={{ color: '#f87171', marginLeft: 8 }}>→ Delete</span> : 
         path.includes('/search') ? 
          <span style={{ color: '#4ade80', marginLeft: 8 }}>→ Search</span> : 
          <span style={{ color: '#9ca3af', marginLeft: 8 }}>→ Overview</span>
        }
      </div>
    </nav>
  );
};

// Inline Styles
const styles = {
  navbar: {
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
    borderRadius: '12px',
    boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    margin: '12px',
    marginTop: '16px',
    border: '1px solid #e2e8f0',
    position: 'sticky',
    top: '12px',
    zIndex: 1000,
    '@media (max-width: 430px)': {
      margin: '8px',
      marginTop: '12px'
    }
  },
  
  navbarTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    '@media (max-width: 430px)': {
      padding: '6px 12px'
    }
  },
  
  navbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '@media (max-width: 430px)': {
      gap: '8px'
    }
  },
  
  homeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#dbeafe',
    color: '#1d4ed8',
    borderRadius: '6px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: '1px solid #93c5fd',
    fontSize: '14px',
    ':hover': {
      background: '#bfdbfe',
      transform: 'translateY(-1px)'
    },
    '@media (max-width: 430px)': {
      padding: '4px 8px',
      fontSize: '13px'
    }
  },
  
  homeIcon: {
    fontSize: '14px',
    '@media (max-width: 430px)': {
      fontSize: '13px'
    }
  },
  
  separator: {
    width: '1px',
    height: '20px',
    background: '#cbd5e1',
    '@media (max-width: 430px)': {
      height: '16px'
    }
  },
  
  navbarLabel: {
    color: '#4b5563',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '@media (max-width: 430px)': {
      fontSize: '11px'
    }
  },
  
  structureLinks: {
    display: 'flex',
    gap: '8px',
    '@media (max-width: 430px)': {
      gap: '4px'
    }
  },
  
  structureBtn: {
    padding: '6px 16px',
    borderRadius: '6px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    ':hover': {
      background: '#e5e7eb',
      transform: 'translateY(-1px)'
    },
    '@media (max-width: 430px)': {
      padding: '4px 12px',
      fontSize: '13px'
    }
  },
  
  structureBtnActive: {
    background: 'linear-gradient(to right, #2563eb, #3b82f6)',
    color: 'white',
    borderColor: '#2563eb',
    boxShadow: '0 2px 4px -1px rgba(37, 99, 235, 0.2)'
  },
  
  opsBar: {
    padding: '6px 16px',
    background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
    borderBottom: '1px solid #dbeafe',
    '@media (max-width: 430px)': {
      padding: '4px 12px'
    }
  },
  
  opsInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '@media (max-width: 430px)': {
      gap: '8px'
    }
  },
  
  opsLabel: {
    color: '#4b5563',
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    '@media (max-width: 430px)': {
      fontSize: '11px'
    }
  },
  
  opsActions: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    justifyContent: 'flex-end',
    '@media (max-width: 430px)': {
      gap: '4px'
    }
  },
  
  opsBtn: {
    padding: '6px 16px',
    borderRadius: '6px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    border: '1px solid #d1d5db',
    '@media (max-width: 430px)': {
      padding: '4px 12px',
      fontSize: '13px'
    }
  },
  
  insertBtn: {
    background: '#ffffff',
    color: '#374151',
    borderLeft: '3px solid #3b82f6',
    ':hover': {
      background: '#dbeafe',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
    }
  },
  
  deleteBtn: {
    background: '#ffffff',
    color: '#374151',
    borderLeft: '3px solid #ef4444',
    ':hover': {
      background: '#fee2e2',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
    }
  },
  
  searchBtn: {
    background: '#ffffff',
    color: '#374151',
    borderLeft: '3px solid #10b981',
    ':hover': {
      background: '#d1fae5',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
    }
  },
  
  opsBtnActive: {
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2)'
  },
  
  pathIndicator: {
    padding: '4px 16px',
    background: '#1f2937',
    color: '#f9fafb',
    fontFamily: "'Monaco', 'Consolas', 'Courier New', monospace",
    fontSize: '12px',
    borderTop: '1px solid #374151',
    '@media (max-width: 430px)': {
      padding: '3px 12px',
      fontSize: '11px'
    }
  }
};

export default Array_Navbar;
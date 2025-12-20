import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Array_Navbar from '../components/Array_Navbar';
import '../styles/Array_Page.css'

const Array_Page = () => {
  const location = useLocation();

  // Check if we are on the base path (/array) to show the welcome screen
  const isBaseRoute = location.pathname === '/array' || location.pathname === '/array/';

  return (
    <div className="page-layout">
      {/* 1. Dedicated Array Navbar */}
      <Array_Navbar />

      <div className="content-area" style={{ padding: '20px' }}>
        {isBaseRoute ? (
          /* --- Welcome / Introduction Screen --- */
          <div className="welcome-container" style={welcomeStyles}>
            <div className="welcome-card">
              <h2>Array Data Structure</h2>
              <p>
                An <strong>Array</strong> is a collection of elements stored at 
                <strong> contiguous memory locations</strong>. It is the simplest data 
                structure where each element can be accessed directly by its index.
              </p>
              
              <div className="array-feature-grid">
                <div className="feature-item">
                  <span>⚡</span>
                  <h4>Random Access</h4>
                  <p>Access any element in O(1) time using its index.</p>
                </div>
                <div className="feature-item">
                  <span>📏</span>
                  <h4>Fixed Size</h4>
                  <p>Traditional arrays have a static size defined at creation.</p>
                </div>
                <div className="feature-item">
                  <span>🔄</span>
                  <h4>Shifting</h4>
                  <p>Inserting or deleting requires shifting elements, taking O(n) time.</p>
                </div>
              </div>

              <div className="get-started">
                <p>Select an operation from the navbar above to begin the visualization.</p>
                <Link to="/array/array-insert" className="btn-get-started">
                  Start with Insertion ⏭
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* --- This is where Insert, Delete, Search, etc. will render --- */
          <Outlet />
        )}
      </div>
    </div>
  );
};

/* --- Inline Styles for the Welcome Screen --- */
const welcomeStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '70vh',
  textAlign: 'center',
  fontFamily: 'Inter, system-ui, sans-serif'
};

export default Array_Page;
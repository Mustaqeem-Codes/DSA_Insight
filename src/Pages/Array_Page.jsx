import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Array_Navbar from '../components/Array_Navbar';
import '../styles/Array_Page.css';

const Array_Page = () => {
  const location = useLocation();
  const contentRef = useRef(null);
  const [arrayStats, setArrayStats] = useState({
    timeComplexity: '',
    spaceComplexity: '',
    description: '',
    currentOperation: ''
  });

  // Check if we are on the base path (/array, /2d-array, /3d-array)
  const isBaseRoute = location.pathname === '/array' || 
                      location.pathname === '/2d-array' || 
                      location.pathname === '/3d-array' ||
                      location.pathname.endsWith('/');

  // Determine array type
  const is2DArray = location.pathname.includes('2d-array');
  const is3DArray = location.pathname.includes('3d-array');
  const arrayType = is2DArray ? '2D Array' : is3DArray ? '3D Array' : '1D Array';

  // Update stats based on current route
  useEffect(() => {
    const path = location.pathname;
    const statsMap = {
      '/array/insert': {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        description: 'Insert an element at a specific position',
        currentOperation: 'Insertion'
      },
      '/array/delete': {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        description: 'Remove an element from a position',
        currentOperation: 'Deletion'
      },
      '/array/search': {
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        description: 'Linear search through array elements',
        currentOperation: 'Search'
      },
      '/2d-array/insert': {
        timeComplexity: 'O(m*n)',
        spaceComplexity: 'O(1)',
        description: 'Insert element in 2D array',
        currentOperation: '2D Insertion'
      },
      '/2d-array/delete': {
        timeComplexity: 'O(m*n)',
        spaceComplexity: 'O(1)',
        description: 'Delete element from 2D array',
        currentOperation: '2D Deletion'
      },
      '/2d-array/search': {
        timeComplexity: 'O(m*n)',
        spaceComplexity: 'O(1)',
        description: 'Search element in 2D array',
        currentOperation: '2D Search'
      },
      '/3d-array/insert': {
        timeComplexity: 'O(m*n*p)',
        spaceComplexity: 'O(1)',
        description: 'Insert element in 3D array',
        currentOperation: '3D Insertion'
      },
      '/3d-array/delete': {
        timeComplexity: 'O(m*n*p)',
        spaceComplexity: 'O(1)',
        description: 'Delete element from 3D array',
        currentOperation: '3D Deletion'
      },
      '/3d-array/search': {
        timeComplexity: 'O(m*n*p)',
        spaceComplexity: 'O(1)',
        description: 'Search element in 3D array',
        currentOperation: '3D Search'
      },
      '/array': {
        timeComplexity: 'Varies',
        spaceComplexity: 'O(n)',
        description: 'Select an operation to visualize',
        currentOperation: '1D Array Overview'
      },
      '/2d-array': {
        timeComplexity: 'Varies',
        spaceComplexity: 'O(m*n)',
        description: 'Select an operation to visualize',
        currentOperation: '2D Array Overview'
      },
      '/3d-array': {
        timeComplexity: 'Varies',
        spaceComplexity: 'O(m*n*p)',
        description: 'Select an operation to visualize',
        currentOperation: '3D Array Overview'
      }
    };

    const stats = statsMap[path] || {
      timeComplexity: 'Varies',
      spaceComplexity: 'Varies',
      description: 'Array Operation',
      currentOperation: `${arrayType} Operation`
    };
    setArrayStats(stats);
  }, [location.pathname, arrayType]);

  // Scroll behavior
  useEffect(() => {
    if (location.pathname.startsWith('/array')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      
      const t = setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);

      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  // Generate welcome content based on array type
  const getWelcomeContent = () => {
    if (is2DArray) {
      return {
        title: '2D Array Data Structure',
        subtitle: 'A two-dimensional array with rows and columns',
        features: [
          {
            icon: '📊',
            title: 'Matrix Structure',
            description: 'Organized in rows and columns like a spreadsheet'
          },
          {
            icon: '📍',
            title: 'Two Indices',
            description: 'Accessed using row and column indices: array[row][column]'
          },
          {
            icon: '🔢',
            title: 'Contiguous Memory',
            description: 'Stored in row-major or column-major order in memory'
          }
        ]
      };
    } else if (is3DArray) {
      return {
        title: '3D Array Data Structure',
        subtitle: 'A three-dimensional array with depth, rows, and columns',
        features: [
          {
            icon: '🧊',
            title: 'Cube Structure',
            description: 'Organized in depth, rows, and columns like a 3D grid'
          },
          {
            icon: '📍',
            title: 'Three Indices',
            description: 'Accessed using depth, row and column indices'
          },
          {
            icon: '🔢',
            title: 'Multi-dimensional',
            description: 'Useful for representing volumetric data'
          }
        ]
      };
    } else {
      return {
        title: '1D Array Data Structure',
        subtitle: 'A simple linear collection of elements',
        features: [
          {
            icon: '⚡',
            title: 'Random Access',
            description: 'Direct access to any element using index in O(1) time'
          },
          {
            icon: '📏',
            title: 'Fixed Size',
            description: 'Static size defined at creation (dynamic arrays can resize)'
          },
          {
            icon: '🔄',
            title: 'Shifting Operations',
            description: 'Insertion/deletion requires shifting elements (O(n) time)'
          }
        ]
      };
    }
  };

  const welcomeContent = getWelcomeContent();

  return (
    <div className="page-layout">
      {/* Array Navigation */}
      <Array_Navbar />
      
      {/* Stats Bar - Shows only when not on base route */}
      {!isBaseRoute && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Operation:</span>
            <span className="stat-value">{arrayStats.currentOperation}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time Complexity:</span>
            <span className="stat-value time-complexity">{arrayStats.timeComplexity}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Space Complexity:</span>
            <span className="stat-value space-complexity">{arrayStats.spaceComplexity}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Description:</span>
            <span className="stat-description">{arrayStats.description}</span>
          </div>
        </div>
      )}

      <div className="content-area" ref={contentRef}>
        {isBaseRoute ? (
          /* --- Welcome / Introduction Screen --- */
          <div className="welcome-container">
            <div className="welcome-card">
              <h1 className="welcome-title">{welcomeContent.title}</h1>
              <p className="welcome-subtitle">
                {welcomeContent.subtitle}
              </p>
              
              <div className="array-features-grid">
                {welcomeContent.features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">{feature.icon}</div>
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="operations-overview">
                <h3>Available Operations</h3>
                <div className="operations-grid">
                  <Link to={`/${is2DArray ? '2d-array' : is3DArray ? '3d-array' : 'array'}/insert`} className="operation-card">
                    <div className="operation-icon">📥</div>
                    <h4>Insert</h4>
                    <p>Add element to array</p>
                    <div className="complexity-badge">
                      {is2DArray ? 'O(m*n)' : is3DArray ? 'O(m*n*p)' : 'O(n)'}
                    </div>
                  </Link>
                  
                  <Link to={`/${is2DArray ? '2d-array' : is3DArray ? '3d-array' : 'array'}/delete`} className="operation-card">
                    <div className="operation-icon">🗑️</div>
                    <h4>Delete</h4>
                    <p>Remove element from array</p>
                    <div className="complexity-badge">
                      {is2DArray ? 'O(m*n)' : is3DArray ? 'O(m*n*p)' : 'O(n)'}
                    </div>
                  </Link>
                  
                  <Link to={`/${is2DArray ? '2d-array' : is3DArray ? '3d-array' : 'array'}/search`} className="operation-card">
                    <div className="operation-icon">🔍</div>
                    <h4>Search</h4>
                    <p>Find element in array</p>
                    <div className="complexity-badge">
                      {is2DArray ? 'O(m*n)' : is3DArray ? 'O(m*n*p)' : 'O(n)'}
                    </div>
                  </Link>
                </div>
              </div>

              <div className="get-started-section">
                <h3>Get Started</h3>
                <p className="start-description">
                  Select an operation from the navbar above or click any operation card to begin visualization.
                  Interact with the array to understand how each operation works.
                </p>
                <Link 
                  to={`/${is2DArray ? '2d-array' : is3DArray ? '3d-array' : 'array'}/insert`} 
                  className="btn-primary"
                >
                  Start with Insertion →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* --- Operation Visualization Area --- */
          <div className="operation-container">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default Array_Page;
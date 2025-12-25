import React, { useState, useEffect } from "react";
import "../styles/A2D_Array_Search.css";

const MAX_ROWS = 4;
const MAX_COLS = 4;

const array2DSearchCode = [
  { line: "int search2D(int arr[][4], int rows, int cols, int key) {", desc: "Function to search in 2D array." },
  { line: "  for (int i = 0; i < rows; i++) {", desc: "Outer loop for rows." },
  { line: "    for (int j = 0; j < cols; j++) {", desc: "Inner loop for columns." },
  { line: "      if (arr[i][j] == key)", desc: "Check if current element matches key." },
  { line: "        return {i, j}; // Found", desc: "Return row and column indices." },
  { line: "    }", desc: "Inner loop complete." },
  { line: "  }", desc: "Outer loop complete." },
  { line: "  return {-1, -1}; // Not found", desc: "Key not found in 2D array." },
  { line: "}", desc: "" }
];

const A2D_Array_Search = () => {
  // Initialize 2D array with values
  const initialArray = [
    [15, 23, 8, 42],
    [67, 34, 91, 12],
    [56, 78, 29, 5],
    [null, null, null, null]
  ];
  
  const [array] = useState(initialArray);
  const [rows] = useState(3);
  const [cols] = useState(4);
  const [searchKey, setSearchKey] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentCell, setCurrentCell] = useState({ row: 0, col: 0 });
  const [foundCell, setFoundCell] = useState({ row: -1, col: -1 });
  const [searchPath, setSearchPath] = useState([]);
  const [status, setStatus] = useState("Enter a value to search in the 2D array.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [searchMode, setSearchMode] = useState("row-major"); // "row-major" or "col-major"
  const [comparisonCount, setComparisonCount] = useState(0);

  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => handleNextStep(), speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep, speed]);

  const startSearch = () => {
    const key = parseInt(searchKey);
    if (isNaN(key)) {
      setStatus("Please enter a valid number to search.");
      return;
    }
    
    setIsProcessing(true);
    setCurrentStep(0);
    setCurrentCell({ row: 0, col: 0 });
    setFoundCell({ row: -1, col: -1 });
    setSearchPath([]);
    setComparisonCount(0);
    setStatus(`Starting ${searchMode} search for ${key}...`);
  };

  const handleNextStep = () => {
    const key = parseInt(searchKey);

    switch (currentStep) {
      case 0: // Function entry
        setCurrentStep(1);
        setStatus(`Search function called. Starting from cell [0][0].`);
        break;
        
      case 1: // Outer loop check (rows)
        if (currentCell.row < rows) {
          setCurrentStep(2);
          setStatus(`Entering row ${currentCell.row}. Starting column iteration.`);
        } else {
          setCurrentStep(7);
          setStatus(`Search complete. Key ${key} not found after ${comparisonCount} comparisons.`);
        }
        break;
        
      case 2: // Inner loop check (columns)
        if (currentCell.col < cols) {
          setCurrentStep(3);
          setComparisonCount(prev => prev + 1);
          const currentValue = array[currentCell.row][currentCell.col];
          setStatus(`Checking cell [${currentCell.row}][${currentCell.col}]: ${currentValue} == ${key}?`);
        } else {
          setCurrentStep(5);
          setStatus(`Row ${currentCell.row} complete. Moving to next row.`);
        }
        break;
        
      case 3: // Comparison check
        if (array[currentCell.row][currentCell.col] === key) {
          setCurrentStep(4);
          setFoundCell({ row: currentCell.row, col: currentCell.col });
          setSearchPath([...searchPath, { row: currentCell.row, col: currentCell.col }]);
          setStatus(`FOUND! Key ${key} found at position [${currentCell.row}][${currentCell.col}].`);
        } else {
          setCurrentStep(6);
          setSearchPath([...searchPath, { row: currentCell.row, col: currentCell.col }]);
          setStatus(`${array[currentCell.row][currentCell.col]} ≠ ${key}. Moving to next cell.`);
        }
        break;
        
      case 4: // Return found
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setStatus(`SUCCESS: Found ${key} at [${foundCell.row}][${foundCell.col}] after ${comparisonCount} comparisons.`);
        break;
        
      case 5: // Move to next row
        if (searchMode === "row-major") {
          setCurrentCell({ row: currentCell.row + 1, col: 0 });
        } else {
          // For column-major search
          setCurrentCell({ row: 0, col: currentCell.col + 1 });
        }
        setCurrentStep(1);
        break;
        
      case 6: // Move to next cell
        if (searchMode === "row-major") {
          setCurrentCell({ row: currentCell.row, col: currentCell.col + 1 });
        } else {
          setCurrentCell({ row: currentCell.row + 1, col: currentCell.col });
        }
        setCurrentStep(2);
        break;
        
      case 7: // Return not found
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setStatus(`Key ${key} not found in the 2D array after checking all ${rows * cols} cells.`);
        break;
        
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setSearchKey("");
    setCurrentStep(-1);
    setCurrentCell({ row: 0, col: 0 });
    setFoundCell({ row: -1, col: -1 });
    setSearchPath([]);
    setStatus("Enter a value to search in the 2D array.");
    setIsProcessing(false);
    setIsAutoPlay(false);
    setComparisonCount(0);
  };

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === "row-major" ? "col-major" : "row-major");
    setStatus(`Search mode switched to ${searchMode === "row-major" ? "Column-Major" : "Row-Major"}.`);
  };

  const isCurrentCell = (row, col) => {
    return currentCell.row === row && currentCell.col === col;
  };

  const isFoundCell = (row, col) => {
    return foundCell.row === row && foundCell.col === col;
  };

  const isSearchedCell = (row, col) => {
    return searchPath.some(cell => cell.row === row && cell.col === col);
  };

  const isCellInBounds = (row, col) => {
    return row < rows && col < cols;
  };

  return (
    <div className="array2d-search-container">
      {/* Header Section */}
      <div className="array2d-search-header">
        <div className="array2d-search-inputs">
          <div className="input-group">
            <label htmlFor="search-key">Search Value</label>
            <input 
              id="search-key"
              type="number" 
              value={searchKey} 
              onChange={(e) => setSearchKey(e.target.value)} 
              placeholder="e.g. 34" 
              disabled={isProcessing}
            />
          </div>
          <button 
            className="array2d-search-btn" 
            onClick={startSearch} 
            disabled={isProcessing}
          >
            {isProcessing ? "Searching..." : "Start Search"}
          </button>
          
          <button 
            className={`array2d-mode-toggle ${searchMode}`}
            onClick={toggleSearchMode}
            disabled={isProcessing}
          >
            {searchMode === "row-major" ? (
              <>
                <span className="mode-icon">→</span>
                Row-Major Search
              </>
            ) : (
              <>
                <span className="mode-icon">↓</span>
                Column-Major Search
              </>
            )}
          </button>
        </div>

        <div className="array2d-speed-control">
          <span className="speed-label">Animation Speed:</span>
          <div className="speed-slider-container">
            <span className="speed-min">Slow</span>
            <input 
              type="range" 
              min="200" 
              max="2000" 
              step="100" 
              value={2200 - speed} 
              onChange={(e) => setSpeed(2200 - Number(e.target.value))}
              className="speed-slider"
            />
            <span className="speed-max">Fast</span>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="array2d-search-viz-body">
        {/* Left Column: 2D Array Visualization */}
        <div className="array2d-viz-column">
          <div className="array2d-viz-header">
            <h3>2D Array Search Visualization</h3>
            <div className="array2d-size-indicator">
              Array Size: <span className="size-value">{rows}</span> × <span className="size-value">{cols}</span>
              <span className="comparison-count"> | Comparisons: <span className="count-value">{comparisonCount}</span></span>
            </div>
          </div>
          
          {/* Search Mode Indicator */}
          <div className="search-mode-indicator">
            <div className="mode-display">
              <span className="mode-label">Current Mode:</span>
              <span className={`mode-value ${searchMode}`}>
                {searchMode === "row-major" ? "Row-Major (Left → Right, Top → Bottom)" : "Column-Major (Top → Bottom, Left → Right)"}
              </span>
            </div>
            <div className="search-path-length">
              Searched Cells: <span className="path-length">{searchPath.length}</span> / {rows * cols}
            </div>
          </div>
          
          {/* 2D Grid Display */}
          <div className="array2d-grid-container">
            <div className="array2d-coordinate-label">
              {/* Column indices */}
              <div className="col-header-row">
                <div className="empty-corner"></div>
                {Array.from({ length: MAX_COLS }).map((_, colIndex) => (
                  <div key={colIndex} className="col-header">
                    Col {colIndex}
                  </div>
                ))}
              </div>
              
              {/* Rows with row labels and cells */}
              {Array.from({ length: MAX_ROWS }).map((_, rowIndex) => (
                <div key={rowIndex} className="array2d-grid-row">
                  <div className="row-header">
                    Row {rowIndex}
                  </div>
                  {Array.from({ length: MAX_COLS }).map((_, colIndex) => {
                    const isCurrent = isCurrentCell(rowIndex, colIndex);
                    const isFound = isFoundCell(rowIndex, colIndex);
                    const isSearched = isSearchedCell(rowIndex, colIndex);
                    const inBounds = isCellInBounds(rowIndex, colIndex);
                    const isEmpty = array[rowIndex][colIndex] === null;
                    
                    return (
                      <div 
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          array2d-cell
                          ${isCurrent ? "array2d-cell-current" : ""}
                          ${isFound ? "array2d-cell-found" : ""}
                          ${isSearched && !isFound ? "array2d-cell-searched" : ""}
                          ${!inBounds ? "array2d-cell-out-of-bounds" : ""}
                          ${isEmpty ? "array2d-cell-empty" : ""}
                        `}
                      >
                        <div className="array2d-cell-coords">
                          [{rowIndex}][{colIndex}]
                        </div>
                        <div className="array2d-cell-value">
                          {array[rowIndex][colIndex] !== null ? array[rowIndex][colIndex] : <span className="empty-symbol">∅</span>}
                        </div>
                        
                        {/* Cell indicators */}
                        {isCurrent && (
                          <div className="array2d-cell-indicator">
                            Checking
                          </div>
                        )}
                        
                        {isFound && (
                          <div className="array2d-cell-found-indicator">
                            Found!
                          </div>
                        )}
                        
                        {/* Search order number */}
                        {isSearched && !isFound && (
                          <div className="array2d-cell-order">
                            {searchPath.findIndex(cell => cell.row === rowIndex && cell.col === colIndex) + 1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Search Path Visualization */}
          <div className="search-path-visualization">
            <div className="path-title">Search Path:</div>
            <div className="path-cells">
              {searchPath.length > 0 ? (
                searchPath.map((cell, index) => (
                  <div 
                    key={index} 
                    className={`path-cell ${foundCell.row === cell.row && foundCell.col === cell.col ? 'path-cell-found' : ''}`}
                  >
                    <div className="path-cell-order">{index + 1}</div>
                    <div className="path-cell-coords">[{cell.row}][{cell.col}]</div>
                    <div className="path-cell-value">{array[cell.row][cell.col]}</div>
                  </div>
                ))
              ) : (
                <div className="no-path-message">Search path will appear here...</div>
              )}
            </div>
          </div>
          
          {/* Legend */}
          <div className="array2d-viz-legend">
            <div className="legend-item">
              <div className="legend-color legend-current"></div>
              <span>Current Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-found"></div>
              <span>Found Match</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-searched"></div>
              <span>Searched Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-empty"></div>
              <span>Empty Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-out-of-bounds"></div>
              <span>Out of Bounds</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array2d-code-column">
          {/* C++ Code Card */}
          <div className="array2d-code-card">
            <div className="array2d-code-header">
              <div className="code-title">2D_array_search.cpp</div>
              <div className="code-step">
                {currentStep >= 0 ? `Step ${currentStep + 1}` : 'Ready'} | Cell [{currentCell.row}][{currentCell.col}]
              </div>
            </div>
            <div className="array2d-code-content">
              {array2DSearchCode.map((lineObj, idx) => (
                <div 
                  key={idx} 
                  className={`
                    array2d-code-line
                    ${currentStep === idx ? "array2d-code-line-active" : ""}
                  `}
                >
                  <div className="code-line-number">{idx + 1}</div>
                  <code className="code-text">{lineObj.line}</code>
                  {currentStep === idx && lineObj.desc && (
                    <div className="code-line-desc">{lineObj.desc}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search Statistics */}
          <div className="search-statistics">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Comparisons</div>
                <div className="stat-value">{comparisonCount}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Cells Searched</div>
                <div className="stat-value">{searchPath.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Remaining</div>
                <div className="stat-value">{rows * cols - searchPath.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Search Mode</div>
                <div className="stat-value mode-stat">{searchMode === "row-major" ? "Row-Major" : "Col-Major"}</div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="array2d-control-buttons">
            <button 
              className={`array2d-control-btn ${isAutoPlay ? 'array2d-control-btn-active' : 'array2d-control-btn-play'}`}
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              disabled={!isProcessing}
            >
              {isAutoPlay ? (
                <>
                  <span className="btn-icon">⏸</span>
                  Pause Animation
                </>
              ) : (
                <>
                  <span className="btn-icon">▶</span>
                  Auto Play
                </>
              )}
            </button>
            
            <button 
              className="array2d-control-btn array2d-control-btn-next"
              onClick={handleNextStep}
              disabled={!isProcessing || isAutoPlay}
            >
              <span className="btn-icon">⏭</span>
              Next Step
            </button>
            
            <button 
              className="array2d-control-btn array2d-control-btn-reset"
              onClick={resetVisualization}
            >
              <span className="btn-icon">🔄</span>
              Reset All
            </button>
          </div>

          {/* Status/Description Card */}
          <div className="array2d-status-card">
            <div className="array2d-status-header">
              <div className="status-title">Search Trace</div>
              <div className="status-step">
                {foundCell.row !== -1 ? `Found! [${foundCell.row}][${foundCell.col}]` : 'Searching...'}
              </div>
            </div>
            <div className="array2d-status-content">
              <p className="status-message">{status}</p>
              {isProcessing && (
                <div className="status-progress">
                  <div 
                    className="status-progress-bar"
                    style={{ width: `${(searchPath.length / (rows * cols)) * 100}%` }}
                  ></div>
                  <div className="status-progress-text">
                    Search Progress: {searchPath.length} / {rows * cols} cells
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Found Result Display */}
          {foundCell.row !== -1 && (
            <div className="search-result-card">
              <div className="search-result-header">
                <div className="result-title">Search Result</div>
                <div className="result-comparisons">{comparisonCount} comparisons</div>
              </div>
              <div className="search-result-content">
                <div className="result-icon">🎯</div>
                <div className="result-details">
                  <h4>Match Found!</h4>
                  <p>Value <strong>{searchKey}</strong> found at position:</p>
                  <div className="result-position">
                    Row: <span className="position-value">{foundCell.row}</span> | 
                    Column: <span className="position-value">{foundCell.col}</span>
                  </div>
                  <div className="result-coordinates">
                    Coordinates: [{foundCell.row}][{foundCell.col}]
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default A2D_Array_Search;
import React, { useState, useEffect } from "react";
import "../styles/A3D_Array_Search.css";

const MAX_DEPTH = 3;
const MAX_ROWS = 3;
const MAX_COLS = 3;

const array3DSearchCode = [
  { line: "int search3D(int arr[][3][3], int depth, int rows, int cols, int key) {", desc: "Function to search in 3D array." },
  { line: "  for (int d = 0; d < depth; d++) {", desc: "Outer loop for depth layers." },
  { line: "    for (int r = 0; r < rows; r++) {", desc: "Middle loop for rows." },
  { line: "      for (int c = 0; c < cols; c++) {", desc: "Inner loop for columns." },
  { line: "        if (arr[d][r][c] == key)", desc: "Check if current element matches key." },
  { line: "          return {d, r, c}; // Found", desc: "Return depth, row, and column indices." },
  { line: "      }", desc: "Inner loop complete." },
  { line: "    }", desc: "Middle loop complete." },
  { line: "  }", desc: "Outer loop complete." },
  { line: "  return {-1, -1, -1}; // Not found", desc: "Key not found in 3D array." },
  { line: "}", desc: "" }
];

const A3D_Array_Search = () => {
  // Initialize 3D array with values (depth x rows x cols)
  const initialArray = [
    [ // Depth 0
      [15, 23, 8],
      [67, 34, 91],
      [12, 56, 78]
    ],
    [ // Depth 1
      [42, 19, 37],
      [84, 62, 29],
      [5, 73, 46]
    ],
    [ // Depth 2
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  ];
  
  const [array] = useState(initialArray);
  const [depth] = useState(2);
  const [rows] = useState(3);
  const [cols] = useState(3);
  const [searchKey, setSearchKey] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentCell, setCurrentCell] = useState({ depth: 0, row: 0, col: 0 });
  const [foundCell, setFoundCell] = useState({ depth: -1, row: -1, col: -1 });
  const [searchPath, setSearchPath] = useState([]);
  const [status, setStatus] = useState("Enter a value to search in the 3D array.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [searchMode, setSearchMode] = useState("depth-first"); // "depth-first" or "layer-first"
  const [comparisonCount, setComparisonCount] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(0);

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
    setCurrentCell({ depth: 0, row: 0, col: 0 });
    setFoundCell({ depth: -1, row: -1, col: -1 });
    setSearchPath([]);
    setComparisonCount(0);
    setCurrentLayer(0);
    setStatus(`Starting ${searchMode} search for ${key} in 3D array...`);
  };

  const handleNextStep = () => {
    const key = parseInt(searchKey);

    switch (currentStep) {
      case 0: // Function entry
        setCurrentStep(1);
        setStatus(`Search function called. Starting from cell [0][0][0].`);
        break;
        
      case 1: // Outer loop check (depth)
        if (currentCell.depth < depth) {
          setCurrentStep(2);
          setCurrentLayer(currentCell.depth);
          setStatus(`Entering depth layer ${currentCell.depth}. Starting row iteration.`);
        } else {
          setCurrentStep(9);
          setStatus(`Search complete. Key ${key} not found after ${comparisonCount} comparisons.`);
        }
        break;
        
      case 2: // Middle loop check (rows)
        if (currentCell.row < rows) {
          setCurrentStep(3);
          setStatus(`Entering row ${currentCell.row} in depth ${currentCell.depth}. Starting column iteration.`);
        } else {
          setCurrentStep(7);
          setStatus(`Depth ${currentCell.depth} complete. Moving to next depth layer.`);
        }
        break;
        
      case 3: // Inner loop check (columns)
        if (currentCell.col < cols) {
          setCurrentStep(4);
          setComparisonCount(prev => prev + 1);
          const currentValue = array[currentCell.depth][currentCell.row][currentCell.col];
          setStatus(`Checking cell [${currentCell.depth}][${currentCell.row}][${currentCell.col}]: ${currentValue} == ${key}?`);
        } else {
          setCurrentStep(6);
          setStatus(`Row ${currentCell.row} in depth ${currentCell.depth} complete. Moving to next row.`);
        }
        break;
        
      case 4: // Comparison check
        if (array[currentCell.depth][currentCell.row][currentCell.col] === key) {
          setCurrentStep(5);
          setFoundCell({ depth: currentCell.depth, row: currentCell.row, col: currentCell.col });
          setSearchPath([...searchPath, { depth: currentCell.depth, row: currentCell.row, col: currentCell.col }]);
          setStatus(`FOUND! Key ${key} found at position [${currentCell.depth}][${currentCell.row}][${currentCell.col}].`);
        } else {
          setCurrentStep(8);
          setSearchPath([...searchPath, { depth: currentCell.depth, row: currentCell.row, col: currentCell.col }]);
          setStatus(`${array[currentCell.depth][currentCell.row][currentCell.col]} ≠ ${key}. Moving to next cell.`);
        }
        break;
        
      case 5: // Return found
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setStatus(`SUCCESS: Found ${key} at [${foundCell.depth}][${foundCell.row}][${foundCell.col}] after ${comparisonCount} comparisons.`);
        break;
        
      case 6: // Move to next row in same depth
        if (searchMode === "depth-first") {
          setCurrentCell({ depth: currentCell.depth, row: currentCell.row + 1, col: 0 });
        } else {
          // For layer-first search, complete current column first
          setCurrentCell({ depth: currentCell.depth, row: currentCell.row + 1, col: currentCell.col });
        }
        setCurrentStep(2);
        break;
        
      case 7: // Move to next depth
        setCurrentCell({ depth: currentCell.depth + 1, row: 0, col: 0 });
        setCurrentStep(1);
        setCurrentLayer(currentCell.depth + 1);
        break;
        
      case 8: // Move to next column
        if (searchMode === "depth-first") {
          setCurrentCell({ depth: currentCell.depth, row: currentCell.row, col: currentCell.col + 1 });
        } else {
          // For layer-first search, move to next column in same row
          if (currentCell.col + 1 < cols) {
            setCurrentCell({ ...currentCell, col: currentCell.col + 1 });
          } else {
            setCurrentCell({ depth: currentCell.depth + 1, row: currentCell.row, col: 0 });
          }
        }
        setCurrentStep(3);
        break;
        
      case 9: // Return not found
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setStatus(`Key ${key} not found in the 3D array after checking all ${depth * rows * cols} cells.`);
        break;
        
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setSearchKey("");
    setCurrentStep(-1);
    setCurrentCell({ depth: 0, row: 0, col: 0 });
    setFoundCell({ depth: -1, row: -1, col: -1 });
    setSearchPath([]);
    setStatus("Enter a value to search in the 3D array.");
    setIsProcessing(false);
    setIsAutoPlay(false);
    setComparisonCount(0);
    setCurrentLayer(0);
  };

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === "depth-first" ? "layer-first" : "depth-first");
    setStatus(`Search mode switched to ${searchMode === "depth-first" ? "Layer-First" : "Depth-First"}.`);
  };

  const isCurrentCell = (d, r, c) => {
    return currentCell.depth === d && currentCell.row === r && currentCell.col === c;
  };

  const isFoundCell = (d, r, c) => {
    return foundCell.depth === d && foundCell.row === r && foundCell.col === c;
  };

  const isSearchedCell = (d, r, c) => {
    return searchPath.some(cell => cell.depth === d && cell.row === r && cell.col === c);
  };

  const isCellInBounds = (d, r, c) => {
    return d < depth && r < rows && c < cols;
  };

  const isCurrentLayer = (d) => {
    return d === currentLayer;
  };

  return (
    <div className="array3d-search-container">
      {/* Header Section */}
      <div className="array3d-search-header">
        <div className="array3d-search-inputs">
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
            className="array3d-search-btn" 
            onClick={startSearch} 
            disabled={isProcessing}
          >
            {isProcessing ? "Searching..." : "Start 3D Search"}
          </button>
          
          <button 
            className={`array3d-mode-toggle ${searchMode}`}
            onClick={toggleSearchMode}
            disabled={isProcessing}
          >
            {searchMode === "depth-first" ? (
              <>
                <span className="mode-icon">🧊</span>
                Depth-First
              </>
            ) : (
              <>
                <span className="mode-icon">📋</span>
                Layer-First
              </>
            )}
          </button>
        </div>

        <div className="array3d-speed-control">
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
      <div className="array3d-search-viz-body">
        {/* Left Column: 3D Array Visualization */}
        <div className="array3d-viz-column">
          <div className="array3d-viz-header">
            <h3>3D Array Search Visualization</h3>
            <div className="array3d-size-indicator">
              Dimensions: <span className="size-value">{depth}</span> × <span className="size-value">{rows}</span> × <span className="size-value">{cols}</span>
              <span className="comparison-count"> | Comparisons: <span className="count-value">{comparisonCount}</span></span>
            </div>
          </div>
          
          {/* Search Mode and Layer Display */}
          <div className="search-controls-display">
            <div className="mode-display">
              <span className="mode-label">Search Mode:</span>
              <span className={`mode-value ${searchMode}`}>
                {searchMode === "depth-first" ? "Depth-First (Depth → Row → Column)" : "Layer-First (Row → Column → Depth)"}
              </span>
            </div>
            <div className="layer-controls">
              <span className="layer-label">Current Layer:</span>
              <div className="layer-buttons">
                {Array.from({ length: MAX_DEPTH }).map((_, dIndex) => (
                  <button
                    key={dIndex}
                    className={`layer-btn ${dIndex === currentLayer ? 'layer-btn-active' : ''} ${dIndex >= depth ? 'layer-btn-out-of-bounds' : ''}`}
                    onClick={() => setCurrentLayer(dIndex)}
                    disabled={isProcessing}
                  >
                    Depth {dIndex}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* 3D Grid Display (Current Layer) */}
          <div className="array3d-grid-container">
            <div className="array3d-coordinate-label">
              {/* Column indices */}
              <div className="col-header-row">
                <div className="empty-corner">
                  Depth {currentLayer}
                  {isCurrentLayer(currentCell.depth) && <span className="active-layer-badge">Active</span>}
                </div>
                {Array.from({ length: MAX_COLS }).map((_, colIndex) => (
                  <div key={colIndex} className="col-header">
                    Col {colIndex}
                  </div>
                ))}
              </div>
              
              {/* Rows with row labels and cells */}
              {Array.from({ length: MAX_ROWS }).map((_, rowIndex) => (
                <div key={rowIndex} className="array3d-grid-row">
                  <div className="row-header">
                    Row {rowIndex}
                  </div>
                  {Array.from({ length: MAX_COLS }).map((_, colIndex) => {
                    const isCurrent = isCurrentCell(currentLayer, rowIndex, colIndex);
                    const isFound = isFoundCell(currentLayer, rowIndex, colIndex);
                    const isSearched = isSearchedCell(currentLayer, rowIndex, colIndex);
                    const inBounds = isCellInBounds(currentLayer, rowIndex, colIndex);
                    const isEmpty = array[currentLayer][rowIndex][colIndex] === null;
                    
                    return (
                      <div 
                        key={`${currentLayer}-${rowIndex}-${colIndex}`}
                        className={`
                          array3d-cell
                          ${isCurrent ? "array3d-cell-current" : ""}
                          ${isFound ? "array3d-cell-found" : ""}
                          ${isSearched && !isFound ? "array3d-cell-searched" : ""}
                          ${!inBounds ? "array3d-cell-out-of-bounds" : ""}
                          ${isEmpty ? "array3d-cell-empty" : ""}
                        `}
                      >
                        <div className="array3d-cell-coords">
                          [{currentLayer}][{rowIndex}][{colIndex}]
                        </div>
                        <div className="array3d-cell-value">
                          {array[currentLayer][rowIndex][colIndex] !== null ? 
                            array[currentLayer][rowIndex][colIndex] : 
                            <span className="empty-symbol">∅</span>}
                        </div>
                        
                        {/* Cell indicators */}
                        {isCurrent && (
                          <div className="array3d-cell-indicator">
                            Checking
                          </div>
                        )}
                        
                        {isFound && (
                          <div className="array3d-cell-found-indicator">
                            Found!
                          </div>
                        )}
                        
                        {/* Search order number */}
                        {isSearched && !isFound && (
                          <div className="array3d-cell-order">
                            {searchPath.findIndex(cell => 
                              cell.depth === currentLayer && 
                              cell.row === rowIndex && 
                              cell.col === colIndex) + 1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* 3D Cube Representation */}
          <div className="array3d-cube-representation">
            <div className="cube-title">3D Structure Overview</div>
            <div className="cube-layers">
              {Array.from({ length: MAX_DEPTH }).map((_, dIndex) => (
                <div key={dIndex} className={`cube-layer ${dIndex === currentLayer ? 'cube-layer-active' : ''}`}>
                  <div className="cube-layer-header">
                    <span className="cube-layer-label">Depth {dIndex}</span>
                    {dIndex === foundCell.depth && (
                      <span className="cube-layer-found">✓ Found</span>
                    )}
                  </div>
                  <div className="cube-layer-grid">
                    {Array.from({ length: MAX_ROWS }).map((_, rIndex) => (
                      <div key={rIndex} className="cube-layer-row">
                        {Array.from({ length: MAX_COLS }).map((_, cIndex) => {
                          const inBounds = isCellInBounds(dIndex, rIndex, cIndex);
                          const hasValue = array[dIndex][rIndex][cIndex] !== null;
                          const isCurrent = isCurrentCell(dIndex, rIndex, cIndex);
                          const isFound = isFoundCell(dIndex, rIndex, cIndex);
                          const isSearched = isSearchedCell(dIndex, rIndex, cIndex);
                          
                          return (
                            <div 
                              key={cIndex}
                              className={`
                                cube-cell
                                ${inBounds ? 'cube-cell-in-bounds' : 'cube-cell-out-of-bounds'}
                                ${hasValue ? 'cube-cell-has-value' : ''}
                                ${isCurrent ? 'cube-cell-current' : ''}
                                ${isFound ? 'cube-cell-found' : ''}
                                ${isSearched ? 'cube-cell-searched' : ''}
                              `}
                              title={`[${dIndex}][${rIndex}][${cIndex}]: ${array[dIndex][rIndex][cIndex] || 'empty'}`}
                            >
                              {isFound ? '🎯' : (isCurrent ? '🔍' : (hasValue ? '●' : '○'))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Search Statistics */}
          <div className="search-statistics">
            <div className="stats-title">Search Statistics</div>
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
                <div className="stat-value">{depth * rows * cols - searchPath.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Progress</div>
                <div className="stat-value">
                  {((searchPath.length / (depth * rows * cols)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="array3d-viz-legend">
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
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array3d-code-column">
          {/* C++ Code Card */}
          <div className="array3d-code-card">
            <div className="array3d-code-header">
              <div className="code-title">3D_array_search.cpp</div>
              <div className="code-step">
                Step {currentStep >= 0 ? currentStep + 1 : 0} | 
                Cell [{currentCell.depth}][{currentCell.row}][{currentCell.col}]
              </div>
            </div>
            <div className="array3d-code-content">
              {array3DSearchCode.map((lineObj, idx) => (
                <div 
                  key={idx} 
                  className={`
                    array3d-code-line
                    ${currentStep === idx ? "array3d-code-line-active" : ""}
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

          {/* Search Path Display */}
          <div className="search-path-display">
            <div className="path-title">Search Path History</div>
            <div className="path-container">
              {searchPath.length > 0 ? (
                <div className="path-cells">
                  {searchPath.map((cell, index) => (
                    <div 
                      key={index} 
                      className={`path-cell ${foundCell.depth === cell.depth && 
                                       foundCell.row === cell.row && 
                                       foundCell.col === cell.col ? 'path-cell-found' : ''}`}
                    >
                      <div className="path-cell-order">{index + 1}</div>
                      <div className="path-cell-coords">[{cell.depth}][{cell.row}][{cell.col}]</div>
                      <div className="path-cell-value">{array[cell.depth][cell.row][cell.col]}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-path-message">Search path will appear here...</div>
              )}
              {searchPath.length > 0 && (
                <div className="path-summary">
                  Total cells visited: {searchPath.length}
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="array3d-control-buttons">
            <button 
              className={`array3d-control-btn ${isAutoPlay ? 'array3d-control-btn-active' : 'array3d-control-btn-play'}`}
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
              className="array3d-control-btn array3d-control-btn-next"
              onClick={handleNextStep}
              disabled={!isProcessing || isAutoPlay}
            >
              <span className="btn-icon">⏭</span>
              Next Step
            </button>
            
            <button 
              className="array3d-control-btn array3d-control-btn-reset"
              onClick={resetVisualization}
            >
              <span className="btn-icon">🔄</span>
              Reset All
            </button>
          </div>

          {/* Status/Description Card */}
          <div className="array3d-status-card">
            <div className="array3d-status-header">
              <div className="status-title">3D Search Trace</div>
              <div className="status-step">
                {foundCell.depth !== -1 ? 
                  `Found! [${foundCell.depth}][${foundCell.row}][${foundCell.col}]` : 
                  'Searching...'}
              </div>
            </div>
            <div className="array3d-status-content">
              <p className="status-message">{status}</p>
              {isProcessing && (
                <div className="status-progress">
                  <div 
                    className="status-progress-bar"
                    style={{ width: `${(searchPath.length / (depth * rows * cols)) * 100}%` }}
                  ></div>
                  <div className="status-progress-text">
                    Progress: {searchPath.length} / {depth * rows * cols} cells
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Found Result Display */}
          {foundCell.depth !== -1 && (
            <div className="search-result-card">
              <div className="search-result-header">
                <div className="result-title">3D Search Result</div>
                <div className="result-comparisons">{comparisonCount} comparisons</div>
              </div>
              <div className="search-result-content">
                <div className="result-icon">🎯</div>
                <div className="result-details">
                  <h4>Match Found in 3D Space!</h4>
                  <p>Value <strong>{searchKey}</strong> found at:</p>
                  <div className="result-coordinates">
                    <div className="coord-item">
                      <span className="coord-label">Depth:</span>
                      <span className="coord-value">{foundCell.depth}</span>
                    </div>
                    <div className="coord-item">
                      <span className="coord-label">Row:</span>
                      <span className="coord-value">{foundCell.row}</span>
                    </div>
                    <div className="coord-item">
                      <span className="coord-label">Column:</span>
                      <span className="coord-value">{foundCell.col}</span>
                    </div>
                  </div>
                  <div className="result-full-coords">
                    [{foundCell.depth}][{foundCell.row}][{foundCell.col}]
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

export default A3D_Array_Search;
import React, { useState, useEffect } from "react";
import "../styles/A3D_Array_Insert.css";

const MAX_DEPTH = 3;
const MAX_ROWS = 3;
const MAX_COLS = 3;

const array3DInsertCode = [
  { line: "int arr[3][3][3]; int depth = 2, rows = 2, cols = 2;", desc: "Initialize 3D array with current dimensions." },
  { line: "if (d >= depth || r >= rows || c >= cols)", desc: "Check if position is within bounds." },
  { line: "  return -1; // Invalid position", desc: "Error: position out of bounds." },
  { line: "// 3D shifting requires 3 nested loops", desc: "Need to shift in depth, row, and column." },
  { line: "for (int i = depth - 1; i >= d; i--) {", desc: "Start shifting from deepest layer." },
  { line: "  for (int j = rows - 1; j >= r; j--) {", desc: "Shift rows from bottom." },
  { line: "    for (int k = cols - 1; k >= c; k--) {", desc: "Shift columns from right." },
  { line: "      arr[i][j][k + 1] = arr[i][j][k];", desc: "Move element in current layer." },
  { line: "    }", desc: "Column shift complete." },
  { line: "  }", desc: "Row shift complete." },
  { line: "}", desc: "Depth shift complete." },
  { line: "arr[d][r][c] = value;", desc: "Insert new value at target." },
  { line: "if (c == cols - 1) cols++;", desc: "Update column count if at edge." }
];

const A3D_Array_Insert = () => {
  // Initialize 3D array with values (depth x rows x cols)
  const initialArray = [
    [ // Depth 0
      [10, 20, null],
      [30, 40, null],
      [null, null, null]
    ],
    [ // Depth 1
      [50, 60, null],
      [70, 80, null],
      [null, null, null]
    ],
    [ // Depth 2 (empty)
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  ];
  
  const [array, setArray] = useState(initialArray);
  const [depth, setDepth] = useState(2);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [inputValue, setInputValue] = useState("");
  const [inputDepth, setInputDepth] = useState("");
  const [inputRow, setInputRow] = useState("");
  const [inputCol, setInputCol] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeCell, setActiveCell] = useState({ depth: -1, row: -1, col: -1 });
  const [targetCell, setTargetCell] = useState({ depth: -1, row: -1, col: -1 });
  const [status, setStatus] = useState("Enter depth (0-1), row (0-1), column (0-1) and value to insert.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [shiftingMode, setShiftingMode] = useState(""); // "depth", "row", or "col"
  const [currentLayer, setCurrentLayer] = useState(0); // For visualizing current depth layer

  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => handleNextStep(), speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep, speed]);

  const startInsert = () => {
    const d = parseInt(inputDepth);
    const r = parseInt(inputRow);
    const c = parseInt(inputCol);
    const val = parseInt(inputValue);
    
    if (isNaN(d) || isNaN(r) || isNaN(c) || isNaN(val) || 
        d < 0 || d >= depth || r < 0 || r >= rows || c < 0 || c >= cols) {
      setStatus("Invalid input! Depth, row, and column must be within current bounds.");
      return;
    }
    
    if (depth >= MAX_DEPTH && rows >= MAX_ROWS && cols >= MAX_COLS) {
      setStatus("Error: 3D array is at maximum capacity!");
      return;
    }
    
    setIsProcessing(true);
    setCurrentStep(0);
    setTargetCell({ depth: d, row: r, col: c });
    setCurrentLayer(d);
    setStatus(`Initializing insertion of ${val} at position [${d}][${r}][${c}].`);
  };

  const handleNextStep = () => {
    const d = parseInt(inputDepth);
    const r = parseInt(inputRow);
    const c = parseInt(inputCol);
    const val = parseInt(inputValue);

    switch (currentStep) {
      case 0: // Initialization
        setCurrentStep(1);
        setStatus("Checking if position is within 3D bounds...");
        break;
        
      case 1: // Bounds check
        setCurrentStep(2);
        setActiveCell({ depth: depth - 1, row: rows - 1, col: cols - 1 });
        setStatus(`Starting from back-bottom-right corner [${depth-1}][${rows-1}][${cols-1}].`);
        break;
        
      case 2: // Outer loop start (depth)
        if (activeCell.depth >= d) {
          setCurrentStep(3);
          setShiftingMode("depth");
          setCurrentLayer(activeCell.depth);
          setStatus(`Processing depth layer ${activeCell.depth}. Starting from row ${rows-1}.`);
        } else {
          setCurrentStep(8);
          setStatus("All depth layers processed. Ready to insert value.");
        }
        break;
        
      case 3: // Middle loop start (rows)
        if (activeCell.row >= r) {
          setCurrentStep(4);
          setShiftingMode("row");
          setStatus(`Processing row ${activeCell.row} in depth ${activeCell.depth}. Starting from column ${cols-1}.`);
        } else {
          setCurrentStep(6);
          setStatus(`Depth ${activeCell.depth} shifting complete. Moving to next depth.`);
        }
        break;
        
      case 4: // Inner loop start (columns)
        if (activeCell.col >= c) {
          setCurrentStep(5);
          setShiftingMode("col");
          setStatus(`Shifting element at [${activeCell.depth}][${activeCell.row}][${activeCell.col}].`);
        } else {
          setCurrentStep(7);
          setStatus(`Row ${activeCell.row} in depth ${activeCell.depth} shifting complete.`);
        }
        break;
        
      case 5: // Actual 3D shift operation
        const newArr = [...array.map(layer => layer.map(row => [...row]))];
        if (activeCell.col + 1 < MAX_COLS) {
          newArr[activeCell.depth][activeCell.row][activeCell.col + 1] = 
            array[activeCell.depth][activeCell.row][activeCell.col];
          newArr[activeCell.depth][activeCell.row][activeCell.col] = null;
          setArray(newArr);
        }
        setCurrentStep(9);
        setStatus(`Moved element to [${activeCell.depth}][${activeCell.row}][${activeCell.col + 1}].`);
        break;
        
      case 6: // Move to next row in same depth
        setActiveCell({ ...activeCell, row: activeCell.row - 1, col: cols - 1 });
        setCurrentStep(3);
        setStatus(`Moving to row ${activeCell.row - 1} in depth ${activeCell.depth}...`);
        break;
        
      case 7: // Move to next depth
        setActiveCell({ depth: activeCell.depth - 1, row: rows - 1, col: cols - 1 });
        setCurrentStep(2);
        setCurrentLayer(activeCell.depth - 1);
        setStatus(`Moving to depth layer ${activeCell.depth - 1}...`);
        break;
        
      case 8: // Insert value after all shifting
        const finalArr = [...array.map(layer => layer.map(row => [...row]))];
        finalArr[d][r][c] = val;
        setArray(finalArr);
        setActiveCell({ depth: d, row: r, col: c });
        setCurrentStep(10);
        setStatus(`Inserted ${val} at position [${d}][${r}][${c}].`);
        break;
        
      case 9: // Move to previous column
        setActiveCell({ ...activeCell, col: activeCell.col - 1 });
        setCurrentStep(4);
        setStatus("Moving to previous column...");
        break;
        
      case 10: // Update column count if needed
        if (c === cols - 1 && cols < MAX_COLS) {
          setCols(cols + 1);
          setStatus(`Column count increased to ${cols + 1}.`);
        }
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setStatus(`SUCCESS: Value inserted! 3D array dimensions: ${depth} × ${rows} × ${cols}`);
        break;
        
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setArray(initialArray);
    setDepth(2);
    setRows(2);
    setCols(2);
    setInputValue("");
    setInputDepth("");
    setInputRow("");
    setInputCol("");
    setCurrentStep(-1);
    setActiveCell({ depth: -1, row: -1, col: -1 });
    setTargetCell({ depth: -1, row: -1, col: -1 });
    setStatus("Enter depth (0-1), row (0-1), column (0-1) and value to insert.");
    setIsProcessing(false);
    setIsAutoPlay(false);
    setShiftingMode("");
    setCurrentLayer(0);
  };

  const isCellActive = (d, r, c) => {
    return activeCell.depth === d && activeCell.row === r && activeCell.col === c;
  };

  const isTargetCell = (d, r, c) => {
    return targetCell.depth === d && targetCell.row === r && targetCell.col === c;
  };

  const isCellInBounds = (d, r, c) => {
    return d < depth && r < rows && c < cols;
  };

  const isCurrentLayer = (d) => {
    return d === currentLayer;
  };

  return (
    <div className="array3d-insert-container">
      {/* Header Section */}
      <div className="array3d-insert-header">
        <div className="array3d-insert-inputs">
          <div className="input-group">
            <label htmlFor="insert-depth">Depth (0-{depth-1})</label>
            <input 
              id="insert-depth"
              type="number" 
              value={inputDepth} 
              onChange={(e) => setInputDepth(e.target.value)} 
              placeholder="e.g. 0" 
              disabled={isProcessing}
              min="0"
              max={depth-1}
            />
          </div>
          <div className="input-group">
            <label htmlFor="insert-row">Row (0-{rows-1})</label>
            <input 
              id="insert-row"
              type="number" 
              value={inputRow} 
              onChange={(e) => setInputRow(e.target.value)} 
              placeholder="e.g. 1" 
              disabled={isProcessing}
              min="0"
              max={rows-1}
            />
          </div>
          <div className="input-group">
            <label htmlFor="insert-col">Column (0-{cols-1})</label>
            <input 
              id="insert-col"
              type="number" 
              value={inputCol} 
              onChange={(e) => setInputCol(e.target.value)} 
              placeholder="e.g. 2" 
              disabled={isProcessing}
              min="0"
              max={cols-1}
            />
          </div>
          <div className="input-group">
            <label htmlFor="insert-value">Value to Insert</label>
            <input 
              id="insert-value"
              type="number" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="e.g. 99" 
              disabled={isProcessing}
            />
          </div>
          <button 
            className="array3d-insert-btn" 
            onClick={startInsert} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Insert in 3D Array"}
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
      <div className="array3d-insert-viz-body">
        {/* Left Column: 3D Array Visualization */}
        <div className="array3d-viz-column">
          <div className="array3d-viz-header">
            <h3>3D Array Memory Visualization</h3>
            <div className="array3d-size-indicator">
              Dimensions: <span className="size-value">{depth}</span> × <span className="size-value">{rows}</span> × <span className="size-value">{cols}</span>
              <span className="max-size"> (Max: {MAX_DEPTH} × {MAX_ROWS} × {MAX_COLS})</span>
            </div>
          </div>
          
          {/* Current Layer Display */}
          <div className="current-layer-display">
            <div className="layer-label">Current Layer:</div>
            <div className="layer-selector">
              {Array.from({ length: MAX_DEPTH }).map((_, dIndex) => (
                <button
                  key={dIndex}
                  className={`layer-btn ${dIndex === currentLayer ? 'layer-btn-active' : ''} ${dIndex >= depth ? 'layer-btn-out-of-bounds' : ''}`}
                  onClick={() => setCurrentLayer(dIndex)}
                  disabled={isProcessing}
                >
                  Depth {dIndex}
                  {dIndex >= depth && <span className="out-of-bounds-badge">OOB</span>}
                </button>
              ))}
            </div>
            <div className="layer-status">
              {isCurrentLayer(activeCell.depth) ? (
                <span className="layer-active">Active Layer (Shifting)</span>
              ) : (
                <span className="layer-inactive">Viewing Layer</span>
              )}
            </div>
          </div>
          
          {/* 3D Grid Display (Current Layer) */}
          <div className="array3d-grid-container">
            <div className="array3d-coordinate-label">
              {/* Column indices */}
              <div className="col-header-row">
                <div className="empty-corner">Depth {currentLayer}</div>
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
                    const isActive = isCellActive(currentLayer, rowIndex, colIndex);
                    const isTarget = isTargetCell(currentLayer, rowIndex, colIndex);
                    const inBounds = isCellInBounds(currentLayer, rowIndex, colIndex);
                    const isEmpty = array[currentLayer][rowIndex][colIndex] === null;
                    const isShiftingLayer = isCurrentLayer(activeCell.depth);
                    const isShiftingRow = shiftingMode === "row" && rowIndex === activeCell.row;
                    const isShiftingCol = shiftingMode === "col" && colIndex === activeCell.col;
                    
                    return (
                      <div 
                        key={`${currentLayer}-${rowIndex}-${colIndex}`}
                        className={`
                          array3d-cell
                          ${isActive ? "array3d-cell-active" : ""}
                          ${isTarget ? "array3d-cell-target" : ""}
                          ${!inBounds ? "array3d-cell-out-of-bounds" : ""}
                          ${isEmpty ? "array3d-cell-empty" : ""}
                          ${isShiftingLayer && isShiftingRow ? "array3d-row-shifting" : ""}
                          ${isShiftingLayer && isShiftingCol ? "array3d-col-shifting" : ""}
                          ${isShiftingLayer && shiftingMode === "depth" ? "array3d-depth-shifting" : ""}
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
                        {isActive && (
                          <div className="array3d-cell-indicator">
                            Moving
                          </div>
                        )}
                        
                        {isTarget && !isActive && (
                          <div className="array3d-cell-target-indicator">
                            Target
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
            <div className="cube-title">3D Structure:</div>
            <div className="cube-layers">
              {Array.from({ length: MAX_DEPTH }).map((_, dIndex) => (
                <div key={dIndex} className={`cube-layer ${dIndex === currentLayer ? 'cube-layer-active' : ''}`}>
                  <div className="cube-layer-label">Depth {dIndex}</div>
                  <div className="cube-layer-grid">
                    {Array.from({ length: MAX_ROWS }).map((_, rIndex) => (
                      <div key={rIndex} className="cube-layer-row">
                        {Array.from({ length: MAX_COLS }).map((_, cIndex) => {
                          const inBounds = isCellInBounds(dIndex, rIndex, cIndex);
                          const hasValue = array[dIndex][rIndex][cIndex] !== null;
                          const isActiveLayer = dIndex === activeCell.depth;
                          
                          return (
                            <div 
                              key={cIndex}
                              className={`
                                cube-cell
                                ${inBounds ? 'cube-cell-in-bounds' : 'cube-cell-out-of-bounds'}
                                ${hasValue ? 'cube-cell-has-value' : ''}
                                ${isActiveLayer ? 'cube-cell-active-layer' : ''}
                              `}
                              title={`[${dIndex}][${rIndex}][${cIndex}]: ${array[dIndex][rIndex][cIndex] || 'empty'}`}
                            >
                              {hasValue ? '●' : '○'}
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
          
          {/* Legend */}
          <div className="array3d-viz-legend">
            <div className="legend-item">
              <div className="legend-color legend-active"></div>
              <span>Active Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-target"></div>
              <span>Target Position</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-depth-shift"></div>
              <span>Depth Shifting</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-row-shift"></div>
              <span>Row Shifting</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-col-shift"></div>
              <span>Column Shifting</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array3d-code-column">
          {/* C++ Code Card */}
          <div className="array3d-code-card">
            <div className="array3d-code-header">
              <div className="code-title">3D_array_insert.cpp</div>
              <div className="code-step">Step {currentStep >= 0 ? currentStep + 1 : 0}/11</div>
            </div>
            <div className="array3d-code-content">
              {array3DInsertCode.map((lineObj, idx) => (
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

          {/* 3D Coordinate Display */}
          <div className="coordinate-display">
            <div className="coordinate-title">Current Coordinates</div>
            <div className="coordinate-grid">
              <div className="coordinate-item">
                <div className="coord-label">Depth</div>
                <div className="coord-value">{activeCell.depth >= 0 ? activeCell.depth : '-'}</div>
              </div>
              <div className="coordinate-item">
                <div className="coord-label">Row</div>
                <div className="coord-value">{activeCell.row >= 0 ? activeCell.row : '-'}</div>
              </div>
              <div className="coordinate-item">
                <div className="coord-label">Column</div>
                <div className="coord-value">{activeCell.col >= 0 ? activeCell.col : '-'}</div>
              </div>
            </div>
            <div className="full-coordinate">
              [{activeCell.depth >= 0 ? activeCell.depth : '?'}]
              [{activeCell.row >= 0 ? activeCell.row : '?'}]
              [{activeCell.col >= 0 ? activeCell.col : '?'}]
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
              <div className="status-title">Execution Trace</div>
              <div className="status-step">
                {currentStep >= 0 ? `Step ${currentStep + 1}` : 'Ready'}
              </div>
            </div>
            <div className="array3d-status-content">
              <p className="status-message">{status}</p>
              {isProcessing && (
                <div className="status-progress">
                  <div 
                    className="status-progress-bar"
                    style={{ width: `${((currentStep + 1) / 11) * 100}%` }}
                  ></div>
                  <div className="status-progress-text">
                    Progress: {currentStep + 1} / 11 steps
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default A3D_Array_Insert;
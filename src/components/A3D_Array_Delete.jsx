import React, { useState, useEffect } from "react";
import "../styles/A3D_Array_Delete.css";

const MAX_DEPTH = 3;
const MAX_ROWS = 3;
const MAX_COLS = 3;

const array3DDeleteCode = [
  { line: "int arr[3][3][3]; int depth = 2, rows = 2, cols = 2;", desc: "Initialize 3D array with current dimensions." },
  { line: "if (d >= depth || r >= rows || c >= cols)", desc: "Check if position is within 3D bounds." },
  { line: "  return -1; // Invalid position", desc: "Error: position out of bounds." },
  { line: "int deleted = arr[d][r][c];", desc: "Store the value to be deleted." },
  { line: "for (int k = c; k < cols - 1; k++) {", desc: "Shift columns left in current row." },
  { line: "  arr[d][r][k] = arr[d][r][k + 1];", desc: "Move element one column left." },
  { line: "}", desc: "Column shifting complete." },
  { line: "arr[d][r][cols - 1] = NULL;", desc: "Clear the last column position." },
  { line: "if (c == cols - 1) cols--;", desc: "Update column count if needed." },
  { line: "return deleted;", desc: "Return the deleted value." }
];

const A3D_Array_Delete = () => {
  // Initialize 3D array with values (depth x rows x cols)
  const initialArray = [
    [ // Depth 0
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90]
    ],
    [ // Depth 1
      [11, 22, 33],
      [44, 55, 66],
      [77, 88, 99]
    ],
    [ // Depth 2 (partially filled)
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  ];
  
  const [array, setArray] = useState(initialArray);
  const [depth, setDepth] = useState(2);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [deletedValue, setDeletedValue] = useState(null);
  const [inputDepth, setInputDepth] = useState("");
  const [inputRow, setInputRow] = useState("");
  const [inputCol, setInputCol] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeCell, setActiveCell] = useState({ depth: -1, row: -1, col: -1 });
  const [targetCell, setTargetCell] = useState({ depth: -1, row: -1, col: -1 });
  const [status, setStatus] = useState("Enter depth (0-1), row (0-2), column (0-2) to delete from 3D array.");
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

  const startDelete = () => {
    const d = parseInt(inputDepth);
    const r = parseInt(inputRow);
    const c = parseInt(inputCol);
    
    if (isNaN(d) || isNaN(r) || isNaN(c) || 
        d < 0 || d >= depth || r < 0 || r >= rows || c < 0 || c >= cols) {
      setStatus("Invalid input! Depth, row, and column must be within current bounds.");
      return;
    }
    
    if (array[d][r][c] === null) {
      setStatus("Error: Cell is already empty!");
      return;
    }
    
    setIsProcessing(true);
    setCurrentStep(0);
    setTargetCell({ depth: d, row: r, col: c });
    setDeletedValue(array[d][r][c]);
    setCurrentLayer(d);
    setStatus(`Initializing deletion at position [${d}][${r}][${c}]. Value: ${array[d][r][c]}`);
  };

  const handleNextStep = () => {
    const d = parseInt(inputDepth);
    const r = parseInt(inputRow);
    const c = parseInt(inputCol);

    switch (currentStep) {
      case 0: // Initialization
        setCurrentStep(1);
        setStatus("Checking if position is within 3D bounds...");
        break;
        
      case 1: // Bounds check
        setCurrentStep(2);
        setActiveCell({ depth: d, row: r, col: c });
        setStatus(`Position valid. Storing value ${array[d][r][c]} to be deleted.`);
        break;
        
      case 2: // Store deleted value
        setCurrentStep(3);
        setActiveCell({ depth: d, row: r, col: c + 1 });
        setShiftingMode("row");
        setStatus(`Starting column shift in depth ${d}, row ${r} from column ${c + 1}.`);
        break;
        
      case 3: // For loop check (columns)
        if (activeCell.col < cols - 1) {
          setCurrentStep(4);
          setStatus(`Shifting ${array[d][r][activeCell.col]} from [${d}][${r}][${activeCell.col}] to [${d}][${r}][${activeCell.col - 1}].`);
        } else {
          setCurrentStep(5);
          setStatus("Column shifting complete for this row.");
        }
        break;
        
      case 4: // Actual shift operation
        const newArr = [...array.map(layer => layer.map(row => [...row]))];
        newArr[d][r][activeCell.col - 1] = array[d][r][activeCell.col];
        newArr[d][r][activeCell.col] = null;
        setArray(newArr);
        setCurrentStep(6);
        setStatus(`Moved element to [${d}][${r}][${activeCell.col - 1}].`);
        break;
        
      case 5: // Clear last position
        const arrAfterClear = [...array.map(layer => layer.map(row => [...row]))];
        arrAfterClear[d][r][cols - 1] = null;
        setArray(arrAfterClear);
        setActiveCell({ depth: d, row: r, col: cols - 1 });
        setCurrentStep(7);
        setStatus(`Cleared position [${d}][${r}][${cols - 1}].`);
        break;
        
      case 6: // Move to next column
        setActiveCell({ depth: d, row: r, col: activeCell.col + 1 });
        setCurrentStep(3);
        setStatus("Moving to next column...");
        break;
        
      case 7: // Update column count if needed
        if (c === cols - 1) {
          setCols(cols - 1);
          setStatus(`Column count decreased to ${cols - 1} (deleted from last column).`);
        } else {
          setStatus("Column count unchanged (deleted from middle column).");
        }
        setCurrentStep(8);
        break;
        
      case 8: // Return deleted value
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setActiveCell({ depth: -1, row: -1, col: -1 });
        setStatus(`SUCCESS: Deleted value ${deletedValue} from [${d}][${r}][${c}]. 3D dimensions: ${depth} × ${rows} × ${c === cols - 1 ? cols - 1 : cols}`);
        break;
        
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setArray(initialArray);
    setDepth(2);
    setRows(3);
    setCols(3);
    setDeletedValue(null);
    setInputDepth("");
    setInputRow("");
    setInputCol("");
    setCurrentStep(-1);
    setActiveCell({ depth: -1, row: -1, col: -1 });
    setTargetCell({ depth: -1, row: -1, col: -1 });
    setStatus("Enter depth (0-1), row (0-2), column (0-2) to delete from 3D array.");
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

  const isShiftingCell = (d, r, c) => {
    // Check if this cell should be highlighted as shifting
    return d === activeCell.depth && 
           r === activeCell.row && 
           c >= targetCell.col && 
           c <= activeCell.col;
  };

  return (
    <div className="array3d-delete-container">
      {/* Header Section */}
      <div className="array3d-delete-header">
        <div className="array3d-delete-inputs">
          <div className="input-group">
            <label htmlFor="delete-depth">Depth (0-{depth-1})</label>
            <input 
              id="delete-depth"
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
            <label htmlFor="delete-row">Row (0-{rows-1})</label>
            <input 
              id="delete-row"
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
            <label htmlFor="delete-col">Column (0-{cols-1})</label>
            <input 
              id="delete-col"
              type="number" 
              value={inputCol} 
              onChange={(e) => setInputCol(e.target.value)} 
              placeholder="e.g. 2" 
              disabled={isProcessing}
              min="0"
              max={cols-1}
            />
          </div>
          <button 
            className="array3d-delete-btn" 
            onClick={startDelete} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Delete from 3D Array"}
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
      <div className="array3d-delete-viz-body">
        {/* Left Column: 3D Array Visualization */}
        <div className="array3d-viz-column">
          <div className="array3d-viz-header">
            <h3>3D Array Memory Visualization</h3>
            <div className="array3d-size-indicator">
              Dimensions: <span className="size-value">{depth}</span> × <span className="size-value">{rows}</span> × <span className="size-value">{cols}</span>
              {deletedValue !== null && (
                <span className="deleted-value-display">
                  | Deleted: <span className="deleted-value">{deletedValue}</span>
                </span>
              )}
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
              {isCurrentLayer(targetCell.depth) ? (
                <span className="layer-target">Target Layer (Deleting)</span>
              ) : isCurrentLayer(activeCell.depth) ? (
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
                    const isShifting = isShiftingCell(currentLayer, rowIndex, colIndex);
                    const inBounds = isCellInBounds(currentLayer, rowIndex, colIndex);
                    const isEmpty = array[currentLayer][rowIndex][colIndex] === null;
                    
                    return (
                      <div 
                        key={`${currentLayer}-${rowIndex}-${colIndex}`}
                        className={`
                          array3d-cell
                          ${isActive ? "array3d-cell-active" : ""}
                          ${isTarget ? "array3d-cell-target" : ""}
                          ${isShifting ? "array3d-cell-shifting" : ""}
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
                        {isActive && (
                          <div className="array3d-cell-indicator">
                            Shifting
                          </div>
                        )}
                        
                        {isTarget && !isActive && currentStep <= 2 && (
                          <div className="array3d-cell-target-indicator">
                            Target
                          </div>
                        )}
                        
                        {isTarget && currentStep > 2 && (
                          <div className="array3d-cell-deleted-indicator">
                            Deleted
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Deletion Flow Visualization */}
          <div className="deletion-flow-visualization">
            <div className="flow-title">3D Deletion Flow:</div>
            <div className="flow-steps">
              <div className={`flow-step ${currentStep >= 0 ? "flow-step-active" : ""}`}>
                <div className="flow-step-number">1</div>
                <div className="flow-step-text">Locate Target</div>
                <div className="flow-step-coords">
                  {targetCell.depth >= 0 ? `[${targetCell.depth}][${targetCell.row}][${targetCell.col}]` : "?"}
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className={`flow-step ${currentStep >= 2 ? "flow-step-active" : ""}`}>
                <div className="flow-step-number">2</div>
                <div className="flow-step-text">Store Value</div>
                <div className="flow-step-value">
                  {deletedValue !== null ? deletedValue : "?"}
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className={`flow-step ${currentStep >= 3 ? "flow-step-active" : ""}`}>
                <div className="flow-step-number">3</div>
                <div className="flow-step-text">Shift Left</div>
                <div className="flow-step-detail">
                  {activeCell.col > targetCell.col ? `${activeCell.col - targetCell.col} cells` : "-"}
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className={`flow-step ${currentStep >= 7 ? "flow-step-active" : ""}`}>
                <div className="flow-step-number">4</div>
                <div className="flow-step-text">Clear Last</div>
                <div className="flow-step-detail">
                  {targetCell.depth >= 0 ? `[${targetCell.depth}][${targetCell.row}][${cols-1}]` : "?"}
                </div>
              </div>
            </div>
          </div>
          
          {/* 3D Cube Representation */}
          <div className="array3d-cube-representation">
            <div className="cube-title">3D Structure Overview:</div>
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
                          const isTargetLayer = dIndex === targetCell.depth;
                          const isTargetCell = dIndex === targetCell.depth && 
                                              rIndex === targetCell.row && 
                                              cIndex === targetCell.col;
                          
                          return (
                            <div 
                              key={cIndex}
                              className={`
                                cube-cell
                                ${inBounds ? 'cube-cell-in-bounds' : 'cube-cell-out-of-bounds'}
                                ${hasValue ? 'cube-cell-has-value' : ''}
                                ${isTargetLayer ? 'cube-cell-target-layer' : ''}
                                ${isTargetCell ? 'cube-cell-target-cell' : ''}
                              `}
                              title={`[${dIndex}][${rIndex}][${cIndex}]: ${array[dIndex][rIndex][cIndex] || 'empty'}`}
                            >
                              {isTargetCell ? '❌' : (hasValue ? '●' : '○')}
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
              <div className="legend-color legend-target"></div>
              <span>Target Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-active"></div>
              <span>Active (Shifting)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-shifting"></div>
              <span>Cells to Shift</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-deleted"></div>
              <span>Deleted Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-out-of-bounds"></div>
              <span>Out of Bounds</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array3d-code-column">
          {/* C++ Code Card */}
          <div className="array3d-code-card">
            <div className="array3d-code-header">
              <div className="code-title">3D_array_delete.cpp</div>
              <div className="code-step">Step {currentStep >= 0 ? currentStep + 1 : 0}/9</div>
            </div>
            <div className="array3d-code-content">
              {array3DDeleteCode.map((lineObj, idx) => (
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

          {/* Deleted Value Display */}
          {deletedValue !== null && (
            <div className="deleted-value-card">
              <div className="deleted-value-header">
                <div className="deleted-title">Deleted Value</div>
                <div className="deleted-position">
                  [Depth {inputDepth}][Row {inputRow}][Col {inputCol}]
                </div>
              </div>
              <div className="deleted-value-content">
                <div className="deleted-value-large">{deletedValue}</div>
                <div className="deleted-value-stored">Stored in temporary variable</div>
                <div className="deleted-value-info">
                  Will be returned from function
                </div>
              </div>
            </div>
          )}

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
              <div className="status-title">Deletion Trace</div>
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
                    style={{ width: `${((currentStep + 1) / 9) * 100}%` }}
                  ></div>
                  <div className="status-progress-text">
                    Progress: {currentStep + 1} / 9 steps
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

export default A3D_Array_Delete;
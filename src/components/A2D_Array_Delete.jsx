import React, { useState, useEffect } from "react";
import "../styles/A2D_Array_Delete.css";

const MAX_ROWS = 4;
const MAX_COLS = 4;

const array2DDeleteCode = [
  { line: "int arr[4][4]; int rows = 3, cols = 3;", desc: "Initialize 2D array with current dimensions." },
  { line: "if (row < 0 || row >= rows || col < 0 || col >= cols)", desc: "Check if position is within bounds." },
  { line: "  return -1; // Invalid position", desc: "Error: position out of bounds." },
  { line: "int deleted = arr[row][col];", desc: "Store the value to be deleted." },
  { line: "for (int i = col; i < cols - 1; i++) {", desc: "Start shifting columns from deletion point." },
  { line: "  arr[row][i] = arr[row][i + 1];", desc: "Shift elements left in current row." },
  { line: "}", desc: "Row shifting complete." },
  { line: "arr[row][cols - 1] = NULL;", desc: "Clear the last element in row." },
  { line: "// Handle column compression if needed", desc: "Check if row becomes empty." },
  { line: "return deleted;", desc: "Return the deleted value." }
];

const A2D_Array_Delete = () => {
  // Initialize 2D array with some values
  const initialArray = [
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120],
    [null, null, null, null]
  ];
  
  const [array, setArray] = useState(initialArray);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [deletedValue, setDeletedValue] = useState(null);
  const [inputRow, setInputRow] = useState("");
  const [inputCol, setInputCol] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeCell, setActiveCell] = useState({ row: -1, col: -1 });
  const [targetCell, setTargetCell] = useState({ row: -1, col: -1 });
  const [status, setStatus] = useState("Enter row (0-2) and column (0-3) to delete.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [shiftingMode, setShiftingMode] = useState(""); // "row" or "compress"

  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => handleNextStep(), speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep, speed]);

  const startDelete = () => {
    const row = parseInt(inputRow);
    const col = parseInt(inputCol);
    
    if (isNaN(row) || isNaN(col) || 
        row < 0 || row >= rows || col < 0 || col >= cols) {
      setStatus("Invalid input! Row and column must be within current bounds.");
      return;
    }
    
    if (array[row][col] === null) {
      setStatus("Cannot delete from an empty cell!");
      return;
    }
    
    setIsProcessing(true);
    setCurrentStep(0);
    setTargetCell({ row, col });
    setDeletedValue(array[row][col]);
    setStatus(`Initializing deletion at position [${row}][${col}]. Value: ${array[row][col]}`);
  };

  const handleNextStep = () => {
    const row = parseInt(inputRow);
    const col = parseInt(inputCol);

    switch (currentStep) {
      case 0: // Initialization
        setCurrentStep(1);
        setStatus("Checking if position is within bounds...");
        break;
        
      case 1: // Bounds check
        setCurrentStep(2);
        setActiveCell({ row, col });
        setStatus(`Position valid. Storing value ${deletedValue} for return.`);
        break;
        
      case 2: // Store deleted value
        setCurrentStep(3);
        setActiveCell({ row, col });
        setShiftingMode("row");
        setStatus(`Starting row shift from column ${col} to ${cols-1}.`);
        break;
        
      case 3: // For loop start (columns)
        if (activeCell.col < cols - 1) {
          setCurrentStep(4);
          setStatus(`Shifting element at [${row}][${activeCell.col + 1}] to [${row}][${activeCell.col}].`);
        } else {
          setCurrentStep(6);
          setStatus("Row shifting complete. Clearing last element.");
        }
        break;
        
      case 4: // Actual shift operation
        const newArr = [...array.map(r => [...r])];
        newArr[row][activeCell.col] = array[row][activeCell.col + 1];
        newArr[row][activeCell.col + 1] = null;
        setArray(newArr);
        setCurrentStep(5);
        setStatus(`Moved ${array[row][activeCell.col + 1]} to position [${row}][${activeCell.col}].`);
        break;
        
      case 5: // Move to next column
        setActiveCell({ row, col: activeCell.col + 1 });
        setCurrentStep(3);
        setStatus("Moving to next column...");
        break;
        
      case 6: // Clear last element in row
        const clearedArr = [...array.map(r => [...r])];
        clearedArr[row][cols - 1] = null;
        setArray(clearedArr);
        setCurrentStep(7);
        setStatus(`Cleared last element at [${row}][${cols - 1}].`);
        break;
        
      case 7: // Check for column compression
        setCurrentStep(8);
        setShiftingMode("compress");
        setStatus("Checking if column compression is needed...");
        break;
        
      case 8: // Return deleted value
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setActiveCell({ row: -1, col: -1 });
        setStatus(`SUCCESS: Deleted value ${deletedValue} from position [${row}][${col}].`);
        break;
        
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setArray(initialArray);
    setRows(3);
    setCols(4);
    setDeletedValue(null);
    setInputRow("");
    setInputCol("");
    setCurrentStep(-1);
    setActiveCell({ row: -1, col: -1 });
    setTargetCell({ row: -1, col: -1 });
    setStatus("Enter row (0-2) and column (0-3) to delete.");
    setIsProcessing(false);
    setIsAutoPlay(false);
    setShiftingMode("");
  };

  const isCellActive = (row, col) => {
    return activeCell.row === row && activeCell.col === col;
  };

  const isCellTarget = (row, col) => {
    return targetCell.row === row && targetCell.col === col;
  };

  const isCellInBounds = (row, col) => {
    return row < rows && col < cols;
  };

  const isCellEmpty = (row, col) => {
    return array[row][col] === null;
  };

  return (
    <div className="array2d-delete-container">
      {/* Header Section */}
      <div className="array2d-delete-header">
        <div className="array2d-delete-inputs">
          <div className="input-group">
            <label htmlFor="delete-row">Row to Delete (0-{rows-1})</label>
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
            <label htmlFor="delete-col">Column to Delete (0-{cols-1})</label>
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
            className="array2d-delete-btn" 
            onClick={startDelete} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Delete from 2D Array"}
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
      <div className="array2d-delete-viz-body">
        {/* Left Column: 2D Array Visualization */}
        <div className="array2d-viz-column">
          <div className="array2d-viz-header">
            <h3>2D Array Memory Visualization</h3>
            <div className="array2d-size-indicator">
              Dimensions: <span className="size-value">{rows}</span> × <span className="size-value">{cols}</span>
              <span className="max-size"> (Max: {MAX_ROWS} × {MAX_COLS})</span>
            </div>
          </div>
          
          {/* Deleted Value Display */}
          {deletedValue !== null && (
            <div className="deleted-value-display">
              <div className="deleted-value-label">Deleted Value:</div>
              <div className="deleted-value-box">{deletedValue}</div>
              <div className="deleted-position">
                From: [{targetCell.row}][{targetCell.col}]
              </div>
            </div>
          )}
          
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
                    const isActive = isCellActive(rowIndex, colIndex);
                    const isTarget = isCellTarget(rowIndex, colIndex);
                    const inBounds = isCellInBounds(rowIndex, colIndex);
                    const isEmpty = isCellEmpty(rowIndex, colIndex);
                    
                    return (
                      <div 
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          array2d-cell
                          ${isActive ? "array2d-cell-active" : ""}
                          ${isTarget ? "array2d-cell-target" : ""}
                          ${!inBounds ? "array2d-cell-out-of-bounds" : ""}
                          ${isEmpty ? "array2d-cell-empty" : ""}
                          ${shiftingMode === "row" && rowIndex === activeCell.row ? "array2d-row-shifting" : ""}
                          ${shiftingMode === "compress" && colIndex >= targetCell.col && rowIndex === targetCell.row ? "array2d-compression-zone" : ""}
                        `}
                      >
                        <div className="array2d-cell-coords">
                          [{rowIndex}][{colIndex}]
                        </div>
                        <div className="array2d-cell-value">
                          {array[rowIndex][colIndex] !== null ? array[rowIndex][colIndex] : <span className="empty-symbol">∅</span>}
                        </div>
                        
                        {/* Cell indicators */}
                        {isActive && (
                          <div className="array2d-cell-indicator">
                            {currentStep >= 4 ? "Moving To" : "Active"}
                          </div>
                        )}
                        
                        {isTarget && !isActive && (
                          <div className="array2d-cell-target-indicator">
                            {currentStep >= 2 ? "Deleted" : "Target"}
                          </div>
                        )}
                        
                        {/* Shift direction indicator */}
                        {shiftingMode === "row" && rowIndex === targetCell.row && colIndex >= targetCell.col && colIndex < cols - 1 && (
                          <div className="shift-direction-indicator">←</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="array2d-viz-legend">
            <div className="legend-item">
              <div className="legend-color legend-target"></div>
              <span>Deletion Target</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-active"></div>
              <span>Active Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-row-shift"></div>
              <span>Row Shifting</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-compression"></div>
              <span>Compression Zone</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-out-of-bounds"></div>
              <span>Out of Bounds</span>
            </div>
          </div>
          
          {/* Current Operation Display */}
          <div className="array2d-operation-display">
            <div className="operation-title">Current Operation:</div>
            <div className="operation-details">
              {shiftingMode ? (
                <span className={`shifting-operation ${shiftingMode}`}>
                  {shiftingMode === "row" ? "Row Shifting (Left Shift)" : "Checking Compression"}
                </span>
              ) : (
                <span className="delete-operation">Ready for deletion</span>
              )}
            </div>
            {shiftingMode === "row" && (
              <div className="shift-direction-info">
                <span className="direction-arrow">←</span>
                <span>Elements shifting left</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array2d-code-column">
          {/* C++ Code Card */}
          <div className="array2d-code-card">
            <div className="array2d-code-header">
              <div className="code-title">2D_array_delete.cpp</div>
              <div className="code-step">Step {currentStep >= 0 ? currentStep + 1 : 0}/9</div>
            </div>
            <div className="array2d-code-content">
              {array2DDeleteCode.map((lineObj, idx) => (
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
              <div className="status-title">Execution Trace</div>
              <div className="status-step">
                {currentStep >= 0 ? `Step ${currentStep + 1}` : 'Ready'}
              </div>
            </div>
            <div className="array2d-status-content">
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

export default A2D_Array_Delete;
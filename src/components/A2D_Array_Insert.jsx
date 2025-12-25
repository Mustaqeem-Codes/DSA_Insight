import React, { useState, useEffect } from "react";
import "../styles/A2D_Array_Insert.css";

const MAX_ROWS = 4;
const MAX_COLS = 4;
const TOTAL_CELLS = MAX_ROWS * MAX_COLS;

const array2DInsertCode = [
  { line: "int arr[4][4]; int rows = 3, cols = 3;", desc: "Initialize 2D array with current dimensions." },
  { line: "if (row < 0 || row >= rows || col < 0 || col >= cols)", desc: "Check if position is within bounds." },
  { line: "  return -1; // Invalid position", desc: "Error: position out of bounds." },
  { line: "for (int i = rows - 1; i >= row; i--) {", desc: "Start shifting rows from bottom." },
  { line: "  for (int j = cols - 1; j >= col; j--) {", desc: "Shift columns from right to left." },
  { line: "    arr[i][j + 1] = arr[i][j];", desc: "Move element one column to the right." },
  { line: "  }", desc: "Inner loop complete for current row." },
  { line: "  // Handle row shifting if needed", desc: "Prepare for possible row shift." },
  { line: "}", desc: "All shifting operations complete." },
  { line: "arr[row][col] = value;", desc: "Insert new value at target position." },
  { line: "if (col == cols - 1) cols++;", desc: "Update column count if inserted at edge." }
];

const A2D_Array_Insert = () => {
  // Initialize 2D array with some values
  const initialArray = [
    [10, 20, 30, null],
    [40, 50, 60, null],
    [70, 80, 90, null],
    [null, null, null, null]
  ];
  
  const [array, setArray] = useState(initialArray);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [inputValue, setInputValue] = useState("");
  const [inputRow, setInputRow] = useState("");
  const [inputCol, setInputCol] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeCell, setActiveCell] = useState({ row: -1, col: -1 });
  const [targetCell, setTargetCell] = useState({ row: -1, col: -1 });
  const [status, setStatus] = useState("Enter row (0-2), column (0-2) and value to insert.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [shiftingMode, setShiftingMode] = useState(""); // "row" or "col"

  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => handleNextStep(), speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep, speed]);

  const startInsert = () => {
    const row = parseInt(inputRow);
    const col = parseInt(inputCol);
    const val = parseInt(inputValue);
    
    if (isNaN(row) || isNaN(col) || isNaN(val) || 
        row < 0 || row >= rows || col < 0 || col >= cols) {
      setStatus("Invalid input! Row and column must be within current bounds.");
      return;
    }
    
    if (rows >= MAX_ROWS && cols >= MAX_COLS) {
      setStatus("Error: 2D array is at maximum capacity!");
      return;
    }
    
    setIsProcessing(true);
    setCurrentStep(0);
    setTargetCell({ row, col });
    setStatus(`Initializing insertion of ${val} at position [${row}][${col}].`);
  };

  const handleNextStep = () => {
    const row = parseInt(inputRow);
    const col = parseInt(inputCol);
    const val = parseInt(inputValue);

    switch (currentStep) {
      case 0: // Initialization
        setCurrentStep(1);
        setStatus("Checking if position is within bounds...");
        break;
        
      case 1: // Bounds check
        setCurrentStep(2);
        setActiveCell({ row: rows - 1, col: cols - 1 });
        setStatus(`Starting from bottom-right corner [${rows-1}][${cols-1}].`);
        break;
        
      case 2: // Outer loop start (rows)
        if (activeCell.row >= row) {
          setCurrentStep(3);
          setShiftingMode("row");
          setStatus(`Processing row ${activeCell.row}. Starting from column ${cols-1}.`);
        } else {
          setCurrentStep(8);
          setStatus("Row shifting complete. Ready to insert value.");
        }
        break;
        
      case 3: // Inner loop start (columns)
        if (activeCell.col >= col) {
          setCurrentStep(4);
          setStatus(`Shifting element at [${activeCell.row}][${activeCell.col}].`);
        } else {
          setCurrentStep(6);
          setStatus(`Row ${activeCell.row} shifting complete. Moving to next row.`);
        }
        break;
        
      case 4: // Actual shift operation
        const newArr = [...array.map(row => [...row])];
        if (activeCell.col + 1 < MAX_COLS) {
          newArr[activeCell.row][activeCell.col + 1] = array[activeCell.row][activeCell.col];
          newArr[activeCell.row][activeCell.col] = null;
          setArray(newArr);
        }
        setCurrentStep(5);
        setStatus(`Moved element to [${activeCell.row}][${activeCell.col + 1}].`);
        break;
        
      case 5: // Move to next column
        setActiveCell({ ...activeCell, col: activeCell.col - 1 });
        setCurrentStep(3);
        setStatus("Moving to previous column...");
        break;
        
      case 6: // Move to next row
        setActiveCell({ row: activeCell.row - 1, col: cols - 1 });
        setCurrentStep(2);
        setStatus(`Moving to row ${activeCell.row - 1}...`);
        break;
        
      case 7: // Row boundary handling
        setCurrentStep(8);
        setStatus("Row boundary handling complete.");
        break;
        
      case 8: // Insert value
        const finalArr = [...array.map(row => [...row])];
        finalArr[row][col] = val;
        setArray(finalArr);
        setActiveCell({ row, col });
        setCurrentStep(9);
        setStatus(`Inserted ${val} at position [${row}][${col}].`);
        break;
        
      case 9: // Update column count if needed
        if (col === cols - 1 && cols < MAX_COLS) {
          setCols(cols + 1);
          setStatus(`Column count increased to ${cols + 1}.`);
        }
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setStatus(`SUCCESS: Value inserted! Array dimensions: ${rows} × ${cols}`);
        break;
        
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setArray(initialArray);
    setRows(3);
    setCols(3);
    setInputValue("");
    setInputRow("");
    setInputCol("");
    setCurrentStep(-1);
    setActiveCell({ row: -1, col: -1 });
    setTargetCell({ row: -1, col: -1 });
    setStatus("Enter row (0-2), column (0-2) and value to insert.");
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

  return (
    <div className="array2d-insert-container">
      {/* Header Section */}
      <div className="array2d-insert-header">
        <div className="array2d-insert-inputs">
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
            className="array2d-insert-btn" 
            onClick={startInsert} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Insert in 2D Array"}
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
      <div className="array2d-insert-viz-body">
        {/* Left Column: 2D Array Visualization */}
        <div className="array2d-viz-column">
          <div className="array2d-viz-header">
            <h3>2D Array Memory Visualization</h3>
            <div className="array2d-size-indicator">
              Dimensions: <span className="size-value">{rows}</span> × <span className="size-value">{cols}</span>
              <span className="max-size"> (Max: {MAX_ROWS} × {MAX_COLS})</span>
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
                    const isActive = isCellActive(rowIndex, colIndex);
                    const isTarget = isCellTarget(rowIndex, colIndex);
                    const inBounds = isCellInBounds(rowIndex, colIndex);
                    const isEmpty = array[rowIndex][colIndex] === null;
                    
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
                          ${shiftingMode === "col" && colIndex === activeCell.col ? "array2d-col-shifting" : ""}
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
                            {currentStep >= 4 && currentStep <= 5 ? "Moving" : "Active"}
                          </div>
                        )}
                        
                        {isTarget && !isActive && (
                          <div className="array2d-cell-target-indicator">
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
          
          {/* Legend */}
          <div className="array2d-viz-legend">
            <div className="legend-item">
              <div className="legend-color legend-active"></div>
              <span>Active Cell</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-target"></div>
              <span>Target Position</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-row-shift"></div>
              <span>Row Shifting</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-col-shift"></div>
              <span>Column Shifting</span>
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
                <span className="shifting-operation">
                  {shiftingMode === "row" ? "Row Shifting" : "Column Shifting"} in progress
                </span>
              ) : (
                <span className="insert-operation">Ready for insertion</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array2d-code-column">
          {/* C++ Code Card */}
          <div className="array2d-code-card">
            <div className="array2d-code-header">
              <div className="code-title">2D_array_insert.cpp</div>
              <div className="code-step">Step {currentStep >= 0 ? currentStep + 1 : 0}/10</div>
            </div>
            <div className="array2d-code-content">
              {array2DInsertCode.map((lineObj, idx) => (
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
                    style={{ width: `${((currentStep + 1) / 10) * 100}%` }}
                  ></div>
                  <div className="status-progress-text">
                    Progress: {currentStep + 1} / 10 steps
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

export default A2D_Array_Insert;
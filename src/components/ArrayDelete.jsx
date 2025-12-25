import React, { useState, useEffect } from "react";
import "../styles/ArrayDelete.css"; // Separate CSS file for this component

const MAX_SIZE = 10;

const arrayDeleteCode = [
  { line: "int target = arr[idx];", desc: "Access value to be deleted." },
  { line: "for (int i = idx; i < size - 1; i++) {", desc: "Start shifting from the gap." },
  { line: "  arr[i] = arr[i + 1];", desc: "Move next element to the left." },
  { line: "}", desc: "Shift complete." },
  { line: "arr[size - 1] = NULL;", desc: "Clear the last duplicate slot." },
  { line: "size--;", desc: "Update logical size." }
];

const ArrayDelete = () => {
  const [array, setArray] = useState([10, 20, 30, 40, 50, 60, 70, null, null, null]);
  const [logicalSize, setLogicalSize] = useState(7);
  const [deleteIdx, setDeleteIdx] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(null);
  const [status, setStatus] = useState("Enter index (0-6) to delete an element.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => handleNextStep(), speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep, speed]);

  const startDelete = () => {
    const idx = parseInt(deleteIdx);
    if (isNaN(idx) || idx < 0 || idx >= logicalSize) {
      setStatus("Error: Index out of bounds!");
      return;
    }
    setIsProcessing(true);
    setCurrentStep(0);
    setActiveIdx(idx);
    setStatus(`Targeting index ${idx} for deletion.`);
  };

  const handleNextStep = () => {
    const idx = parseInt(deleteIdx);

    switch (currentStep) {
      case 0: // Access target
        setCurrentStep(1);
        setStatus(`Preparing to fill the gap at index ${idx}.`);
        break;
      case 1: // For loop start
        if (activeIdx < logicalSize - 1) {
          setCurrentStep(2);
          setStatus(`Shifting ${array[activeIdx + 1]} from index ${activeIdx + 1} to ${activeIdx}.`);
        } else {
          setCurrentStep(4);
          setStatus("All elements shifted left.");
        }
        break;
      case 2: // Actual Shift Left
        const newArr = [...array];
        newArr[activeIdx] = array[activeIdx + 1];
        setArray(newArr);
        setCurrentStep(3);
        setStatus(`Moved value to index ${activeIdx}.`);
        break;
      case 3: // Increment i
        setActiveIdx(activeIdx + 1);
        setCurrentStep(1);
        setStatus("Moving to next element...");
        break;
      case 4: // Clear last slot
        const finalArr = [...array];
        finalArr[logicalSize - 1] = null;
        setArray(finalArr);
        setCurrentStep(5);
        setActiveIdx(null);
        setStatus("Clearing the redundant last slot.");
        break;
      case 5: // Update size
        setLogicalSize(logicalSize - 1);
        setIsProcessing(false);
        setIsAutoPlay(false);
        setStatus(`SUCCESS: Array size reduced to ${logicalSize - 1}.`);
        break;
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setArray([10, 20, 30, 40, 50, 60, 70, null, null, null]);
    setLogicalSize(7);
    setDeleteIdx("");
    setCurrentStep(-1);
    setActiveIdx(null);
    setStatus("Enter index (0-6) to delete an element.");
    setIsProcessing(false);
    setIsAutoPlay(false);
  };

  return (
    <div className="array-delete-container">
      {/* Header Section with Controls */}
      <div className="array-delete-header">
        <div className="array-delete-inputs">
          <div className="input-group">
            <label htmlFor="delete-index">Index to Delete (0-{logicalSize - 1})</label>
            <input 
              id="delete-index"
              type="number" 
              value={deleteIdx} 
              onChange={(e) => setDeleteIdx(e.target.value)} 
              placeholder="e.g. 2" 
              disabled={isProcessing}
              min="0"
              max={logicalSize - 1}
            />
          </div>
          <button 
            className="array-delete-btn" 
            onClick={startDelete} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Delete Element"}
          </button>
        </div>

        <div className="array-speed-control">
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
      <div className="array-delete-viz-body">
        {/* Left Column: Array Visualization */}
        <div className="array-viz-column">
          <div className="array-viz-header">
            <h3>Array Memory Visualization</h3>
            <div className="array-size-indicator">
              Logical Size: <span className="size-value">{logicalSize}</span> / {MAX_SIZE}
            </div>
          </div>
          
          <div className="array-memory-row">
            {array.map((val, i) => (
              <div 
                key={i} 
                className={`
                  array-memory-cell
                  ${activeIdx === i ? "array-cell-active" : ""}
                  ${val === null ? "array-cell-empty" : ""}
                  ${i >= logicalSize ? "array-cell-unused" : ""}
                `}
              >
                <div className="array-cell-address">[{i}]</div>
                <div className="array-cell-data">
                  {val !== null ? val : <span className="empty-symbol">∅</span>}
                </div>
                {i === activeIdx && (
                  <div className="array-cell-indicator">
                    Deleting
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="array-viz-legend">
            <div className="legend-item">
              <div className="legend-color legend-active"></div>
              <span>Active (Deleting)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-empty"></div>
              <span>Empty Slot</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-unused"></div>
              <span>Unallocated</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-occupied"></div>
              <span>Occupied</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array-code-column">
          {/* C++ Code Card */}
          <div className="array-code-card">
            <div className="array-code-header">
              <div className="code-title">array_delete.cpp</div>
              <div className="code-step">Step {currentStep >= 0 ? currentStep + 1 : 0}/6</div>
            </div>
            <div className="array-code-content">
              {arrayDeleteCode.map((lineObj, idx) => (
                <div 
                  key={idx} 
                  className={`
                    array-code-line
                    ${currentStep === idx ? "array-code-line-active" : ""}
                  `}
                >
                  <div className="code-line-number">{idx + 1}</div>
                  <code className="code-text">{lineObj.line}</code>
                  {currentStep === idx && (
                    <div className="code-line-desc">{lineObj.desc}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="array-control-buttons">
            <button 
              className={`array-control-btn ${isAutoPlay ? 'array-control-btn-active' : 'array-control-btn-play'}`}
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
              className="array-control-btn array-control-btn-next"
              onClick={handleNextStep}
              disabled={!isProcessing || isAutoPlay}
            >
              <span className="btn-icon">⏭</span>
              Next Step
            </button>
            
            <button 
              className="array-control-btn array-control-btn-reset"
              onClick={resetVisualization}
            >
              <span className="btn-icon">🔄</span>
              Reset All
            </button>
          </div>

          {/* Status/Description Card */}
          <div className="array-status-card">
            <div className="array-status-header">
              <div className="status-title">Execution Trace</div>
              <div className="status-step">Step {currentStep + 1}</div>
            </div>
            <div className="array-status-content">
              <p className="status-message">{status}</p>
              {isProcessing && (
                <div className="status-progress">
                  <div 
                    className="status-progress-bar"
                    style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayDelete;
import React, { useState, useEffect } from "react";
import "../styles/ArrayStyles.css"; // Separate CSS file for this component

const MAX_SIZE = 10;

const arrayInsertCode = [
  { line: "int arr[10]; int size = 6;", desc: "Initialize fixed array and logical size." },
  { line: "if (size >= MAX) return;", desc: "Check for Overflow." },
  { line: "for (int i = size - 1; i >= idx; i--) {", desc: "Start shifting from the end." },
  { line: "  arr[i + 1] = arr[i];", desc: "Move element to the right." },
  { line: "}", desc: "Shift complete." },
  { line: "arr[idx] = newValue;", desc: "Insert the new value." },
  { line: "size++;", desc: "Update logical size." }
];

const ArrayInsert = () => {
  const [array, setArray] = useState([10, 20, 30, 40, 50, null, null, null, null, null]);
  const [logicalSize, setLogicalSize] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [insertIdx, setInsertIdx] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(null);
  const [status, setStatus] = useState("Enter index (0-4) and value to insert.");
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

  const startInsert = () => {
    const idx = parseInt(insertIdx);
    const val = parseInt(inputValue);
    if (isNaN(idx) || isNaN(val) || idx < 0 || idx > logicalSize || logicalSize >= MAX_SIZE) {
      setStatus("Invalid index or array full!");
      return;
    }
    setIsProcessing(true);
    setCurrentStep(0);
    setStatus(`Initializing insertion of ${val} at index ${idx}.`);
  };

  const handleNextStep = () => {
    const idx = parseInt(insertIdx);
    const val = parseInt(inputValue);

    switch (currentStep) {
      case 0: // Initialization
        setCurrentStep(1);
        setStatus("Checking if array has space (Overflow check)...");
        break;
      case 1: // Overflow check
        setCurrentStep(2);
        setActiveIdx(logicalSize - 1);
        setStatus(`Starting loop. We need to shift elements from index ${logicalSize - 1} down to ${idx}.`);
        break;
      case 2: // For loop start
        if (activeIdx >= idx) {
          setCurrentStep(3);
          setStatus(`Shifting value ${array[activeIdx]} from index ${activeIdx} to ${activeIdx + 1}.`);
        } else {
          setCurrentStep(5);
          setStatus("Shifting complete. Gap created.");
        }
        break;
      case 3: // Actual Shift
        const newArr = [...array];
        newArr[activeIdx + 1] = array[activeIdx];
        setArray(newArr);
        setCurrentStep(4);
        setStatus(`Moved ${array[activeIdx]} to index ${activeIdx + 1}.`);
        break;
      case 4: // Decrement i
        setActiveIdx(activeIdx - 1);
        setCurrentStep(2);
        setStatus("Moving to the next element to shift...");
        break;
      case 5: // Insert New Value
        const finalArr = [...array];
        finalArr[idx] = val;
        setArray(finalArr);
        setCurrentStep(6);
        setActiveIdx(idx);
        setStatus(`Inserted ${val} into index ${idx}.`);
        break;
      case 6: // Update Size
        setLogicalSize(logicalSize + 1);
        setIsProcessing(false);
        setIsAutoPlay(false);
        setStatus(`SUCCESS: Array size is now ${logicalSize + 1}.`);
        break;
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setArray([10, 20, 30, 40, 50, null, null, null, null, null]);
    setLogicalSize(5);
    setInputValue("");
    setInsertIdx("");
    setCurrentStep(-1);
    setActiveIdx(null);
    setStatus("Enter index (0-4) and value to insert.");
    setIsProcessing(false);
    setIsAutoPlay(false);
  };

  return (
    <div className="array-insert-container">
      {/* Header Section with Controls */}
      <div className="array-insert-header">
        <div className="array-insert-inputs">
          <div className="input-group">
            <label htmlFor="insert-index">Index (0-{logicalSize})</label>
            <input 
              id="insert-index"
              type="number" 
              value={insertIdx} 
              onChange={(e) => setInsertIdx(e.target.value)} 
              placeholder="e.g. 2" 
              disabled={isProcessing}
              min="0"
              max={logicalSize}
            />
          </div>
          <div className="input-group">
            <label htmlFor="insert-value">Value to Insert</label>
            <input 
              id="insert-value"
              type="number" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="e.g. 25" 
              disabled={isProcessing}
            />
          </div>
          <button 
            className="array-insert-btn" 
            onClick={startInsert} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Insert"}
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
      <div className="array-insert-viz-body">
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
                    {currentStep >= 3 && currentStep <= 4 ? "Moving" : "Target"}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="array-viz-legend">
            <div className="legend-item">
              <div className="legend-color legend-active"></div>
              <span>Active Cell</span>
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
              <div className="code-title">array_insert.cpp</div>
              <div className="code-step">Step {currentStep >= 0 ? currentStep + 1 : 0}/7</div>
            </div>
            <div className="array-code-content">
              {arrayInsertCode.map((lineObj, idx) => (
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
                    style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
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

export default ArrayInsert;
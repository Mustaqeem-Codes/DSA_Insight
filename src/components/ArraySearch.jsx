import React, { useState, useEffect } from "react";
import "../styles/ArraySearch.css"; // Separate CSS file for this component

const arraySearchCode = [
  { line: "int search(int arr[], int n, int key) {", desc: "Function entry." },
  { line: "  for (int i = 0; i < n; i++) {", desc: "Start scanning from index 0." },
  { line: "    if (arr[i] == key)", desc: "Compare current element with key." },
  { line: "      return i;", desc: "Match found! Return the index." },
  { line: "  }", desc: "Continue to next iteration." },
  { line: "  return -1;", desc: "Loop finished, key not found." },
  { line: "}", desc: "" }
];

const ArraySearch = () => {
  const [array] = useState([45, 12, 89, 7, 23, 56, 31, 90, null, null]);
  const [logicalSize] = useState(8);
  const [searchKey, setSearchKey] = useState("");
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(null);
  const [foundIdx, setFoundIdx] = useState(null);
  const [status, setStatus] = useState("Enter a value to search in the array.");
  
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

  const startSearch = () => {
    const key = parseInt(searchKey);
    if (isNaN(key)) {
      setStatus("Please enter a valid number to search.");
      return;
    }
    setIsProcessing(true);
    setCurrentStep(1); // Start at the for loop
    setActiveIdx(0);
    setFoundIdx(null);
    setStatus(`Starting Linear Search for ${key}...`);
  };

  const handleNextStep = () => {
    const key = parseInt(searchKey);

    switch (currentStep) {
      case 0: // Function entry
        setCurrentStep(1);
        setStatus(`Search function called with key = ${key}`);
        break;
      case 1: // For loop check
        if (activeIdx < logicalSize) {
          setCurrentStep(2);
          setStatus(`Checking index ${activeIdx}: Is ${array[activeIdx]} == ${key}?`);
        } else {
          setCurrentStep(5);
          setStatus(`Key ${key} not found in the array.`);
        }
        break;
      case 2: // If condition
        if (array[activeIdx] === key) {
          setCurrentStep(3);
          setFoundIdx(activeIdx);
          setStatus(`MATCH FOUND! ${key} is at index ${activeIdx}.`);
        } else {
          setCurrentStep(4);
          setStatus(`${array[activeIdx]} does not match. Moving on...`);
        }
        break;
      case 3: // Return Success
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        break;
      case 4: // Increment i
        setActiveIdx(activeIdx + 1);
        setCurrentStep(1);
        break;
      case 5: // Return -1
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(6);
        setActiveIdx(null);
        setStatus(`Search complete. Key ${key} not found (returning -1).`);
        break;
      default:
        break;
    }
  };

  const resetVisualization = () => {
    setSearchKey("");
    setCurrentStep(-1);
    setActiveIdx(null);
    setFoundIdx(null);
    setStatus("Enter a value to search in the array.");
    setIsProcessing(false);
    setIsAutoPlay(false);
  };

  return (
    <div className="array-search-container">
      {/* Header Section with Controls */}
      <div className="array-search-header">
        <div className="array-search-inputs">
          <div className="input-group">
            <label htmlFor="search-key">Search Value</label>
            <input 
              id="search-key"
              type="number" 
              value={searchKey} 
              onChange={(e) => setSearchKey(e.target.value)} 
              placeholder="e.g. 23" 
              disabled={isProcessing}
            />
          </div>
          <button 
            className="array-search-btn" 
            onClick={startSearch} 
            disabled={isProcessing}
          >
            {isProcessing ? "Searching..." : "Start Search"}
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
      <div className="array-search-viz-body">
        {/* Left Column: Array Visualization */}
        <div className="array-viz-column">
          <div className="array-viz-header">
            <h3>Array Memory Visualization</h3>
            <div className="array-size-indicator">
              Array Size: <span className="size-value">{logicalSize}</span> elements
            </div>
          </div>
          
          <div className="array-memory-row">
            {array.map((val, i) => (
              <div 
                key={i} 
                className={`
                  array-memory-cell
                  ${activeIdx === i ? "array-cell-active" : ""}
                  ${foundIdx === i ? "array-cell-found" : ""}
                  ${val === null ? "array-cell-empty" : ""}
                  ${i >= logicalSize ? "array-cell-unused" : ""}
                `}
              >
                <div className="array-cell-address">[{i}]</div>
                <div className="array-cell-data">
                  {val !== null ? val : <span className="empty-symbol">∅</span>}
                </div>
                {activeIdx === i && (
                  <div className="array-cell-indicator">
                    Checking
                  </div>
                )}
                {foundIdx === i && (
                  <div className="array-cell-found-indicator">
                    Found!
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="array-viz-legend">
            <div className="legend-item">
              <div className="legend-color legend-active"></div>
              <span>Currently Checking</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-found"></div>
              <span>Match Found</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-empty"></div>
              <span>Empty Slot</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-occupied"></div>
              <span>Array Element</span>
            </div>
          </div>
          
          {/* Search Result Display */}
          <div className="search-result-display">
            {foundIdx !== null ? (
              <div className="search-result-success">
                <span className="result-icon">🎯</span>
                <div className="result-text">
                  <h4>Match Found!</h4>
                  <p>Value <strong>{searchKey}</strong> found at index <strong>{foundIdx}</strong></p>
                </div>
              </div>
            ) : currentStep === 6 ? (
              <div className="search-result-failure">
                <span className="result-icon">❌</span>
                <div className="result-text">
                  <h4>Not Found</h4>
                  <p>Value <strong>{searchKey}</strong> is not in the array</p>
                </div>
              </div>
            ) : (
              <div className="search-result-pending">
                <span className="result-icon">🔍</span>
                <div className="result-text">
                  <h4>Search in Progress</h4>
                  <p>Enter a value and start search</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code and Controls */}
        <div className="array-code-column">
          {/* C++ Code Card */}
          <div className="array-code-card">
            <div className="array-code-header">
              <div className="code-title">linear_search.cpp</div>
              <div className="code-step">Step {currentStep >= 1 ? currentStep : 0}/6</div>
            </div>
            <div className="array-code-content">
              {arraySearchCode.map((lineObj, idx) => (
                <div 
                  key={idx} 
                  className={`
                    array-code-line
                    ${currentStep === idx ? "array-code-line-active" : ""}
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
              <div className="status-title">Search Trace</div>
              <div className="status-step">
                {activeIdx !== null ? `Index: ${activeIdx}` : 'Ready'}
              </div>
            </div>
            <div className="array-status-content">
              <p className="status-message">{status}</p>
              {isProcessing && (
                <div className="status-progress">
                  <div 
                    className="status-progress-bar"
                    style={{ 
                      width: activeIdx < logicalSize 
                        ? `${((activeIdx + 1) / logicalSize) * 100}%` 
                        : '100%' 
                    }}
                  ></div>
                  <div className="status-progress-text">
                    Progress: {activeIdx + 1} / {logicalSize} elements checked
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

export default ArraySearch;
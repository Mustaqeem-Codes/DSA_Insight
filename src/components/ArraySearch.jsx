import React, { useState, useEffect } from "react";
import "../styles/ArrayStyles.css"; 

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
  }, [isAutoPlay, isProcessing, currentStep]);

  const startSearch = () => {
    if (!searchKey) return;
    setIsProcessing(true);
    setCurrentStep(1); // Start at the for loop
    setActiveIdx(0);
    setFoundIdx(null);
    setStatus(`Starting Linear Search for ${searchKey}...`);
  };

  const handleNextStep = () => {
    const key = parseInt(searchKey);

    switch (currentStep) {
      case 1: // For loop check
        if (activeIdx < logicalSize) {
          setCurrentStep(2);
          setStatus(`Checking index ${activeIdx}: Is ${array[activeIdx]} == ${key}?`);
        } else {
          setCurrentStep(5);
          setStatus(`Key ${key} not found in the array.`);
          setIsProcessing(false);
          setIsAutoPlay(false);
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
        break;

      case 4: // Increment i
        setActiveIdx(activeIdx + 1);
        setCurrentStep(1);
        break;

      case 5: // Return -1
        setActiveIdx(null);
        setIsProcessing(false);
        setIsAutoPlay(false);
        break;

      default:
        break;
    }
  };

  return (
    <div className="linear-hashing-wrapper">
      <div className="viz-header">
        <div className="input-box">
          <input type="number" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} placeholder="Search Value" disabled={isProcessing} />
          <button className="btn-insert" onClick={startSearch} disabled={isProcessing}>Search</button>
        </div>
        <div className="speed-control">
          <span>Slow</span>
          <input type="range" min="200" max="2000" step="100" value={2200 - speed} onChange={(e) => setSpeed(2200 - Number(e.target.value))} />
          <span>Fast</span>
        </div>
      </div>

      <div className="viz-body">
        <div className="table-column">
          <div className="memory-row">
            {array.map((val, i) => (
              <div 
                key={i} 
                className={`memory-cell 
                  ${activeIdx === i ? "cell-moving" : ""} 
                  ${foundIdx === i ? "cell-target" : ""} 
                  ${val === null ? "cell-empty" : ""}`}
              >
                <div className="cell-address">[{i}]</div>
                <div className="cell-data">{val !== null ? val : "null"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">linear_search.cpp</div>
            <div className="cpp-content">
              {arraySearchCode.map((lineObj, idx) => (
                <div key={idx} className={`cpp-line ${currentStep === idx ? "cpp-active" : ""}`}>
                  <code>{lineObj.line}</code>
                </div>
              ))}
            </div>
          </div>
          <div className="viz-controls">
            <button className={`ctrl-btn ${isAutoPlay ? 'active' : ''}`} onClick={() => setIsAutoPlay(!isAutoPlay)} disabled={!isProcessing}>
              {isAutoPlay ? "⏸ Pause" : "▶ Auto Play"}
            </button>
            <button className="ctrl-btn next" onClick={handleNextStep} disabled={!isProcessing || isAutoPlay}>Next Step ⏭</button>
            <button className="ctrl-btn stop" onClick={() => window.location.reload()}>🔄 Reset</button>
          </div>
          <div className="description-card">
            <div className="desc-header">Search Trace</div>
            <div className="desc-content"><p>{status}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArraySearch;
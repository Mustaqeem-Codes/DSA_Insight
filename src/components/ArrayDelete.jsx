import React, { useState, useEffect } from "react";
import "../styles/ArrayStyles.css"; // Using the new Memory Block styles

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
  }, [isAutoPlay, isProcessing, currentStep]);

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

  return (
    <div className="linear-hashing-wrapper">
      <div className="viz-header">
        <div className="input-box">
          <input type="number" value={deleteIdx} onChange={(e) => setDeleteIdx(e.target.value)} placeholder="Index to Delete" disabled={isProcessing} />
          <button className="btn-insert" style={{backgroundColor: '#ef4444'}} onClick={startDelete} disabled={isProcessing}>Delete</button>
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
              <div key={i} className={`memory-cell ${activeIdx === i ? "cell-moving" : ""} ${val === null ? "cell-empty" : ""}`}>
                <div className="cell-address">[{i}]</div>
                <div className="cell-data">{val !== null ? val : "null"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">array_delete.cpp</div>
            <div className="cpp-content">
              {arrayDeleteCode.map((lineObj, idx) => (
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
            <div className="desc-header">Execution Trace</div>
            <div className="desc-content"><p>{status}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayDelete;
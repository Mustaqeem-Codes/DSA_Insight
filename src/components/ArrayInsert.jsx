import React, { useState, useEffect } from "react";
import "../styles/ArrayStyles.css"; // Reusing your project's base styles

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
  }, [isAutoPlay, isProcessing, currentStep]);

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

  return (
    <div className="linear-hashing-wrapper">
      <div className="viz-header">
        <div className="input-box">
          <input type="number" value={insertIdx} onChange={(e) => setInsertIdx(e.target.value)} placeholder="Index (e.g. 2)" disabled={isProcessing} />
          <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Value" disabled={isProcessing} />
          <button className="btn-insert" onClick={startInsert} disabled={isProcessing}>Insert</button>
        </div>
        <div className="speed-control">
          <span>Slow</span>
          <input type="range" min="200" max="2000" step="100" value={2200 - speed} onChange={(e) => setSpeed(2200 - Number(e.target.value))} />
          <span>Fast</span>
        </div>
      </div>

      <div className="viz-body">
        <div className="table-column">
          <div className="array-horizontal">
            {array.map((val, i) => (
              <div key={i} className={`array-slot-box ${activeIdx === i ? "active-slot" : ""} ${val === null ? "empty-slot" : ""}`}>
                <span className="slot-idx">{i}</span>
                <span className="slot-val">{val !== null ? val : ""}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">array_insert.cpp</div>
            <div className="cpp-content">
              {arrayInsertCode.map((lineObj, idx) => (
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

export default ArrayInsert;
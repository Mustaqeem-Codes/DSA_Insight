import React, { useState, useEffect } from "react";
import "../styles/LinearHashing.css"; // Reusing the shared CSS

const TABLE_SIZE = 7;
const TOMBSTONE = "DEL"; // Visual representation of a deleted marker

const deleteCppCode = [
  { line: "int hash = key % size;", desc: "Calculate start index." },
  {
    line: "while (table[hash] != EMPTY) {",
    desc: "Search until empty slot hit.",
  },
  {
    line: "  if (table[hash] == key) {",
    desc: "Check if current slot matches key.",
  },
  { line: "    table[hash] = DELETED;", desc: "Mark as DELETED (Tombstone)." },
  { line: "    return SUCCESS;", desc: "Deletion complete." },
  { line: "  }", desc: "" },
  { line: "  hash = (hash + 1) % size;", desc: "Probing to next slot." },
  { line: "}" },
];

const LinearDelete = () => {
  // Initial state with some collisions to make deletion interesting
  const [table, setTable] = useState([7, 14, 21, 5, null, 12, null]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [status, setStatus] = useState("Enter key to delete.");

  const [activeKey, setActiveKey] = useState(null);
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
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setActiveKey(key);
    setIsProcessing(true);
    setCurrentStep(0);
    setProbingIndex(key % TABLE_SIZE);
    setStatus(`Step 1: Starting deletion search at index ${key % TABLE_SIZE}.`);
  };

  const handleNextStep = () => {
    let h = probingIndex;

    switch (currentStep) {
      case 0: // Calculate hash
        setCurrentStep(1);
        setStatus(`Checking if index ${h} is EMPTY...`);
        break;
      case 1: // Loop condition
        if (table[h] === null) {
          setStatus(`Index ${h} is EMPTY. Key ${activeKey} not found.`);
          setIsProcessing(false);
          setIsAutoPlay(false);
        } else {
          setCurrentStep(2);
          setStatus(`Slot ${h} contains ${table[h]}. Checking match...`);
        }
        break;
      case 2: // Match check
        if (table[h] === activeKey) {
          setCurrentStep(3);
          setStatus(`Match found! Preparing to mark index ${h} as DELETED.`);
        } else {
          setCurrentStep(6);
          setStatus(`Not a match. Probing further...`);
        }
        break;
      case 3: // Marking as deleted
        setCurrentStep(4);
        const newTable = [...table];
        newTable[h] = TOMBSTONE;
        setTable(newTable);
        setStatus(`Index ${h} is now marked as ${TOMBSTONE}.`);
        break;
      case 4: // Success
        setIsProcessing(false);
        setIsAutoPlay(false);
        setStatus(`SUCCESS: Key ${activeKey} removed.`);
        break;
      case 6: // Probing
        const nextH = (h + 1) % TABLE_SIZE;
        setProbingIndex(nextH);
        setCurrentStep(1);
        setStatus(`Moving to index ${nextH}...`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="linear-hashing-wrapper">
      <div className="viz-header">
        <div className="input-box">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            placeholder="Key to Delete"
          />
          <button
            className="btn-insert"
            style={{ backgroundColor: "#ef4444" }}
            onClick={startDelete}
            disabled={isProcessing}
          >
            Delete Key
          </button>
        </div>

        <div className="speed-control">
          <span>Fast</span>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={2200 - speed}
            onChange={(e) => setSpeed(2200 - Number(e.target.value))}
          />
          <span>Slow</span>
        </div>
      </div>

      <div className="viz-body">
        <div className="table-column">
          <div className="hash-array">
            {table.map((val, i) => (
              <div
                key={i}
                className={`hash-slot ${
                  probingIndex === i
                    ? table[i] === activeKey
                      ? "slot-green"
                      : "slot-red"
                    : ""
                }`}
              >
                <span className="slot-idx">{i}</span>
                <span
                  className={`slot-val ${val === TOMBSTONE ? "tombstone" : ""}`}
                >
                  {val !== null ? val : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">linear_delete.cpp</div>
            <div className="cpp-content">
              {deleteCppCode.map((lineObj, idx) => (
                <div
                  key={idx}
                  className={`cpp-line ${
                    currentStep === idx ? "cpp-active" : ""
                  }`}
                >
                  <code>{lineObj.line}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="viz-controls">
            <button
              className={`ctrl-btn ${isAutoPlay ? "active" : ""}`}
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              disabled={!isProcessing}
            >
              {isAutoPlay ? "⏸ Pause" : "▶ Auto Play"}
            </button>
            <button
              className="ctrl-btn next"
              onClick={handleNextStep}
              disabled={!isProcessing || isAutoPlay}
            >
              Next Step ⏭
            </button>
            <button
              className="ctrl-btn stop"
              onClick={() => window.location.reload()}
            >
              🔄 Reset
            </button>
          </div>

          <div className="description-card">
            <div className="desc-header">Execution Trace</div>
            <div className="desc-content">
              <p>{status}</p>
              {currentStep !== -1 && <small>Updating Table State...</small>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearDelete;

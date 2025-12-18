import React, { useState, useEffect } from "react";
import "../styles/LinearSearch.css"; // Reusing the same CSS for consistency

const TABLE_SIZE = 7;

const searchCppCode = [
  { line: "int hash = key % size;", desc: "Calculate the starting index." },
  {
    line: "while (table[hash] != EMPTY) {",
    desc: "Keep searching until we hit an empty slot.",
  },
  {
    line: "  if (table[hash] == key) return hash;",
    desc: "Key found! Return the current index.",
  },
  {
    line: "  hash = (hash + 1) % size;",
    desc: "Not found yet. Move to next linear slot.",
  },
  { line: "}", desc: "Hit an empty slot; key is not in the table." },
  { line: "return NOT_FOUND;", desc: "Search failed." },
];

const LinearSearch = () => {
  // Pre-filled some values to demonstrate searching through collisions
  const [table, setTable] = useState([7, 14, 21, null, 5, null, null]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [status, setStatus] = useState("Enter a key to search in the table.");

  const [activeKey, setActiveKey] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => {
        handleNextStep();
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep]);

  const startSearch = () => {
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setActiveKey(key);
    setIsProcessing(true);
    setCurrentStep(0);
    setProbingIndex(key % TABLE_SIZE);
    setStatus(`Step 1: Calculating start index for key ${key}.`);
  };

  const handleNextStep = () => {
    let h = probingIndex;

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Checking index ${h}...`);
        break;
      case 1:
        if (table[h] === null) {
          setCurrentStep(4);
          setStatus(`Index ${h} is EMPTY. Stopping search.`);
        } else {
          setCurrentStep(2);
          setStatus(`Comparing ${table[h]} with target ${activeKey}...`);
        }
        break;
      case 2:
        if (table[h] === activeKey) {
          setStatus(`MATCH FOUND! Key ${activeKey} is at index ${h}.`);
          setIsProcessing(false);
          setIsAutoPlay(false);
        } else {
          setCurrentStep(3);
          setStatus(`Not a match. Moving to next slot.`);
        }
        break;
      case 3:
        const nextH = (h + 1) % TABLE_SIZE;
        setProbingIndex(nextH);
        setCurrentStep(1);
        setStatus(`Incrementing to index ${nextH}...`);
        break;
      case 4:
        setCurrentStep(5);
        setStatus(`Key ${activeKey} was not found in the table.`);
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
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            placeholder="Search Key"
          />
          <button
            className="btn-insert"
            onClick={startSearch}
            disabled={isProcessing}
          >
            Start Search
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
                <span className="slot-val">{val !== null ? val : ""}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">linear_search.cpp</div>
            <div className="cpp-content">
              {searchCppCode.map((lineObj, idx) => (
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
              disabled={!isProcessing || isAutoPlay || currentStep === -1}
            >
              Next Step ⏭
            </button>
            <button
              className="ctrl-btn stop"
              onClick={() => {
                window.location.reload();
              }}
            >
              🔄 Reset
            </button>
          </div>

          <div className="description-card">
            <div className="desc-header">Execution Trace</div>
            <div className="desc-content">
              <p>{status}</p>
              {currentStep !== -1 && (
                <small>Executing Line {currentStep + 1}...</small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearSearch;

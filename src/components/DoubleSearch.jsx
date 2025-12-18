import React, { useState, useEffect } from "react";
import "../styles/LinearHashing.css";

const TABLE_SIZE = 7;
const h1 = (key) => key % TABLE_SIZE;
const h2 = (key) => 5 - (key % 5);

const doubleSearchCode = [
  { line: "int idx = h1(key);", desc: "Initial hash position." },
  {
    line: "int step = h2(key);",
    desc: "Calculate secondary hash (step size).",
  },
  {
    line: "while (table[(idx + i * step) % size] != EMPTY) {",
    desc: "Search until an empty slot is hit.",
  },
  {
    line: "  if (table[pos] == key) return pos;",
    desc: "Match found! Return index.",
  },
  { line: "  i++;", desc: "Increment probe counter to jump by step size." },
  { line: "}", desc: "Hit empty slot; key is not in the table." },
];

const DoubleSearch = () => {
  const [table, setTable] = useState([7, null, 14, 11, null, 5, null]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [probeCount, setProbeCount] = useState(0);
  const [status, setStatus] = useState("Enter key to search.");

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

  const startSearch = () => {
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setActiveKey(key);
    setIsProcessing(true);
    setCurrentStep(0);
    setProbeCount(0);
    setProbingIndex(h1(key));
    setStatus(`Searching for ${key}. h1: ${h1(key)}, h2: ${h2(key)}`);
  };

  const handleNextStep = () => {
    const stepSize = h2(activeKey);
    const baseIdx = h1(activeKey);
    const currentPos = (baseIdx + probeCount * stepSize) % TABLE_SIZE;

    switch (currentStep) {
      case 0:
        setCurrentStep(2); // Jump to loop
        setStatus(`Initial check at index ${currentPos}.`);
        break;
      case 2:
        if (table[currentPos] === null) {
          setStatus(`Index ${currentPos} is EMPTY. Key not found.`);
          setIsProcessing(false);
        } else if (table[currentPos] === activeKey) {
          setStatus(`MATCH FOUND at index ${currentPos}!`);
          setIsProcessing(false);
        } else {
          setCurrentStep(4);
          setStatus(
            `No match at ${currentPos}. Preparing to jump by ${stepSize}.`
          );
        }
        break;
      case 4:
        const nextI = probeCount + 1;
        setProbeCount(nextI);
        setProbingIndex((baseIdx + nextI * stepSize) % TABLE_SIZE);
        setCurrentStep(2);
        setStatus(
          `Probe i=${nextI}. Next index: ${
            (baseIdx + nextI * stepSize) % TABLE_SIZE
          }`
        );
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
            placeholder="Search Key"
          />
          <button
            className="btn-insert"
            onClick={startSearch}
            disabled={isProcessing}
          >
            Search
          </button>
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
                <span className="slot-val">{val ?? ""}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">double_search.cpp</div>
            <div className="cpp-content">
              {doubleSearchCode.map((lineObj, idx) => (
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
              className="ctrl-btn next"
              onClick={handleNextStep}
              disabled={!isProcessing}
            >
              Next Step ⏭
            </button>
          </div>
          <div className="description-card">
            <div className="desc-header">Double Search Trace</div>
            <div className="desc-content">
              <p>{status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleSearch;

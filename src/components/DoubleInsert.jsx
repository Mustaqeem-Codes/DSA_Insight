import React, { useState, useEffect } from "react";
import "../styles/LinearHashing.css";

const TABLE_SIZE = 7;
// h2(k) must never result in 0 and should be relatively prime to TABLE_SIZE
const h1 = (key) => key % TABLE_SIZE;
const h2 = (key) => 5 - (key % 5);

const doubleCppCode = [
  { line: "int idx = h1(key);", desc: "First hash: key % size" },
  { line: "int step = h2(key);", desc: "Second hash for jump size." },
  { line: "int i = 0;", desc: "Probe counter." },
  {
    line: "while (table[(idx + i * step) % size] != EMPTY) {",
    desc: "Collision? Jump by step size.",
  },
  { line: "  i++;", desc: "Increase jump multiplier." },
  { line: "}", desc: "" },
  {
    line: "table[(idx + i * step) % size] = key;",
    desc: "Insert into found slot.",
  },
];

const DoubleInsert = () => {
  const [table, setTable] = useState(Array(TABLE_SIZE).fill(null));
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [probeCount, setProbeCount] = useState(0);
  const [status, setStatus] = useState("Enter key for Double Hashing.");

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

  const startInsertion = () => {
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setActiveKey(key);
    setIsProcessing(true);
    setCurrentStep(0);
    setProbeCount(0);
    setProbingIndex(h1(key));
    setStatus(`Step 1: h1(${key}) = ${h1(key)}. Checking start index.`);
  };

  const handleNextStep = () => {
    const stepSize = h2(activeKey);
    const baseIdx = h1(activeKey);

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(
          `Step 2: Calculating jump size h2(${activeKey}) = ${stepSize}`
        );
        break;
      case 1:
        setCurrentStep(2);
        setStatus(`Step 3: Initializing probe i = 0.`);
        break;
      case 2:
        const currentPos = (baseIdx + probeCount * stepSize) % TABLE_SIZE;
        setProbingIndex(currentPos);
        if (table[currentPos] !== null) {
          setCurrentStep(4);
          setStatus(
            `Collision at ${currentPos}! Slot contains ${table[currentPos]}.`
          );
        } else {
          setCurrentStep(6);
          setStatus(`Slot ${currentPos} is EMPTY. Ready to insert.`);
        }
        break;
      case 4:
        const nextI = probeCount + 1;
        setProbeCount(nextI);
        setCurrentStep(2);
        setStatus(
          `Incrementing i to ${nextI}. New index = (${baseIdx} + ${nextI}*${stepSize}) % ${TABLE_SIZE}`
        );
        break;
      case 6:
        const finalTable = [...table];
        finalTable[probingIndex] = activeKey;
        setTable(finalTable);
        setStatus(`SUCCESS: Inserted ${activeKey} at index ${probingIndex}.`);
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
            placeholder="Enter Key"
          />
          <button
            className="btn-insert"
            onClick={startInsertion}
            disabled={isProcessing}
          >
            Insert
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
                    ? table[i] === null
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
            <div className="cpp-header">double_hashing.cpp</div>
            <div className="cpp-content">
              {doubleCppCode.map((lineObj, idx) => (
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
            <div className="desc-header">Double Hash Trace</div>
            <div className="desc-content">
              <p>{status}</p>
              {activeKey && (
                <small>
                  h1: {activeKey % TABLE_SIZE} | h2: {5 - (activeKey % 5)}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleInsert;

import React, { useState, useEffect } from "react";
import "../styles/LinearHashing.css";

const TABLE_SIZE = 7;
const h1 = (key) => key % TABLE_SIZE;
const h2 = (key) => 5 - (key % 5);

const doubleSearchCode = [
  { line: "int idx = h1(key);", desc: "Initial hash position." },
  { line: "int step = h2(key);", desc: "Calculate secondary hash (step size)." },
  { line: "int i = 0;", desc: "Initialize probe counter." },
  { line: "while (table[(idx + i * step) % size] != EMPTY) {", desc: "Search until empty slot hit." },
  { line: "  if (table[pos] == key) return pos;", desc: "Match found!" },
  { line: "  i++;", desc: "Increment probe counter." },
  { line: "}", desc: "Key not found." }
];

const DoubleSearch = () => {
  // Initial state with a collision example: 
  // 12 % 7 = 5. (But 5 is taken by 5). 
  // h2(12) = 5 - (12%5) = 3. 
  // Next probe: (5 + 1*3) % 7 = 1.
  const [table] = useState([7, 12, 14, null, 11, 5, null]);
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
      case 0: // int idx = h1(key)
        setCurrentStep(1);
        setStatus(`Initial index calculated: ${baseIdx}`);
        break;
      case 1: // int step = h2(key)
        setCurrentStep(2);
        setStatus(`Step size (jump) calculated: ${stepSize}`);
        break;
      case 2: // int i = 0
        setCurrentStep(3);
        setProbingIndex(currentPos);
        setStatus(`Checking while condition at index ${currentPos}...`);
        break;
      case 3: // while check
        if (table[currentPos] === null) {
          setStatus(`Index ${currentPos} is EMPTY. Search failed.`);
          setIsProcessing(false);
          setIsAutoPlay(false);
        } else {
          setCurrentStep(4);
          setStatus(`Slot ${currentPos} contains ${table[currentPos]}. Checking match...`);
        }
        break;
      case 4: // if match
        if (table[currentPos] === activeKey) {
          setStatus(`MATCH FOUND at index ${currentPos}!`);
          setIsProcessing(false);
          setIsAutoPlay(false);
        } else {
          setCurrentStep(5);
          setStatus(`No match. Preparing next probe.`);
        }
        break;
      case 5: // i++
        const nextI = probeCount + 1;
        if (nextI >= TABLE_SIZE) {
            setStatus("Table fully probed. Key not found.");
            setIsProcessing(false);
            setIsAutoPlay(false);
            return;
        }
        setProbeCount(nextI);
        const nextPos = (baseIdx + nextI * stepSize) % TABLE_SIZE;
        setProbingIndex(nextPos);
        setCurrentStep(3); // Loop back to while check
        setStatus(`Probe i incremented to ${nextI}. Checking index ${nextPos}.`);
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
          <button className="btn-insert" onClick={startSearch} disabled={isProcessing}>
            Search
          </button>
        </div>

        <div className="speed-control">
          <span>Slow</span>
          <input 
            type="range" min="200" max="2000" step="100" 
            value={2200 - speed} 
            onChange={(e) => setSpeed(2200 - Number(e.target.value))}
          />
          <span>Fast</span>
        </div>
      </div>

      <div className="viz-body">
        <div className="table-column">
          <div className="hash-array">
            {table.map((val, i) => (
              <div key={i} className={`hash-slot ${probingIndex === i ? (table[i] === activeKey ? "slot-green" : "slot-red") : ""}`}>
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
            <button className="ctrl-btn next" onClick={handleNextStep} disabled={!isProcessing || isAutoPlay}>
              Next Step ⏭
            </button>
            <button className="ctrl-btn stop" onClick={() => window.location.reload()}>🔄 Reset</button>
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
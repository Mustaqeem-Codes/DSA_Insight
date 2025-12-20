import React, { useState, useEffect } from 'react';
import '../styles/LinearHashing.css'; 

const TABLE_SIZE = 7;
const TOMBSTONE = "DEL";
const h1 = (key) => key % TABLE_SIZE;
const h2 = (key) => 5 - (key % 5); 

const doubleDeleteCppCode = [
  { line: "int idx = h1(key);", desc: "Calculate primary hash." },
  { line: "int step = h2(key);", desc: "Calculate secondary hash (step size)." },
  { line: "int i = 0;", desc: "Initialize probe counter." },
  { line: "while (table[(idx + i * step) % size] != EMPTY) {", desc: "Search until empty slot hit." },
  { line: "  if (table[pos] == key) {", desc: "Check if slot matches target key." },
  { line: "    table[pos] = DELETED;", desc: "Mark as Tombstone (DEL)." },
  { line: "    return SUCCESS;", desc: "Exit after deletion." },
  { line: "  }", desc: "" },
  { line: "  i++;", desc: "Next jump: i * step." },
  { line: "}" }
];

const DoubleDelete = () => {
  // Pre-filled table for demonstration
  const [table, setTable] = useState([7, "DEL", 14, null, 11, 5, null]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [probeCount, setProbeCount] = useState(0);
  const [status, setStatus] = useState('Enter key to delete using Double Hashing.');
  
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
    setProbeCount(0);
    setProbingIndex(h1(key));
    setStatus(`Step 1: Primary hash for ${key} is ${h1(key)}.`);
  };

  const handleNextStep = () => {
    const stepSize = h2(activeKey);
    const pos = (h1(activeKey) + probeCount * stepSize) % TABLE_SIZE;

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Step 2: Secondary hash (step size) is ${stepSize}.`);
        break;
      case 1:
        setCurrentStep(2);
        setStatus(`Initial probe i=0. Starting at index ${pos}.`);
        break;
      case 2:
        setCurrentStep(3);
        if (table[pos] === null) {
          setStatus(`Index ${pos} is EMPTY. Key not found.`);
          setIsProcessing(false);
          setIsAutoPlay(false);
        } else {
          setStatus(`Slot ${pos} is occupied. Checking for match...`);
        }
        break;
      case 3:
        if (table[pos] === activeKey) {
          setCurrentStep(4);
          setStatus(`MATCH! Key ${activeKey} found at index ${pos}.`);
        } else {
          setCurrentStep(8); // Skip to i++
          setStatus(`No match. Slot contains ${table[pos]}. Probing further...`);
        }
        break;
      case 4:
        setCurrentStep(5);
        const newTable = [...table];
        newTable[pos] = TOMBSTONE;
        setTable(newTable);
        setStatus(`Setting index ${pos} to ${TOMBSTONE}.`);
        break;
      case 5:
        setCurrentStep(6);
        setStatus(`DELETION SUCCESSFUL.`);
        setIsProcessing(false);
        setIsAutoPlay(false);
        break;
      case 8:
        const nextI = probeCount + 1;
        setProbeCount(nextI);
        const nextPos = (h1(activeKey) + nextI * stepSize) % TABLE_SIZE;
        setProbingIndex(nextPos);
        setCurrentStep(3); // Return to loop check
        setStatus(`Probe i=${nextI}. Next index: (${h1(activeKey)} + ${nextI} * ${stepSize}) % ${TABLE_SIZE} = ${nextPos}`);
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
            type="number" value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing} placeholder="Delete Key"
          />
          <button className="btn-insert" style={{backgroundColor: '#ef4444'}} onClick={startDelete} disabled={isProcessing}>
            Delete
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
              <div 
                key={i} 
                className={`hash-slot ${probingIndex === i ? (table[i] === activeKey ? 'slot-green' : 'slot-red') : ''}`}
              >
                <span className="slot-idx">{i}</span>
                <span className={`slot-val ${val === TOMBSTONE ? 'tombstone' : ''}`}>
                    {val !== null ? val : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">double_delete.cpp</div>
            <div className="cpp-content">
              {doubleDeleteCppCode.map((lineObj, idx) => (
                <div key={idx} className={`cpp-line ${currentStep === idx ? 'cpp-active' : ''}`}>
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
             <div className="desc-header">Double Hashing Trace</div>
             <div className="desc-content">
                <p>{status}</p>
                {currentStep !== -1 && <small>i: {probeCount} | Step Size: {h2(activeKey)}</small>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleDelete;
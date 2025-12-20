import React, { useState, useEffect } from 'react';
import '../styles/LinearHashing.css'; 

const TABLE_SIZE = 7;
const TOMBSTONE = "DEL";

const quadDeleteCppCode = [
  { line: "int i = 0;", desc: "Initialize probe counter." },
  { line: "int pos = (key + i*i) % size;", desc: "Initial quadratic position." },
  { line: "while (table[pos] != EMPTY) {", desc: "Search until empty slot hit." },
  { line: "  if (table[pos] == key) {", desc: "Check if slot matches target key." },
  { line: "    table[pos] = DELETED;", desc: "Mark as Tombstone (DEL)." },
  { line: "    return SUCCESS;", desc: "Exit after deletion." },
  { line: "  }", desc: "" },
  { line: "  i++; pos = (key + i*i) % size;", desc: "Next quadratic jump." },
  { line: "}" }
];

const QuadraticDelete = () => {
  const [table, setTable] = useState([7, 14, "DEL", null, 21, 5, null]); 
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [probeCount, setProbeCount] = useState(0);
  const [status, setStatus] = useState('Enter key to delete using Quadratic Probing.');
  
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
    setProbingIndex(key % TABLE_SIZE);
    setStatus(`Step 1: Searching for key ${key} to delete.`);
  };

  const handleNextStep = () => {
    let i = probeCount;
    let pos = (activeKey + i * i) % TABLE_SIZE;

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Initial check at index ${pos} (i=0)`);
        break;
      case 1:
        setCurrentStep(2);
        if (table[pos] === null) {
          setStatus(`Index ${pos} is EMPTY. Key not found.`);
          setIsProcessing(false);
          setIsAutoPlay(false);
        } else {
          setStatus(`Slot ${pos} is occupied by ${table[pos]}. Checking match...`);
        }
        break;
      case 2:
        if (table[pos] === activeKey) {
          setCurrentStep(3); // Highlights 'if (table[pos] == key)'
          setStatus(`MATCH! Preparing to delete key ${activeKey} from index ${pos}.`);
        } else {
          setCurrentStep(7); // Jump to increment i
          setStatus(`No match. Slot contains ${table[pos]}. Probing further...`);
        }
        break;
      case 3:
        setCurrentStep(4); // Highlights 'table[pos] = DELETED;'
        setStatus(`Setting index ${pos} to TOMBSTONE (DEL).`);
        break;
      case 4:
        const newTable = [...table];
        newTable[pos] = TOMBSTONE;
        setTable(newTable);
        setCurrentStep(5); // Highlights 'return SUCCESS;'
        setStatus(`Index ${pos} marked as ${TOMBSTONE}.`);
        break;
      case 5:
        setStatus(`DELETION SUCCESSFUL.`);
        setIsProcessing(false);
        setIsAutoPlay(false);
        break;
      case 7:
        const nextI = i + 1;
        setProbeCount(nextI);
        const nextPos = (activeKey + nextI * nextI) % TABLE_SIZE;
        setProbingIndex(nextPos);
        setCurrentStep(1);
        setStatus(`Quadratic Jump: (${activeKey} + ${nextI}²) % ${TABLE_SIZE} = ${nextPos}`);
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
            <div className="cpp-header">quadratic_delete.cpp</div>
            <div className="cpp-content">
              {quadDeleteCppCode.map((lineObj, idx) => (
                <div key={idx} className={`cpp-line ${currentStep === idx ? 'cpp-active' : ''}`}>
                  {/* Clean code display - Numbers removed */}
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
             <div className="desc-header">Execution Trace (i = {probeCount})</div>
             <div className="desc-content">
                <p>{status}</p>
                {currentStep !== -1 && <small>Current Position: {probingIndex}</small>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadraticDelete;
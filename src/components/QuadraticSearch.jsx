import React, { useState, useEffect } from 'react';
import '../styles/LinearHashing.css'; 

const TABLE_SIZE = 7;

const quadSearchCppCode = [
  { line: "int i = 0;", desc: "Initialize probe counter." },
  { line: "int pos = (key + i*i) % size;", desc: "Calculate initial position." },
  { line: "while (table[pos] != EMPTY) {", desc: "Search until an empty slot is hit." },
  { line: "  if (table[pos] == key) return pos;", desc: "Match found! Return index." },
  { line: "  i++;", desc: "Increment i for the next quadratic jump." },
  { line: "  pos = (key + i*i) % size;", desc: "New position: (hash + i²) % size." },
  { line: "}", desc: "Hit empty slot; key is not in table." }
];

const QuadraticSearch = () => {
  const [table, setTable] = useState([7, 14, null, null, 21, 5, null]); 
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [probeCount, setProbeCount] = useState(0);
  const [status, setStatus] = useState('Enter a key to search using Quadratic Probing.');
  
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
    setProbingIndex(key % TABLE_SIZE);
    setStatus(`Step 1: Calculating initial hash for key ${key}.`);
  };

  const handleNextStep = () => {
    let i = probeCount;
    let pos = (activeKey + i * i) % TABLE_SIZE;

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Initial position (i=0): ${pos}`);
        break;
      case 1:
        setCurrentStep(2);
        if (table[pos] === null) {
          setStatus(`Slot ${pos} is EMPTY. Key ${activeKey} cannot exist.`);
        } else {
          setStatus(`Slot ${pos} is occupied. Checking for match...`);
        }
        break;
      case 2:
        if (table[pos] === activeKey) {
          setStatus(`FOUND! Key ${activeKey} located at index ${pos}.`);
          setIsProcessing(false);
          setIsAutoPlay(false);
        } else if (table[pos] === null) {
          setCurrentStep(6);
          setStatus(`Empty slot reached. Search failed.`);
        } else {
          setCurrentStep(4);
          setStatus(`Not a match. Incrementing probe counter...`);
        }
        break;
      case 4:
        const nextI = i + 1;
        setProbeCount(nextI);
        setCurrentStep(5);
        setStatus(`i is now ${nextI}. Jumping quadratically...`);
        break;
      case 5:
        const nextPos = (activeKey + (i + 1) * (i + 1)) % TABLE_SIZE;
        setProbingIndex(nextPos);
        setCurrentStep(1); 
        setStatus(`Next check at: (${activeKey} + ${i+1}²) % ${TABLE_SIZE} = ${nextPos}`);
        break;
      case 6:
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
            type="number" value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing} placeholder="Search Key"
          />
          <button className="btn-insert" onClick={startSearch} disabled={isProcessing}>
            Search
          </button>
        </div>
        
        <div className="speed-control">
          <span>Fast</span>
          <input 
            type="range" min="200" max="2000" step="100" 
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
                className={`hash-slot ${probingIndex === i ? (table[i] === activeKey ? 'slot-green' : 'slot-red') : ''}`}
              >
                <span className="slot-idx">{i}</span>
                <span className="slot-val">{val !== null ? val : ''}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">quadratic_search.cpp</div>
            <div className="cpp-content">
              {quadSearchCppCode.map((lineObj, idx) => (
                <div key={idx} className={`cpp-line ${currentStep === idx ? 'cpp-active' : ''}`}>
                  {/* Line number span removed for clean separation */}
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
             <div className="desc-header">Quadratic Trace (i = {probeCount})</div>
             <div className="desc-content">
                <p>{status}</p>
                {currentStep !== -1 && <small>Checking index: (hash + {probeCount}²)</small>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadraticSearch;
import React, { useState, useEffect } from 'react';
import '../styles/LinearHashing.css'; // Reusing the established shared CSS

const TABLE_SIZE = 7;

const quadCppCode = [
  { line: "int i = 0;", desc: "Initialize probe counter." },
  { line: "int pos = (key + i*i) % size;", desc: "Calculate position using i-squared." },
  { line: "while (table[pos] != EMPTY) {", desc: "If collision, increment i and recalculate." },
  { line: "  i++;", desc: "Increment probe attempts." },
  { line: "  pos = (key + i*i) % size;", desc: "Quadratic jump: pos = (h + i²) % size." },
  { line: "}", desc: "Empty slot found." },
  { line: "table[pos] = key;", desc: "Insert value." }
];

const QuadraticInsert = () => {
  const [table, setTable] = useState(Array(TABLE_SIZE).fill(null));
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [probeCount, setProbeCount] = useState(0); // This is 'i'
  const [status, setStatus] = useState('Enter a value to see Quadratic Probing.');
  
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
    const initialPos = key % TABLE_SIZE;
    setProbingIndex(initialPos);
    setStatus(`Step 1: Start with i = 0. Index = ${key} % ${TABLE_SIZE} = ${initialPos}`);
  };

  const handleNextStep = () => {
    let i = probeCount;

    switch (currentStep) {
      case 0: // Initialize i=0
        setCurrentStep(1);
        setStatus(`Calculating position with i=${i}: (${activeKey} + ${i}²) % ${TABLE_SIZE}`);
        break;
      case 1: // Calculate pos
        setCurrentStep(2);
        const currentPos = (activeKey + i * i) % TABLE_SIZE;
        setProbingIndex(currentPos);
        if (table[currentPos] !== null) {
          setStatus(`Collision at index ${currentPos}! Slot contains ${table[currentPos]}.`);
        } else {
          setStatus(`Slot ${currentPos} is free! Ready to insert.`);
        }
        break;
      case 2: // Check while loop
        if (table[probingIndex] !== null) {
          setCurrentStep(3);
          setStatus(`Executing loop: incrementing i...`);
        } else {
          setCurrentStep(5);
          setStatus(`Loop exited. Target slot: ${probingIndex}`);
        }
        break;
      case 3: // i++
        const nextI = i + 1;
        setProbeCount(nextI);
        setCurrentStep(4);
        setStatus(`i is now ${nextI}. Re-calculating jump...`);
        break;
      case 4: // Recalculate pos
        const nextPos = (activeKey + (i + 1) * (i + 1)) % TABLE_SIZE;
        setProbingIndex(nextPos);
        setCurrentStep(2); // Go back to check the new slot
        setStatus(`New Index = (${activeKey} + ${i+1}²) % ${TABLE_SIZE} = ${nextPos}`);
        break;
      case 5: // Found slot
        setCurrentStep(6);
        setStatus(`Writing ${activeKey} to table[${probingIndex}]`);
        break;
      case 6: // Final Insert
        const newTable = [...table];
        newTable[probingIndex] = activeKey;
        setTable(newTable);
        setStatus(`SUCCESS: Inserted ${activeKey} after ${i} probe attempts.`);
        setIsProcessing(false);
        setIsAutoPlay(false);
        setInputValue('');
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
            disabled={isProcessing} placeholder="Enter Key"
          />
          <button className="btn-insert" onClick={startInsertion} disabled={isProcessing}>
            Start Insertion
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
                className={`hash-slot ${probingIndex === i ? (table[i] === null ? 'slot-green' : 'slot-red') : ''}`}
              >
                <span className="slot-idx">{i}</span>
                <span className="slot-val">{val !== null ? val : ''}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">quadratic_probing.cpp</div>
            <div className="cpp-content">
              {quadCppCode.map((lineObj, idx) => (
                <div key={idx} className={`cpp-line ${currentStep === idx ? 'cpp-active' : ''}`}>
                  {/* Line numbers removed for cleaner flow */}
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
             <div className="desc-header">Quadratic Step Trace (i = {probeCount})</div>
             <div className="desc-content">
                <p>{status}</p>
                {currentStep !== -1 && <small>Current Probe Jump: {probeCount}² = {probeCount * probeCount}</small>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadraticInsert;
import React, { useState, useEffect } from 'react';
import '../styles/LinearHashing.css'; 

const TABLE_SIZE = 5;

const chainingDeleteCppCode = [
  { line: "int idx = key % size;", desc: "Find the correct bucket." },
  { line: "Node* temp = table[idx];", desc: "Start search at the head of the chain." },
  { line: "Node* prev = NULL;", desc: "Keep track of the previous node." },
  { line: "while (temp != NULL) {", desc: "Traverse the linked list." },
  { line: "  if (temp->data == key) {", desc: "Key found!" },
  { line: "    if (prev == NULL) table[idx] = temp->next;", desc: "Delete head node." },
  { line: "    else prev->next = temp->next;", desc: "Bypass the current node." },
  { line: "    delete temp; return SUCCESS;", desc: "Free memory and exit." },
  { line: "  }", desc: "" },
  { line: "  prev = temp; temp = temp->next;", desc: "Move pointers forward." },
  { line: "}" }
];

const ChainingDelete = () => {
  const [table, setTable] = useState([[10, 5], [1, 6, 11], [], [13], [9]]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [status, setStatus] = useState('Enter key to delete from chains.');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Auto-play logic for consistency with other components
  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => handleNextStep(), speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep]);

  const startDelete = () => {
    if (!inputValue) return;
    setIsProcessing(true);
    setCurrentStep(0);
    setStatus(`Searching bucket ${parseInt(inputValue) % TABLE_SIZE} for deletion.`);
  };

  const handleNextStep = () => {
    const key = parseInt(inputValue);
    const idx = key % TABLE_SIZE;

    // This switch simulates the C++ logic flow visually
    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Iterating through chain at index ${idx}...`);
        break;
      case 1:
        if (table[idx].includes(key)) {
          setCurrentStep(4);
          setStatus(`Key ${key} found in list!`);
        } else {
          setCurrentStep(10);
          setStatus(`Key ${key} not found in this bucket.`);
        }
        break;
      case 4:
        setCurrentStep(7);
        const newTable = [...table];
        newTable[idx] = table[idx].filter(item => item !== key);
        setTable(newTable);
        setStatus(`Node unlinked and memory freed.`);
        break;
      case 7:
      case 10:
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
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
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Delete Key"
            disabled={isProcessing}
          />
          <button 
            className="btn-insert" 
            style={{ backgroundColor: '#ef4444' }} 
            onClick={startDelete}
            disabled={isProcessing}
          >
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
          {table.map((chain, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div className="hash-slot" style={{ minWidth: '50px', height: '40px' }}>
                <span className="slot-idx">{i}</span>
              </div>
              <div style={{ display: 'flex', marginLeft: '15px', alignItems: 'center' }}>
                {chain.length > 0 ? (
                  chain.map((val, nIdx) => (
                    <React.Fragment key={nIdx}>
                      <div className="node">{val}</div>
                      {nIdx < chain.length - 1 && <span style={{ color: '#94a3b8' }}>→</span>}
                    </React.Fragment>
                  ))
                ) : (
                  <span style={{ color: '#cbd5e1', fontSize: '0.8rem', marginLeft: '10px' }}>NULL</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">chaining_delete.cpp</div>
            <div className="cpp-content">
              {chainingDeleteCppCode.map((lineObj, idx) => (
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
             <div className="desc-header">Pointer Trace</div>
             <div className="desc-content">
                <p>{status}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainingDelete;
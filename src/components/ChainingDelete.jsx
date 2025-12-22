import React, { useState, useEffect } from 'react';
import '../styles/ChainHashing.css'; // Changed from LinearHashing.css

const TABLE_SIZE = 5;

const chainingDeleteCppCode = [
  { line: "int idx = key % size;", desc: "Find the correct bucket using hash function." },
  { line: "Node* temp = table[idx];", desc: "Start search at the head of the chain." },
  { line: "Node* prev = NULL;", desc: "Keep track of the previous node." },
  { line: "while (temp != NULL) {", desc: "Traverse the linked list until end." },
  { line: "  if (temp->data == key) {", desc: "Key found in current node!" },
  { line: "    if (prev == NULL) table[idx] = temp->next;", desc: "Case 1: Delete head node." },
  { line: "    else prev->next = temp->next;", desc: "Case 2: Delete middle/end node." },
  { line: "    delete temp; return SUCCESS;", desc: "Free memory and return success." },
  { line: "  }", desc: "" },
  { line: "  prev = temp; temp = temp->next;", desc: "Move both pointers forward." },
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
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeNodeIdx, setActiveNodeIdx] = useState(null);
  const [found, setFound] = useState(false);
  const [deleted, setDeleted] = useState(false);

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
    const key = parseInt(inputValue);
    const idx = key % TABLE_SIZE;
    
    setIsProcessing(true);
    setFound(false);
    setDeleted(false);
    setActiveIdx(idx);
    setActiveNodeIdx(-1);
    setCurrentStep(0);
    setStatus(`Step 1: h(${key}) = ${key} % ${TABLE_SIZE} = ${idx}. Starting deletion in Bucket [${idx}].`);
  };

  const handleNextStep = () => {
    const key = parseInt(inputValue);
    const idx = activeIdx;
    const chain = table[idx];

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Step 2: Starting traversal. temp = head of Bucket [${idx}], prev = NULL.`);
        break;
      
      case 1:
        const nextNodeIdx = activeNodeIdx + 1;
        if (nextNodeIdx < chain.length) {
          setActiveNodeIdx(nextNodeIdx);
          setCurrentStep(2);
          setStatus(`Step 3: Checking node containing ${chain[nextNodeIdx]}...`);
        } else {
          setCurrentStep(8);
          setStatus(`Step 8: Reached end of chain. Key ${key} not found.`);
        }
        break;
      
      case 2:
        if (chain[activeNodeIdx] === key) {
          setFound(true);
          setCurrentStep(3);
          setStatus(`Step 4: Key ${key} FOUND at node ${activeNodeIdx}! Preparing deletion.`);
        } else {
          setCurrentStep(5);
          setStatus(`Step 5: No match. Moving prev and temp pointers forward.`);
        }
        break;
      
      case 3:
        if (activeNodeIdx === 0) {
          setCurrentStep(4);
          setStatus(`Step 6: Deleting HEAD node (prev == NULL). table[${idx}] = temp->next.`);
        } else {
          setCurrentStep(6);
          setStatus(`Step 6: Deleting MIDDLE/END node. prev->next = temp->next.`);
        }
        break;
      
      case 4:
      case 6:
        const newTable = [...table];
        newTable[idx] = chain.filter((_, nodeIdx) => nodeIdx !== activeNodeIdx);
        setTable(newTable);
        setDeleted(true);
        setCurrentStep(7);
        setStatus(`Step 7: Memory freed. Key ${key} successfully deleted from Bucket [${idx}].`);
        break;
      
      case 5:
        setCurrentStep(1);
        break;
      
      case 7:
      case 8:
        setIsProcessing(false);
        setIsAutoPlay(false);
        setCurrentStep(-1);
        setActiveIdx(null);
        setActiveNodeIdx(null);
        break;
      
      default:
        break;
    }
  };

  const resetAll = () => {
    setTable([[10, 5], [1, 6, 11], [], [13], [9]]);
    setInputValue('');
    setCurrentStep(-1);
    setIsProcessing(false);
    setIsAutoPlay(false);
    setActiveIdx(null);
    setActiveNodeIdx(null);
    setFound(false);
    setDeleted(false);
    setStatus('Enter key to delete from chains.');
  };

  return (
    <div className="ch-main-wrapper">
      <div className="ch-viz-header">
        <div className="ch-input-group">
          <input 
            type="number" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter Key to Delete"
            disabled={isProcessing}
            className="ch-key-input"
          />
          <button 
            className="ch-btn-insert" 
            onClick={startDelete}
            disabled={isProcessing}
            style={{ 
              background: deleted ? '#10b981' : found ? '#f59e0b' : '#ef4444',
              background: deleted ? 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)' : 
                         found ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                         'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}
          >
            {deleted ? '✓ Deleted' : found ? 'Found - Delete' : 'Delete from Chain'}
          </button>
        </div>
        
        <div className="speed-control" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Slow</span>
          <input 
            type="range" 
            min="200" 
            max="2000" 
            step="100" 
            value={2200 - speed} 
            onChange={(e) => setSpeed(2200 - Number(e.target.value))}
            style={{ width: '100px' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Fast</span>
        </div>
      </div>

      <div className="ch-viz-body">
        {/* LEFT COLUMN: Hash Table Visualization */}
        <div className="ch-table-area">
          <div className="ch-memory-stack">
            {table.map((chain, bucketIdx) => (
              <div key={bucketIdx} className="ch-row-item">
                <div className={`ch-bucket-slot ${activeIdx === bucketIdx ? "ch-slot-active" : ""}`}>
                  <div className="ch-bucket-label">[{bucketIdx}]</div>
                  <div className="ch-bucket-ptr">{chain.length > 0 ? "•" : "/"}</div>
                </div>
                <div className="ch-chain-flow">
                  {chain.map((val, nodeIdx) => (
                    <div key={nodeIdx} className="ch-node-unit">
                      <div className="ch-node-link">→</div>
                      <div 
                        className={`ch-node-block ${
                          activeIdx === bucketIdx && activeNodeIdx === nodeIdx
                            ? found ? "ch-slot-active" : ""
                            : ""
                        }`}
                        style={{
                          background: found && activeIdx === bucketIdx && activeNodeIdx === nodeIdx
                            ? '#fef3c7'
                            : undefined,
                          borderColor: found && activeIdx === bucketIdx && activeNodeIdx === nodeIdx
                            ? '#f59e0b'
                            : undefined,
                          opacity: deleted && activeIdx === bucketIdx && activeNodeIdx === nodeIdx ? 0.5 : 1,
                          transform: deleted && activeIdx === bucketIdx && activeNodeIdx === nodeIdx ? 'scale(0.9)' : 'scale(1)'
                        }}
                      >
                        {val}
                        {deleted && activeIdx === bucketIdx && activeNodeIdx === nodeIdx && (
                          <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#ef4444',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>
                            ✗
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {chain.length > 0 && <div className="ch-node-null">NULL</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Code, Controls, Trace */}
        <div className="ch-logic-area">
          <div className="ch-cpp-card">
            <div className="ch-cpp-header">chaining_delete.cpp</div>
            <div className="ch-cpp-content">
              {chainingDeleteCppCode.map((lineObj, idx) => (
                <div key={idx} className={`ch-cpp-line ${currentStep === idx ? "ch-cpp-active" : ""}`}>
                  <code>{lineObj.line}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="ch-ctrl-group">
            <button 
              className={`ch-ctrl-btn ${isAutoPlay ? 'active' : ''}`} 
              onClick={() => setIsAutoPlay(!isAutoPlay)} 
              disabled={!isProcessing || deleted}
              style={{ 
                background: isAutoPlay ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : undefined 
              }}
            >
              {isAutoPlay ? "⏸ Pause" : "▶ Auto Play"}
            </button>
            <button 
              className="ch-ctrl-btn ch-next" 
              onClick={handleNextStep} 
              disabled={!isProcessing || isAutoPlay || deleted}
            >
              Next Step ⏭
            </button>
            <button 
              className="ch-ctrl-btn ch-reset" 
              onClick={resetAll}
            >
              🔄 Reset Table
            </button>
          </div>

          <div className="ch-trace-card">
            <div className="ch-trace-header">Deletion Execution Trace</div>
            <div className="ch-trace-content">
              <p>{status}</p>
              {found && !deleted && (
                <p style={{ color: '#f59e0b', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  ⚠ Key found - preparing deletion...
                </p>
              )}
              {deleted && (
                <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  ✓ Deletion successful! Node removed from chain.
                </p>
              )}
              {currentStep === 8 && !found && (
                <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  ✗ Key not found - nothing to delete
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainingDelete;
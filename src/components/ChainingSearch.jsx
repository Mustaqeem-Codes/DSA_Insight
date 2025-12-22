import React, { useState } from "react";
import "../styles/ChainHashing.css"; // Changed from LinearHashing.css

const TABLE_SIZE = 5;

const chainingSearchCode = [
  { line: "int idx = key % size;", desc: "Calculate bucket index using hash function." },
  { line: "Node* temp = table[idx];", desc: "Get the head pointer of the chain." },
  { line: "while (temp != NULL) {", desc: "Traverse the linked list until end." },
  { line: "  if (temp->data == key) return FOUND;", desc: "Check if current node contains the key." },
  { line: "  temp = temp->next;", desc: "Move to next node in the chain." },
  { line: "}", desc: "End of traversal - key not found." },
];

const ChainingSearch = () => {
  // Pre-filled table for demonstration
  const [table] = useState([[10, 5], [1, 6, 11], [], [13], [9]]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeNodeIdx, setActiveNodeIdx] = useState(null);
  const [status, setStatus] = useState("Enter key to search in chains.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [found, setFound] = useState(false);

  const startSearch = () => {
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setIsProcessing(true);
    setFound(false);
    setCurrentStep(0);
    const idx = key % TABLE_SIZE;
    setActiveIdx(idx);
    setActiveNodeIdx(-1);
    setStatus(`Step 1: h(${key}) = ${key} % ${TABLE_SIZE} = ${idx}. Searching in Bucket [${idx}].`);
  };

  const handleNextStep = () => {
    const key = parseInt(inputValue);
    const chain = table[activeIdx];

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Step 2: Starting traversal at head of Bucket [${activeIdx}].`);
        break;
      case 1:
        const nextNodeIdx = activeNodeIdx + 1;
        if (nextNodeIdx < chain.length) {
          setActiveNodeIdx(nextNodeIdx);
          setCurrentStep(2);
          setStatus(
            `Step 3: Checking node containing ${chain[nextNodeIdx]}...`
          );
        } else {
          setCurrentStep(5);
          setStatus(`Step 6: Reached end of chain (NULL). Key ${key} not found.`);
        }
        break;
      case 2:
        if (table[activeIdx][activeNodeIdx] === key) {
          setFound(true);
          setCurrentStep(3);
          setStatus(`Step 4: MATCH FOUND! Key ${key} found in Bucket [${activeIdx}].`);
        } else {
          setCurrentStep(4);
          setStatus(`Step 5: No match. Moving to next node in chain.`);
        }
        break;
      case 3: // Success
        setIsProcessing(false);
        break;
      case 4: // Loop back
        setCurrentStep(1);
        break;
      case 5: // Failure
        setIsProcessing(false);
        break;
      default:
        break;
    }
  };

  const resetSearch = () => {
    setInputValue("");
    setCurrentStep(-1);
    setActiveIdx(null);
    setActiveNodeIdx(null);
    setIsProcessing(false);
    setFound(false);
    setStatus("Enter key to search in chains.");
  };

  return (
    <div className="ch-main-wrapper">
      <div className="ch-viz-header">
        <div className="ch-input-group">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            placeholder="Enter Key to Search"
            className="ch-key-input"
          />
          <button 
            className="ch-btn-insert" 
            onClick={startSearch} 
            disabled={isProcessing}
            style={{ 
              background: found ? '#10b981' : undefined,
              background: found ? 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)' : undefined
            }}
          >
            {found ? "✓ Found" : "Search in Chain"}
          </button>
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
                            ? found ? "ch-node-pop" : "ch-slot-active"
                            : ""
                        }`}
                        style={{
                          background: found && activeIdx === bucketIdx && activeNodeIdx === nodeIdx
                            ? '#dcfce7'
                            : undefined,
                          borderColor: found && activeIdx === bucketIdx && activeNodeIdx === nodeIdx
                            ? '#22c55e'
                            : undefined
                        }}
                      >
                        {val}
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
            <div className="ch-cpp-header">chaining_search.cpp</div>
            <div className="ch-cpp-content">
              {chainingSearchCode.map((lineObj, idx) => (
                <div
                  key={idx}
                  className={`ch-cpp-line ${currentStep === idx ? "ch-cpp-active" : ""}`}
                >
                  <code>{lineObj.line}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="ch-ctrl-group">
            <button 
              className="ch-ctrl-btn ch-next" 
              onClick={handleNextStep} 
              disabled={!isProcessing || found}
            >
              Next Step ⏭
            </button>
            <button 
              className="ch-ctrl-btn ch-reset" 
              onClick={resetSearch}
            >
              🔄 Reset Search
            </button>
          </div>

          <div className="ch-trace-card">
            <div className="ch-trace-header">Search Execution Trace</div>
            <div className="ch-trace-content">
              <p>{status}</p>
              {found && (
                <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  ✓ Search successful!
                </p>
              )}
              {currentStep === 5 && !found && (
                <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  ✗ Key not found in table
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainingSearch;
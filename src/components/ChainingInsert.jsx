import React, { useState } from "react";
import "../styles/ChainHashing.css"; 

const TABLE_SIZE = 5;

const chainingCppCode = [
  { line: "int idx = key % size;", desc: "Calculate the bucket index." },
  { line: "Node* newNode = new Node(key);", desc: "Create a new list node." },
  { line: "newNode->next = table[idx];", desc: "Point new node to current head." },
  { line: "table[idx] = newNode;", desc: "Update bucket head to new node." },
];

const ChainingInsert = () => {
  const [table, setTable] = useState(Array(TABLE_SIZE).fill([]).map(() => []));
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(null);
  const [status, setStatus] = useState("Ready to insert. Enter a key.");
  const [activeKey, setActiveKey] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startInsertion = () => {
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setActiveKey(key);
    setIsProcessing(true);
    setCurrentStep(0);
    const idx = key % TABLE_SIZE;
    setActiveIdx(idx);
    setStatus(`Step 1: Hashing key ${key}... Index = ${key} % ${TABLE_SIZE} = ${idx}.`);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Step 2: Allocating memory for node containing ${activeKey}.`);
        break;
      case 1:
        setCurrentStep(2);
        setStatus(`Step 3: Linking new node's 'next' pointer to head of bucket [${activeIdx}].`);
        break;
      case 2:
        const newTable = [...table];
        newTable[activeIdx] = [activeKey, ...newTable[activeIdx]];
        setTable(newTable);
        setCurrentStep(3);
        setStatus(`Step 4: Success! Bucket [${activeIdx}] head updated to new node.`);
        break;
      case 3:
        setIsProcessing(false);
        setCurrentStep(-1);
        setActiveIdx(null);
        setInputValue("");
        setStatus("Insertion complete. Enter another key.");
        break;
      default:
        break;
    }
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
            placeholder="Enter Key (e.g. 15)"
            className="ch-key-input"
          />
          <button className="ch-btn-insert" onClick={startInsertion} disabled={isProcessing}>
            Insert to Chain
          </button>
        </div>
      </div>

      <div className="ch-viz-body">
        {/* LEFT COLUMN */}
        <div className="ch-table-area">
          <div className="ch-memory-stack">
            {table.map((chain, i) => (
              <div key={i} className="ch-row-item">
                <div className={`ch-bucket-slot ${activeIdx === i ? "ch-slot-active" : ""}`}>
                  <div className="ch-bucket-label">[{i}]</div>
                  <div className="ch-bucket-ptr">{chain.length > 0 ? "•" : "/"}</div>
                </div>
                <div className="ch-chain-flow">
                  {chain.map((val, nodeIdx) => (
                    <div key={nodeIdx} className="ch-node-unit">
                      <div className="ch-node-link">→</div>
                      <div className={`ch-node-block ${currentStep === 3 && activeIdx === i && nodeIdx === 0 ? "ch-node-pop" : ""}`}>
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

        {/* RIGHT COLUMN */}
        <div className="ch-logic-area">
          <div className="ch-cpp-card">
            <div className="ch-cpp-header">chaining_logic.cpp</div>
            <div className="ch-cpp-content">
              {chainingCppCode.map((lineObj, idx) => (
                <div key={idx} className={`ch-cpp-line ${currentStep === idx ? "ch-cpp-active" : ""}`}>
                  <code>{lineObj.line}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="ch-ctrl-group">
            <button className="ch-ctrl-btn ch-next" onClick={handleNextStep} disabled={!isProcessing}>
              Next Step ⏭
            </button>
            <button className="ch-ctrl-btn ch-reset" onClick={() => window.location.reload()}>🔄 Reset Table</button>
          </div>

          <div className="ch-trace-card">
            <div className="ch-trace-header">Execution Trace</div>
            <div className="ch-trace-content">
              <p>{status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainingInsert;
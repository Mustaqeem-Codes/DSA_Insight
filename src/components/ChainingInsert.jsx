import React, { useState, useEffect } from "react";
import "../styles/LinearHashing.css"; // Using established styles

const TABLE_SIZE = 5; // Smaller size to show chaining clearly

const chainingCppCode = [
  { line: "int idx = key % size;", desc: "Calculate the bucket index." },
  { line: "Node* newNode = new Node(key);", desc: "Create a new list node." },
  {
    line: "newNode->next = table[idx];",
    desc: "Point new node to the current head (Insert at front).",
  },
  {
    line: "table[idx] = newNode;",
    desc: "Update bucket head to point to the new node.",
  },
];

const ChainingInsert = () => {
  // Table is now an array of arrays (representing lists)
  const [table, setTable] = useState(
    Array(TABLE_SIZE)
      .fill([])
      .map(() => [])
  );
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(null);
  const [status, setStatus] = useState("Enter key to see Chaining.");

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
    setStatus(`Step 1: h(${key}) = ${idx}. Target bucket is Index ${idx}.`);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Step 2: Creating a new node for ${activeKey}.`);
        break;
      case 1:
        setCurrentStep(2);
        setStatus(
          `Step 3: Pointing new node to current head of Bucket ${activeIdx}.`
        );
        break;
      case 2:
        setCurrentStep(3);
        const newTable = [...table];
        // Inserting at the front of the chain (Standard Chaining)
        newTable[activeIdx] = [activeKey, ...newTable[activeIdx]];
        setTable(newTable);
        setStatus(`Step 4: Bucket ${activeIdx} updated. Insertion Complete!`);
        break;
      case 3:
        setIsProcessing(false);
        setCurrentStep(-1);
        setActiveIdx(null);
        setInputValue("");
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
      </div>

      <div className="viz-body">
        {/* Table Column - Modified for Chains */}
        <div className="table-column" style={{ minWidth: "350px" }}>
          <div className="hash-array">
            {table.map((chain, i) => (
              <div
                key={i}
                className="chain-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {/* The Array Slot */}
                <div
                  className={`hash-slot ${activeIdx === i ? "slot-green" : ""}`}
                  style={{ minWidth: "60px" }}
                >
                  <span className="slot-idx">{i}</span>
                </div>

                {/* The Visual Linked List Chain */}
                <div
                  className="chain-items"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  {chain.length > 0 && (
                    <span style={{ marginRight: "10px" }}>→</span>
                  )}
                  {chain.map((val, nodeIdx) => (
                    <React.Fragment key={nodeIdx}>
                      <div
                        className="node"
                        style={{
                          border: "2px solid #6366f1",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          background: "#e0e7ff",
                          fontWeight: "bold",
                        }}
                      >
                        {val}
                      </div>
                      {nodeIdx < chain.length - 1 && (
                        <span style={{ margin: "0 5px" }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                  {chain.length > 0 && (
                    <span style={{ marginLeft: "10px", color: "#94a3b8" }}>
                      NULL
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logic Column */}
        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">separate_chaining.cpp</div>
            <div className="cpp-content">
              {chainingCppCode.map((lineObj, idx) => (
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
              className="ctrl-btn next"
              onClick={handleNextStep}
              disabled={!isProcessing}
            >
              Next Step ⏭
            </button>
          </div>
          <div className="description-card">
            <div className="desc-header">Chaining Trace</div>
            <div className="desc-content">
              <p>{status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainingInsert;

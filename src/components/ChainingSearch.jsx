import React, { useState, useEffect } from "react";
import "../styles/LinearHashing.css";

const TABLE_SIZE = 5;

const chainingSearchCode = [
  { line: "int idx = key % size;", desc: "..." },
  { line: "Node* temp = table[idx];", desc: "..." },
  { line: "while (temp != NULL) {", desc: "..." },
  { line: "  if (temp->data == key) return FOUND;", desc: "..." },
  { line: "  temp = temp->next;", desc: "..." },
  { line: "}", desc: "..." },
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

  const startSearch = () => {
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setIsProcessing(true);
    setCurrentStep(0);
    const idx = key % TABLE_SIZE;
    setActiveIdx(idx);
    setActiveNodeIdx(-1);
    setStatus(`Step 1: h(${key}) = ${idx}. Searching in Bucket ${idx}.`);
  };

  const handleNextStep = () => {
    const key = parseInt(inputValue);
    const chain = table[activeIdx];

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(`Step 2: Starting traversal at the head of the list.`);
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
          setStatus(`Step 6: Reached end of list (NULL). Key not found.`);
        }
        break;
      case 2:
        if (table[activeIdx][activeNodeIdx] === key) {
          setCurrentStep(3);
          setStatus(`Step 4: MATCH FOUND! Key ${key} is in the table.`);
        } else {
          setCurrentStep(4);
          setStatus(`Step 5: No match. Moving to next pointer.`);
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

  return (
    <div className="linear-hashing-wrapper">
      <div className="viz-header">
        <div className="input-box">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search Key"
          />
          <button
            className="btn-insert"
            onClick={startSearch}
            disabled={isProcessing}
          >
            Search
          </button>
        </div>
      </div>

      <div className="viz-body">
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
                <div
                  className={`hash-slot ${activeIdx === i ? "slot-green" : ""}`}
                  style={{ minWidth: "60px" }}
                >
                  <span className="slot-idx">{i}</span>
                </div>
                <div
                  className="chain-items"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  {chain.length > 0 && <span>→</span>}
                  {chain.map((val, nodeIdx) => (
                    <React.Fragment key={nodeIdx}>
                      <div
                        className="node"
                        style={{
                          border:
                            activeIdx === i && activeNodeIdx === nodeIdx
                              ? "3px solid #f59e0b"
                              : "2px solid #6366f1",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          background:
                            activeIdx === i && activeNodeIdx === nodeIdx
                              ? "#fef3c7"
                              : "#e0e7ff",
                          fontWeight: "bold",
                          margin: "0 5px",
                          transition: "all 0.3s",
                        }}
                      >
                        {val}
                      </div>
                      {nodeIdx < chain.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">chaining_search.cpp</div>
            <div className="cpp-content">
              {chainingSearchCode.map((lineObj, idx) => (
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
            <div className="desc-header">Search Trace</div>
            <div className="desc-content">
              <p>{status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainingSearch;

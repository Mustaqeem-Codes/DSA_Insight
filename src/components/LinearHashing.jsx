import React, { useState, useEffect } from "react";
import "../styles/LinearHashing.css";

const TABLE_SIZE = 7;

const cppCode = [
  { line: "int hash = key % size;", desc: "Calculate the initial hash index." },
  {
    line: "while (table[hash] != EMPTY) {",
    desc: "Check if the current slot is occupied.",
  },
  {
    line: "  hash = (hash + 1) % size;",
    desc: "Collision! Move to the next linear slot.",
  },
  { line: "}", desc: "Found an empty slot." },
  { line: "table[hash] = key;", desc: "Insert the value into the table." },
];

const LinearHashing = () => {
  const [table, setTable] = useState(Array(TABLE_SIZE).fill(null));
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1);
  const [probingIndex, setProbingIndex] = useState(null);
  const [status, setStatus] = useState("System Idle. Ready for input.");

  const [activeKey, setActiveKey] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    let timer;
    if (isAutoPlay && isProcessing && currentStep !== -1) {
      timer = setTimeout(() => {
        handleNextStep();
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, isProcessing, currentStep]);

  const startInsertion = () => {
    if (!inputValue) return;
    const key = parseInt(inputValue);
    setActiveKey(key);
    setIsProcessing(true);
    setCurrentStep(0);
    setProbingIndex(key % TABLE_SIZE);
    setStatus(`Step 1: Calculating initial hash index for key ${key}.`);
  };

  const handleNextStep = () => {
    let h = probingIndex;

    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        setStatus(
          table[h] !== null
            ? `Collision! Slot ${h} contains ${table[h]}.`
            : `Slot ${h} is EMPTY.`
        );
        break;
      case 1:
        if (table[h] !== null) {
          setCurrentStep(2);
          setStatus(`Probing: Line 3 execution. Incrementing index...`);
        } else {
          setCurrentStep(3);
          setStatus(`Loop Terminated: Found available slot at index ${h}.`);
        }
        break;
      case 2:
        const nextH = (h + 1) % TABLE_SIZE;
        setProbingIndex(nextH);
        setCurrentStep(1);
        setStatus(`Now checking index ${nextH}...`);
        break;
      case 3:
        setCurrentStep(4);
        setStatus(`Final Step: Writing key ${activeKey} into table[${h}].`);
        break;
      case 4:
        const newTable = [...table];
        newTable[h] = activeKey;
        setTable(newTable);
        setStatus(`SUCCESS: ${activeKey} inserted at index ${h}.`);
        setIsProcessing(false);
        setIsAutoPlay(false);
        setInputValue("");
        break;
      default:
        break;
    }
  };

  const resetAll = () => {
    setTable(Array(TABLE_SIZE).fill(null));
    setIsProcessing(false);
    setIsAutoPlay(false);
    setCurrentStep(-1);
    setProbingIndex(null);
    setStatus("Table reset. System Idle.");
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
            Start Insertion
          </button>
        </div>

        <div className="speed-control">
          <span>Slow</span>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={2200 - speed} // Invert slider for intuitive feel
            onChange={(e) => setSpeed(2200 - Number(e.target.value))}
          />
          <span>Fast</span>
        </div>
      </div>

      <div className="viz-body">
        {/* Left Column: Array */}
        <div className="table-column">
          <div className="hash-array">
            {table.map((val, i) => (
              <div
                key={i}
                className={`hash-slot ${
                  probingIndex === i
                    ? table[i] === null
                      ? "slot-green"
                      : "slot-red"
                    : ""
                }`}
              >
                <span className="slot-idx">{i}</span>
                <span className="slot-val">{val !== null ? val : ""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Code, Controls, Description */}
        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">linear_probing.cpp</div>
            <div className="cpp-content">
              {cppCode.map((lineObj, idx) => (
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
              className={`ctrl-btn ${isAutoPlay ? "active" : ""}`}
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              disabled={!isProcessing || currentStep === 4}
            >
              {isAutoPlay ? "⏸ Pause" : "▶ Auto Play"}
            </button>
            <button
              className="ctrl-btn next"
              onClick={handleNextStep}
              disabled={!isProcessing || isAutoPlay || currentStep === -1}
            >
              Next Step ⏭
            </button>
            <button className="ctrl-btn stop" onClick={resetAll}>
              🔄 Reset
            </button>
          </div>

          <div className="description-card">
            <div className="desc-header">Execution Trace</div>
            <div className="desc-content">
              <p>{status}</p>
              {currentStep !== -1 && (
                <small>Executing Line {currentStep + 1}...</small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearHashing;

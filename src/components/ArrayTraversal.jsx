import React, { useState, useEffect } from "react";
import "../styles/ArrayStyles.css"; 

const arrayTraversalCode = [
  { line: "void traverse(int arr[], int size) {", desc: "Function start." },
  { line: "  int sum = 0;", desc: "Initialize accumulator." },
  { line: "  for (int i = 0; i < size; i++) {", desc: "Loop through each element." },
  { line: "    cout << arr[i] << ' ';", desc: "Print/Process current element." },
  { line: "    sum += arr[i];", desc: "Add current element to sum." },
  { line: "  }", desc: "End of loop." },
  { line: "  double avg = (double)sum / size;", desc: "Calculate average." },
  { line: "}" }
];

const ArrayTraversal = () => {
  const [array] = useState([15, 22, 8, 31, 42, 10, null, null, null, null]);
  const [logicalSize] = useState(6);
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(null);
  const [runningSum, setRunningSum] = useState(0);
  const [status, setStatus] = useState("Click 'Start Traversal' to see the process.");
  
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

  const startTraversal = () => {
    setIsProcessing(true);
    setCurrentStep(1); // Start at sum = 0
    setActiveIdx(null);
    setRunningSum(0);
    setStatus("Initializing traversal...");
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 1: // int sum = 0
        setCurrentStep(2);
        setRunningSum(0);
        setStatus("Sum initialized to 0.");
        break;

      case 2: // for loop check
        const nextIdx = activeIdx === null ? 0 : activeIdx + 1;
        if (nextIdx < logicalSize) {
          setActiveIdx(nextIdx);
          setCurrentStep(3);
          setStatus(`Accessing element at index ${nextIdx}.`);
        } else {
          setCurrentStep(6); // Move to average calculation
          setActiveIdx(null);
          setStatus(`Traversal complete. Total sum: ${runningSum}`);
        }
        break;

      case 3: // cout << arr[i]
        setCurrentStep(4);
        setStatus(`Current value: ${array[activeIdx]}. Processing...`);
        break;

      case 4: // sum += arr[i]
        const newSum = runningSum + array[activeIdx];
        setRunningSum(newSum);
        setCurrentStep(5);
        setStatus(`Added ${array[activeIdx]} to sum. Running total: ${newSum}`);
        break;

      case 5: // Loop back
        setCurrentStep(2);
        break;

      case 6: // Calculate average
        const avg = (runningSum / logicalSize).toFixed(2);
        setStatus(`Final Result - Sum: ${runningSum}, Average: ${avg}`);
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
        <div className="stats-box" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button className="btn-insert" onClick={startTraversal} disabled={isProcessing}>Start Traversal</button>
          <div className="stat-item"><strong>Sum:</strong> {runningSum}</div>
        </div>
        <div className="speed-control">
          <span>Slow</span>
          <input type="range" min="200" max="2000" step="100" value={2200 - speed} onChange={(e) => setSpeed(2200 - Number(e.target.value))} />
          <span>Fast</span>
        </div>
      </div>

      <div className="viz-body">
        <div className="table-column">
          <div className="memory-row">
            {array.map((val, i) => (
              <div 
                key={i} 
                className={`memory-cell 
                  ${activeIdx === i ? "cell-moving" : ""} 
                  ${val === null ? "cell-empty" : ""}`}
              >
                <div className="cell-address">[{i}]</div>
                <div className="cell-data">{val !== null ? val : "null"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="logic-column">
          <div className="cpp-card">
            <div className="cpp-header">array_traversal.cpp</div>
            <div className="cpp-content">
              {arrayTraversalCode.map((lineObj, idx) => (
                <div key={idx} className={`cpp-line ${currentStep === idx ? "cpp-active" : ""}`}>
                  <code>{lineObj.line}</code>
                </div>
              ))}
            </div>
          </div>
          <div className="viz-controls">
            <button className={`ctrl-btn ${isAutoPlay ? 'active' : ''}`} onClick={() => setIsAutoPlay(!isAutoPlay)} disabled={!isProcessing}>
              {isAutoPlay ? "⏸ Pause" : "▶ Auto Play"}
            </button>
            <button className="ctrl-btn next" onClick={handleNextStep} disabled={!isProcessing || isAutoPlay}>Next Step ⏭</button>
            <button className="ctrl-btn stop" onClick={() => window.location.reload()}>🔄 Reset</button>
          </div>
          <div className="description-card">
            <div className="desc-header">Traversal Trace</div>
            <div className="desc-content"><p>{status}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayTraversal;
import React, { useState, useEffect } from 'react';
import '../styles/SinglyLinkedList.css';

// Node class for Singly Linked List
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const SinglyLinkedList = () => {
  const [list, setList] = useState([]);
  const [value, setValue] = useState('');
  const [position, setPosition] = useState(0);
  const [operation, setOperation] = useState('insertEnd');
  const [pseudocode, setPseudocode] = useState('');

  // Initialize with sample data
  useEffect(() => {
    const initialList = [];
    for (let i = 1; i <= 5; i++) {
      initialList.push({ value: i, next: i === 5 ? null : i + 1 });
    }
    setList(initialList);
    updatePseudocode('insertEnd');
  }, []);

  // Update pseudocode based on operation
  const updatePseudocode = (op) => {
    const codes = {
      insertStart: `function insertAtBeginning(list, value):
    1. Create new node with given value
    2. new_node.next = head
    3. head = new_node`,
      
      insertEnd: `function insertAtEnd(list, value):
    1. Create new node with given value
    2. If head is null, head = new_node
    3. Else traverse to last node
    4. last_node.next = new_node`,
      
      insertRandom: `function insertAtPosition(list, value, position):
    1. Create new node
    2. Traverse to (position-1)th node
    3. new_node.next = current.next
    4. current.next = new_node`,
      
      deleteStart: `function deleteFromBeginning(list):
    1. If head is null, return
    2. temp = head
    3. head = head.next
    4. Delete temp`,
      
      deleteEnd: `function deleteFromEnd(list):
    1. If head is null, return
    2. If head.next is null, delete head
    3. Else traverse to second last node
    4. Delete last node, set second last.next = null`,
      
      deleteRandom: `function deleteAtPosition(list, position):
    1. Traverse to (position-1)th node
    2. temp = current.next
    3. current.next = temp.next
    4. Delete temp`
    };
    setPseudocode(codes[op]);
  };

  // Insert node based on operation
  const insertNode = () => {
    if (!value.trim() && !operation.includes('delete')) return;
    
    let newList = [...list];
    const newNode = { value: parseInt(value) || 0, next: null };
    
    switch(operation) {
      case 'insertStart':
        newList.unshift({ ...newNode, next: newList.length > 0 ? newList[0].value : null });
        break;
      
      case 'insertEnd':
        if (newList.length > 0) {
          newList[newList.length - 1].next = newNode.value;
        }
        newList.push(newNode);
        break;
      
      case 'insertRandom':
        const pos = Math.min(position, newList.length);
        if (pos === 0) {
          newList.unshift({ ...newNode, next: newList.length > 0 ? newList[0].value : null });
        } else {
          newList[pos - 1].next = newNode.value;
          newNode.next = newList[pos] ? newList[pos].value : null;
          newList.splice(pos, 0, newNode);
        }
        break;
      default:
        break;
    }
    
    setList(newList);
    setValue('');
  };

  // Delete node based on operation
  const deleteNode = () => {
    if (list.length === 0) return;
    
    let newList = [...list];
    
    switch(operation) {
      case 'deleteStart':
        newList.shift();
        if (newList.length > 0) {
          newList[0].next = newList[1] ? newList[1].value : null;
        }
        break;
      
      case 'deleteEnd':
        newList.pop();
        if (newList.length > 0) {
          newList[newList.length - 1].next = null;
        }
        break;
      
      case 'deleteRandom':
        const pos = Math.min(position, newList.length - 1);
        if (pos >= 0) {
          if (pos > 0) {
            newList[pos - 1].next = newList[pos + 1] ? newList[pos + 1].value : null;
          }
          newList.splice(pos, 1);
        }
        break;
      default:
        break;
    }
    
    setList(newList);
  };

  // Handle operation change
  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    updatePseudocode(e.target.value);
  };

  // Visualize the list
  const visualizeList = () => {
    return (
      <div className="list-visualization">
        {list.map((node, index) => (
          <React.Fragment key={index}>
            <div className="list-node">
              <div className="node-value">{node.value}</div>
              <div className="node-pointer">Node {index}</div>
              {node.next !== null && (
                <div className="node-next">next: {node.next}</div>
              )}
            </div>
            {index < list.length - 1 && (
              <div className="list-arrow">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="singly-linked-list-container">
      <h1 className="main-title">Singly Linked List Visualization</h1>
      
      {/* Visualization Area */}
      <div className="visualization-area">
        {visualizeList()}
      </div>
      
      {/* Controls Panel */}
      <div className="controls-panel">
        <h2 className="panel-title">Controls</h2>
        
        <select 
          value={operation} 
          onChange={handleOperationChange}
          className="operation-select"
        >
          <option value="insertStart">Insert at Beginning</option>
          <option value="insertEnd">Insert at End</option>
          <option value="insertRandom">Insert at Random Position</option>
          <option value="deleteStart">Delete from Start</option>
          <option value="deleteEnd">Delete from End</option>
          <option value="deleteRandom">Delete from Random Position</option>
        </select>
        
        <input
          type="text"
          className="value-input"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={operation.includes('delete')}
        />
        
        <input
          type="number"
          className="position-input"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
          disabled={!operation.includes('Random')}
        />
        
        <div className="button-container">
          <button
            className="insert-button"
            onClick={insertNode}
            disabled={operation.includes('delete')}
          >
            Insert
          </button>
          
          <button
            className="delete-button"
            onClick={deleteNode}
            disabled={!operation.includes('delete') || list.length === 0}
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Pseudocode Display */}
      <div className="pseudocode-panel">
        <h2 className="panel-title">Pseudocode</h2>
        <pre className="pseudocode">
          {pseudocode}
        </pre>
      </div>
    </div>
  );
};

export default SinglyLinkedList;
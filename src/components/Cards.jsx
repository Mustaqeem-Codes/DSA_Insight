import React from "react";
import {
  Grid,
  Layers,
  ListOrdered,
  Link as LinkIcon,
  GitBranch,
  Network,
  Hash,
  Binary,
  Type,
} from "lucide-react";
import "../styles/Cards.css";
import "../styles/Button.css";

const Cards = () => {
  const dataStructures = [
    {
      id: "array",
      name: "Array",
      description: "Contiguous memory allocation of similar elements",
      icon: <Grid className="ds-icon-img" />,
      color: "blue-gradient",
      category: "linear",
      path: "/visualize/array", // Add path for routing
    },
    {
      id: "stack",
      name: "Stack",
      description: "LIFO data structure",
      icon: <Layers className="ds-icon-img" />,
      color: "emerald-gradient",
      category: "linear",
      path: "/visualize/stack", // Add path for routing
    },
    {
      id: "queue",
      name: "Queue",
      description: "FIFO data structure",
      icon: <ListOrdered className="ds-icon-img" />,
      color: "violet-gradient",
      category: "linear",
      path: "/visualize/queue", // Add path for routing
    },
    {
      id: "linked-list",
      name: "Linked List",
      description: "Linear collection of linked nodes",
      icon: <LinkIcon className="ds-icon-img" />,
      color: "indigo-gradient",
      category: "linear",
      path: "/visualize/linked-list", // Add path for routing
    },
    {
      id: "binary-search-tree",
      name: "Binary Search Tree",
      description: "Hierarchical sorted tree structure",
      icon: <GitBranch className="ds-icon-img" />,
      color: "amber-gradient",
      category: "non-linear",
      path: "/BST_Page.jsx", // Add path for routing
    },
    // {
    //   id: "graph",
    //   name: "Graph",
    //   description: "Nodes and edges structure",
    //   icon: <Network className="ds-icon-img" />,
    //   color: "rose-gradient",
    //   category: "non-linear",
    //   path: "/visualize/graph", // Add path for routing
    // },
    // {
    //   id: "hash-table",
    //   name: "Hash Table",
    //   description: "Key-value mapping",
    //   icon: <Hash className="ds-icon-img" />,
    //   color: "purple-gradient",
    //   category: "hash",
    //   path: "/visualize/hash-table", // Add path for routing
    // },
    // {
    //   id: "heap",
    //   name: "Heap",
    //   description: "Complete binary tree",
    //   icon: <Binary className="ds-icon-img" />,
    //   color: "sky-gradient",
    //   category: "tree",
    //   path: "/visualize/heap", // Add path for routing
    // },
    // {
    //   id: "trie",
    //   name: "Trie",
    //   description: "Prefix tree structure",
    //   icon: <Type className="ds-icon-img" />,
    //   color: "green-gradient",
    //   category: "tree",
    //   path: "/visualize/trie", // Add path for routing
    // },
  ];

  // Function to handle card click
  const handleCardClick = (path) => {
    window.location.href = path; // Simple navigation
    // Or if using React Router: navigate(path);
  };

  return (
    <section className="data-structures">
      <div className="section-header">
        <h3 className="section-title">Explore Data Structures</h3>
        <p className="section-subtitle">
          Click on any data structure to start visualizing
        </p>
      </div>
      <div className="data-structures-grid">
        {dataStructures.map((ds) => (
          <div
            key={ds.id}
            className="ds-card"
            onClick={() => handleCardClick(ds.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCardClick(ds.path);
              }
            }}
          >
            <div className="ds-card-header">
              <div className={`ds-icon ${ds.color}`}>{ds.icon}</div>
              <h3 className="ds-name">{ds.name}</h3>
              <p className="ds-description">{ds.description}</p>
            </div>
            <div className="ds-card-content">
              <button 
                className="btn btn-ghost visualize-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when button is clicked
                  handleCardClick(ds.path);
                }}
              >
                Visualize →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cards;
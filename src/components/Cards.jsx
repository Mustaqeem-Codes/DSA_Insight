import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Layers,
  ListOrdered,
  Link as LinkIcon,
  GitBranch,
} from "lucide-react";
import "../styles/Cards.css";
import "../styles/Button.css";

const Cards = () => {
  const navigate = useNavigate(); // React Router navigation

  const dataStructures = [
    {
      id: "array",
      name: "Array",
      description: "Contiguous memory allocation of similar elements",
      icon: <Grid className="ds-icon-img" />,
      color: "blue-gradient",
      category: "linear",
      path: "/array",
    },
    {
      id: "stack",
      name: "Stack",
      description: "LIFO data structure",
      icon: <Layers className="ds-icon-img" />,
      color: "emerald-gradient",
      category: "linear",
      path: "/stack",
    },
    {
      id: "queue",
      name: "Queue",
      description: "FIFO data structure",
      icon: <ListOrdered className="ds-icon-img" />,
      color: "violet-gradient",
      category: "linear",
      path: "/queue",
    },
    {
      id: "linked-list",
      name: "Linked List",
      description: "Linear collection of linked nodes",
      icon: <LinkIcon className="ds-icon-img" />,
      color: "indigo-gradient",
      category: "linear",
      path: "/linked-list",
    },
    {
      id: "binary-search-tree",
      name: "Binary Search Tree",
      description: "Hierarchical sorted tree structure",
      icon: <GitBranch className="ds-icon-img" />,
      color: "amber-gradient",
      path: "/bst", // ✅ must be /bst
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
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
                  e.stopPropagation();
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

import React from "react";
import "../styles/Navbar.css";
import { FaBook } from "react-icons/fa"; // book icon
import programmingIcon from "../assets/programming.png";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left: Logo + Title + Tagline */}
      <div className="nav-left">
        <img src={programmingIcon} alt="Programming Icon" className="nav-icon" />
        <div className="nav-text">
          <div className="nav-title">DSA Visualizer</div>
          <div className="nav-tagline">
            Master Data Structures Through Visualization
          </div>
        </div>
      </div>

      {/* Right: Read Docs button */}
      <a href="#docs" className="read-docs-btn">
        <FaBook className="book-icon" /> Read Docs
      </a>
    </nav>
  );
}

export default Navbar;

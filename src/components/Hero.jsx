import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import '../styles/Hero.css';
import '../styles/Button.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge-container">
          <div className="hero-badge">
            <Sparkles className="badge-icon" />
            Interactive Learning Platform
          </div>
        </div>
        <h2 className="hero-title">
          Visualize, Learn & Master
          <span className="hero-gradient-text">Data Structures</span>
        </h2>
        <p className="hero-description">
          Experience real-time animations, understand operations, and master algorithms
          with ready-to-use code in C++.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary btn-lg">
            <Zap className="button-icon" />
            Start Learning
          </button>
          <button className="btn btn-outline btn-lg">
            View Examples
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React from 'react';
import { Zap, Code, BookOpen } from 'lucide-react';
import '../styles/Features.css';
import '../styles/Button.css';

const Features = () => {
  const features = [
    {
      icon: <Zap className="icon" />,
      title: "Real-Time Animation",
      description: "Watch every operation unfold step-by-step with smooth, intuitive animations",
      gradient: "emerald-gradient"
    },
    {
      icon: <Code className="icon" />,
      title: "Language Support",
      description: "Get production-ready code in C++.",
      gradient: "blue-gradient"
    },
    {
      icon: <BookOpen className="icon" />,
      title: "Time Complexity",
      description: "Understand performance implications with Big-O notation for every operation",
      gradient: "violet-gradient"
    }
  ];

  return (
    <section className="features">
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-header">
              <div className={`feature-icon ${feature.gradient}`}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
import React from 'react';
import { FaGithub, FaLinkedinIn, FaFacebookF, FaLaptopCode, FaCodeBranch } from 'react-icons/fa';
import { MdOutlineCode } from 'react-icons/md';
import '../styles/Footer.css';
const Footer = () => {
    return (
        <footer className="footer-dsa">
            <div className="footer-gradient-bar"></div>
            
            <div className="footer-grid-container">
                
                {/* COLUMN 1: BRANDING & DSA FOCUS */}
                <div className="footer-section-dsa branding-col">
                    <h4 className="dsa-logo">
                        <FaCodeBranch className="dsa-icon" /> DSA Visualizer
                    </h4>
                    
                    {/* *** CORRECTED MISSION STATEMENT *** */}
                    <p className="dsa-mission-statement">
                        A collaborative project visualizing the 
                        <span className="accent-text"> logic and beauty </span> 
                        of Data Structures and Algorithms. Built by developers, for learners.
                    </p>
                    
                    <div className="dev-status">
                        <MdOutlineCode /> Currently in Development
                    </div>
                </div>

                {/* COLUMN 2: QUICK LINKS (No change) */}
                <div className="footer-section-dsa">
                    <h4 className="dsa-title">Resources</h4>
                    <ul className="dsa-links">
                        <li><a href="#algorithms">Algorithms</a></li>
                        <li><a href="#data-structures">Data Structures</a></li>
                        <li><a href="#team">Our Team</a></li>
                        <li><a href="#contribute">Contribute</a></li>
                    </ul>
                </div>

                {/* COLUMN 3: YOUR EFFORT & ATTRIBUTION (No change) */}
                <div className="footer-section-dsa dev-col">
                    <h4 className="dsa-title">Developer & Connect</h4>
                    
                    <a href="https://mustaqeem.bytewisdom.tech/" target="_blank" rel="noopener noreferrer" className="portfolio-link-btn">
                        <FaLaptopCode /> View My Portfolio
                    </a>

                    <div className="social-icons-dsa">
                        <a href="https://github.com/Mustaqeem-Codes" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                        <a href="https://linkedin.com/in/muhammadmustaqeem-webdev" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
                        <a href="https://web.facebook.com/MustaqeemCodes" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT (No change) */}
            <div className="footer-copyright-dsa">
                &copy; {new Date().getFullYear()} DSA Visualizer Project. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
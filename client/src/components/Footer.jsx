import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Footer Links */}
        <nav className="footer-nav" role="navigation" aria-label="Footer navigation">
          <ul className="footer-links">
            <li>
              <a 
                href="/terms" 
                className="footer-link"
                aria-label="Terms of Use"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a 
                href="/privacy" 
                className="footer-link"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a 
                href="/contact" 
                className="footer-link"
                aria-label="Contact Us"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <div className="footer-copyright">
          <p className="copyright-text">
            © {currentYear} TriageX. All rights reserved.
          </p>
        </div>

        {/* Optional: Brand tagline */}
        <div className="footer-tagline">
          <p className="tagline-text">
            Your trusted healthcare triage assistant
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
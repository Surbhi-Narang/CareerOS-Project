import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Github, Linkedin, Twitter, Youtube, Mail, MapPin, Target } from 'lucide-react';
import './Footer.css';

/**
 * Footer Component (Shared)
 * 4-column desktop footer collapsing to interactive accordions on mobile.
 */
export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleAccordion = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        {/* Column 1: About */}
        <div className="footer-column">
          <div className="footer-brand">
            <div className="logo-icon-box sm" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15L9 10L13 14L20 7" />
                <path d="M14 7H20V13" />
              </svg>
            </div>
            <span className="brand-wordmark">
              Career<span className="logo-accent">OS</span>
            </span>
          </div>
          <p className="footer-about-text">
            A centralized career development platform empowering students to plan, build, apply, and land top roles with ease.
          </p>
          <p className="footer-tagline">Plan. Build. Apply. Get Hired.</p>
        </div>

        {/* Column 2: Quick Links (Accordion on mobile) */}
        <div className="footer-column">
          <button
            className="footer-accordion-header"
            onClick={() => toggleAccordion('links')}
            aria-expanded={openSection === 'links'}
          >
            <h3>Quick Links</h3>
            <ChevronDown className={`accordion-icon ${openSection === 'links' ? 'open' : ''}`} size={18} />
          </button>
          <ul className={`footer-links ${openSection === 'links' ? 'show-mobile' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><Link to="/interview-prep">Interview Prep</Link></li>
            <li><Link to="/signin">Student Login</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact (Accordion on mobile) */}
        <div className="footer-column">
          <button
            className="footer-accordion-header"
            onClick={() => toggleAccordion('contact')}
            aria-expanded={openSection === 'contact'}
          >
            <h3>Contact & Support</h3>
            <ChevronDown className={`accordion-icon ${openSection === 'contact' ? 'open' : ''}`} size={18} />
          </button>
          <ul className={`footer-contact-list ${openSection === 'contact' ? 'show-mobile' : ''}`}>
            <li>
              <Mail size={16} className="contact-icon" />
              <a href="mailto:support@careeros.edu" className="contact-link">support@careeros.edu</a>
            </li>
            <li>
              <MapPin size={16} className="contact-icon address-icon" />
              <span className="address-text">
                Chitkara University, Chandigarh-Patiala National Highway (NH-64/NH-7), Tehsil Rajpura, District Patiala, Punjab – 140401
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Social Icons (Accordion on mobile) */}
        <div className="footer-column">
          <button
            className="footer-accordion-header"
            onClick={() => toggleAccordion('social')}
            aria-expanded={openSection === 'social'}
          >
            <h3>Connect With Us</h3>
            <ChevronDown className={`accordion-icon ${openSection === 'social' ? 'open' : ''}`} size={18} />
          </button>
          <div className={`footer-social-wrapper ${openSection === 'social' ? 'show-mobile' : ''}`}>
            <p className="social-text">Follow our updates on campus placements & career tips.</p>
            <div className="footer-social-icons">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 CareerOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import './NotFound.css';

/**
 * NotFound Page Component
 * Simple 404 "Page Not Found" page for wrong URLs, with a button to go back home.
 */
export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="container notfound-container">
        <div className="notfound-card">
          <div className="notfound-icon-box">
            <Compass size={40} className="notfound-icon" />
          </div>
          <span className="notfound-badge">Error 404</span>
          <h1 className="notfound-title">Page Not Found</h1>
          <p className="notfound-desc">
            The page you are looking for doesn't exist, has been removed, or the URL might be mistyped.
          </p>
          <Link to="/" className="btn btn-primary notfound-btn">
            <Home size={18} />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

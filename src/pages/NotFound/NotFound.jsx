import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

/**
 * NotFound Page Component (Teammate 4)
 * 404 Error page with quick links back to home and dashboard.
 */
export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="container">
        <h1>404 — Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

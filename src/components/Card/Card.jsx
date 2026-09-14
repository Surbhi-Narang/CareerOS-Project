import React from 'react';
import './Card.css';

/**
 * Card Component (Shared)
 * Reusable surface card container with subtle borders and consistent padding.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

import React from 'react';
import './Button.css';

/**
 * Button Component (Shared)
 * Reusable button supporting solid primary CTA and outline secondary variants.
 */
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

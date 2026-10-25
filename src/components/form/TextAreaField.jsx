import React from 'react';
import './FormField.css';

/**
 * Reusable multi-line text area component.
 * Displays label, required star (*), textarea, and error message in red.
 */
export default function TextAreaField({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = '',
  rows = 4,
  className = '',
  disabled = false,
  ...rest
}) {
  // Use id if provided, otherwise fallback to name
  const fieldId = id || name;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      <textarea
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`form-input form-textarea ${error ? 'input-error' : ''}`.trim()}
        {...rest}
      />

      {/* Show error message in red when error exists */}
      {error && <span className="field-error-message">{error}</span>}
    </div>
  );
}

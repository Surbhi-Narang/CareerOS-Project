import React from 'react';
import './FormField.css';

/**
 * Reusable text/number/email/password/date input component.
 * Displays label, required star (*), input field, and error message in red.
 */
export default function InputField({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = '',
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

      <input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'input-error' : ''}`.trim()}
        {...rest}
      />

      {/* Show error message in red when error exists */}
      {error && <span className="field-error-message">{error}</span>}
    </div>
  );
}

import React from 'react';
import './FormField.css';

/**
 * Reusable dropdown select component.
 * Displays label, required star (*), options list, and error message in red.
 */
export default function SelectField({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  options = [],
  placeholder = '',
  className = '',
  disabled = false,
  children,
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

      <select
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`form-input form-select ${error ? 'input-error' : ''}`.trim()}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {/* Render options from array prop or children */}
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label || opt.value}
              </option>
            ))
          : children}
      </select>

      {/* Show error message in red when error exists */}
      {error && <span className="field-error-message">{error}</span>}
    </div>
  );
}

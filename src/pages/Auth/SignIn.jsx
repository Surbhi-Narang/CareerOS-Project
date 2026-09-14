import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

/**
 * SignIn Page Component (Teammate 1)
 * Login form with controlled inputs, field-level validation, and mock AuthContext integration.
 */
export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          {/* Small CareerOS Logo linking back to "/" */}
          <div className="auth-card-header">
            <Link to="/" className="auth-brand-logo" aria-label="CareerOS Home">
              <div className="auth-logo-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15L9 10L13 14L20 7" />
                  <path d="M14 7H20V13" />
                </svg>
              </div>
              <span className="auth-wordmark">
                Career<span className="auth-logo-accent">OS</span>
              </span>
            </Link>
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Welcome back to your placement workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
              />
              {errors.email && (
                <span className="field-error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
              />
              {errors.password && (
                <span className="field-error-message">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-auth-submit">
              Sign In
            </button>
          </form>

          {/* Terms text */}
          <p className="auth-disclaimer">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>

          {/* Footer navigation link */}
          <div className="auth-card-footer">
            <p className="auth-switch-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-switch-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

/**
 * SignUp Page Component (Teammate 1)
 * Registration form with controlled inputs, field-level validation, and mock AuthContext integration.
 */
export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
    signup(fullName, email, password);
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join CareerOS to track your placement journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
              />
              {errors.fullName && (
                <span className="field-error-message">{errors.fullName}</span>
              )}
            </div>

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
                placeholder="Create password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
              />
              {errors.confirmPassword && (
                <span className="field-error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-auth-submit">
              Create Account
            </button>
          </form>

          {/* Terms text */}
          <p className="auth-disclaimer">
            By clicking "Create account", I agree to the CareerOS Terms of Service and have read the Privacy Policy.
          </p>

          {/* Footer navigation link */}
          <div className="auth-card-footer">
            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/signin" className="auth-switch-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

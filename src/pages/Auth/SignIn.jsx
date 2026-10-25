import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import InputField from '../../components/form/InputField';
import './Auth.css';

/**
 * SignIn Page Component
 * Login form with controlled InputField components,
 * plain React state validation (on blur & on submit), disabled submit button when invalid,
 * clear form on success, and ToastContext notifications.
 */
export default function SignIn() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Plain React state for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Track which fields have lost focus
  const [touched, setTouched] = useState({});

  // Helper validation function
  const getFieldErrors = (values) => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email validation
    if (!values.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(values.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Password validation
    if (!values.password) {
      errs.password = 'Password is required.';
    }

    return errs;
  };

  // Compute errors and form validity
  const errors = getFieldErrors(formData);
  const isValid = Object.keys(errors).length === 0;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mark field as touched when user leaves the field
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields touched on submit
    setTouched({
      email: true,
      password: true,
    });

    // Block submission if invalid
    if (!isValid) return;

    // Login user with mock AuthContext
    login(formData.email.trim(), formData.password);

    // Show success toast notification
    showToast('Login successful! Welcome back.', 'success');

    // Clear form state
    setFormData({
      email: '',
      password: '',
    });
    setTouched({});

    // Navigate to dashboard
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <InputField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
              required
            />

            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              required
            />

            {/* Submit button disabled until the form is completely valid */}
            <button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary btn-auth-submit"
            >
              Sign In
            </button>
          </form>

          {/* Terms disclaimer */}
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

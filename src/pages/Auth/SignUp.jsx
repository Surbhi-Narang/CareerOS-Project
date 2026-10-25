import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import InputField from '../../components/form/InputField';
import './Auth.css';

/**
 * SignUp Page Component
 * Registration form with controlled InputField components,
 * plain React state validation (on blur & on submit), disabled submit when invalid,
 * clear form on success, and ToastContext notifications.
 */
export default function SignUp() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Plain React state for form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Track which fields have lost focus (blurred)
  const [touched, setTouched] = useState({});

  // Helper validation function for all fields
  const getFieldErrors = (values) => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Full name is required
    if (!values.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

    // Email format validation
    if (!values.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(values.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Password must be at least 8 characters with at least one number
    if (!values.password) {
      errs.password = 'Password is required.';
    } else if (values.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else if (!/\d/.test(values.password)) {
      errs.password = 'Password must contain at least one number.';
    }

    // Confirm password must match password
    if (!values.confirmPassword) {
      errs.confirmPassword = 'Confirm password is required.';
    } else if (values.confirmPassword !== values.password) {
      errs.confirmPassword = 'Passwords do not match.';
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

    // Mark all fields touched on submit attempt
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Block submission if form has errors
    if (!isValid) return;

    // Register user with mock AuthContext
    signup(formData.fullName.trim(), formData.email.trim(), formData.password);

    // Show success toast notification
    showToast('Account created successfully! Welcome to CareerOS.', 'success');

    // Clear form state
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join CareerOS to track your placement journey</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <InputField
              label="Full Name"
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullName ? errors.fullName : ''}
              required
            />

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
              placeholder="At least 8 chars with 1 number"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              required
            />

            <InputField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              required
            />

            {/* Submit button disabled until the form is completely valid */}
            <button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary btn-auth-submit"
            >
              Create Account
            </button>
          </form>

          {/* Terms disclaimer */}
          <p className="auth-disclaimer">
            By clicking "Create Account", I agree to the CareerOS Terms of Service and have read the Privacy Policy.
          </p>

          {/* Link to sign in */}
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

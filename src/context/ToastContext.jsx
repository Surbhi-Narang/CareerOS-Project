import React, { createContext, useContext, useState, useRef } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import './Toast.css';

// 1. Create the Toast Context
const ToastContext = createContext();

// 2. Custom hook to trigger toasts anywhere in the app
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// 3. Toast Provider component
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  // Show a toast message for 3 seconds
  // type can be 'success' or 'error'
  const showToast = (message, type = 'success') => {
    // Clear any existing timer so the toast doesn't disappear too early
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ message, type, id: Date.now() });

    // Automatically hide after 3 seconds (3000ms)
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Close toast manually when user clicks X
  const closeToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Render the popup notification at the top right */}
      {toast && (
        <div className="toast-container" aria-live="polite">
          <div className={`toast-popup toast-${toast.type}`} role="alert">
            {toast.type === 'error' ? (
              <AlertCircle size={20} className="toast-icon" />
            ) : (
              <CheckCircle2 size={20} className="toast-icon" />
            )}
            <span className="toast-message">{toast.message}</span>
            <button
              onClick={closeToast}
              className="toast-close-btn"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export default ToastContext;

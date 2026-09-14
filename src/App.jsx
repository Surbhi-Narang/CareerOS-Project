import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { CheckCircle2, Info } from 'lucide-react';

// Shared Layout Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Page Component Shells
import Landing from './pages/Landing/Landing';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import Jobs from './pages/Jobs/Jobs';
import JobDetail from './pages/Jobs/JobDetail';
import Tracker from './pages/Tracker/Tracker';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
import NotFound from './pages/NotFound/NotFound';

function AppContent() {
  const { authNotification } = useAuth();

  return (
    <>
      {/* Toast Notification Overlay */}
      {authNotification && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: authNotification.type === 'info' ? '#312E81' : '#065F46',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {authNotification.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}
          <span>{authNotification.message}</span>
        </div>
      )}

      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Protected Routes (Require mock auth login) */}
          <Route
            path="/interview-prep"
            element={
              <ProtectedRoute>
                <InterviewPrep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <Tracker />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

/**
 * App Component
 * Top-level application router setup wrapped with AuthProvider.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

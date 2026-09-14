import React, { createContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext(null);

/**
 * AuthProvider component providing mock user authentication state via localStorage.
 * Prepares structure for seamless Firebase Auth integration in PE-2.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('career_os_user', null);
  const [authNotification, setAuthNotification] = useState(null);

  const triggerNotification = (msg, type = 'success') => {
    setAuthNotification({ message: msg, type });
    setTimeout(() => setAuthNotification(null), 4000);
  };

  const login = (email, password) => {
    // Generate clean user profile from email or fallback
    const rawName = email.split('@')[0] || 'student';
    const formattedName = rawName
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const mockUser = {
      id: 'user_std_01',
      name: formattedName || 'Aarav Sharma',
      email: email || 'student@careeros.ac.in',
      college: 'Chitkara University, Punjab',
      branch: 'Computer Science & Engineering',
      graduationYear: '2026',
      careerGoal: 'Placement', // 'Placement' or 'Internship'
      targetRole: 'Full Stack Software Engineer',
      readinessScore: 78,
      githubUrl: 'https://github.com',
      leetcodeUrl: 'https://leetcode.com',
      linkedinUrl: 'https://linkedin.com',
      skills: ['React', 'Node.js', 'Data Structures', 'JavaScript', 'SQL', 'Git'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    setUser(mockUser);
    triggerNotification(`Welcome back, ${mockUser.name}! Signed in successfully.`);
    return true;
  };

  const signup = (name, email, branch = 'Computer Science & Engineering', password) => {
    const mockUser = {
      id: `user_${Date.now()}`,
      name: name || 'New Student',
      email: email || 'student@careeros.ac.in',
      college: 'Chitkara University, Punjab',
      branch: branch,
      graduationYear: '2026',
      careerGoal: 'Placement',
      targetRole: 'Software Development Engineer',
      readinessScore: 65,
      githubUrl: '',
      leetcodeUrl: '',
      linkedinUrl: '',
      skills: ['HTML/CSS', 'JavaScript', 'Python'],
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    };

    setUser(mockUser);
    triggerNotification(`Account created successfully! Welcome to CareerOS, ${mockUser.name}.`);
    return true;
  };

  const logout = () => {
    const prevName = user?.name || 'Student';
    setUser(null);
    triggerNotification(`Signed out successfully. See you soon, ${prevName}!`, 'info');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    authNotification,
    setAuthNotification,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

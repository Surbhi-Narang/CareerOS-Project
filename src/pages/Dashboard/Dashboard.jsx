import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { TrendingUp, Kanban, Target, Award, ArrowRight, UserCheck, Sparkles, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Dashboard.css';

/**
 * Dashboard Page Component (Teammate 2)
 * Profile greeting, weighted Readiness Score calculation (0-100), summary cards,
 * empty profile prompt banner, and quick action navigation cards to /jobs, /tracker, /interview-prep.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    // 1. Read profile from localStorage
    const savedProfile = localStorage.getItem('career_os_profile');
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (err) {
        console.error('Failed to parse career_os_profile', err);
      }
    }

    // 2. Read applications count from localStorage
    const savedApps = localStorage.getItem('career_os_applications');
    if (savedApps) {
      try {
        const parsedApps = JSON.parse(savedApps);
        if (Array.isArray(parsedApps)) {
          setApplicationsCount(parsedApps.length);
        }
      } catch (err) {
        console.error('Failed to parse career_os_applications', err);
      }
    } else {
      // Default sample applications count for PE-1 preview if empty
      setApplicationsCount(3);
    }
  }, []);

  // Compute profile name fallback
  const studentName = profileData?.fullName || user?.name || 'Student';

  // Calculate Profile Completeness % (0 - 100%)
  const calculateCompleteness = () => {
    if (!profileData) return 35; // Default initial score before saving profile

    let filledFields = 0;
    const totalFields = 8; // fullName, phone, avatarUrl, college, branch, currentYear, location, careerGoal

    if (profileData.fullName) filledFields++;
    if (profileData.phone) filledFields++;
    if (profileData.avatarUrl) filledFields++;
    if (profileData.college) filledFields++;
    if (profileData.branch) filledFields++;
    if (profileData.currentYear) filledFields++;
    if (profileData.location) filledFields++;
    if (profileData.careerGoal) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const completenessPercentage = calculateCompleteness();
  const skillsCount = profileData?.skills?.length || (user?.skills?.length || 3);

  // Calculate Weighted Readiness Score (0 - 100)
  // Formula:
  // - Profile Completeness: up to 30 pts
  // - Skills Added: 5 pts per skill up to 30 pts
  // - External Links: 10 pts per link (GitHub, LeetCode, LinkedIn) up to 30 pts
  // - Applications Tracked: 10 pts if apps > 0
  const calculateReadinessScore = () => {
    let score = 0;

    // 1. Profile Completeness (max 30)
    score += Math.round((completenessPercentage / 100) * 30);

    // 2. Skills (max 30)
    const skillsPts = Math.min(skillsCount * 6, 30);
    score += skillsPts;

    // 3. External Links (max 30)
    let linksPts = 0;
    if (profileData?.githubUrl || user?.githubUrl) linksPts += 10;
    if (profileData?.leetcodeUrl || user?.leetcodeUrl) linksPts += 10;
    if (profileData?.linkedinUrl || user?.linkedinUrl) linksPts += 10;
    score += linksPts;

    // 4. Applications Tracked (max 10)
    if (applicationsCount > 0) score += 10;

    return Math.min(score, 100);
  };

  const readinessScore = calculateReadinessScore();

  // Readiness Score Badge Label Logic
  const getReadinessLabel = (score, completeness) => {
    if (completeness >= 100) {
      if (score >= 70) {
        return { text: 'On Track', color: 'success' };
      }
      return { text: 'Add More Skills', color: 'warning' };
    }

    if (score >= 70) {
      return { text: 'Great Progress', color: 'success' };
    }
    if (score >= 50) {
      return { text: 'Moderate Readiness', color: 'warning' };
    }
    return { text: 'Needs Profile Setup', color: 'error' };
  };

  const readinessTag = getReadinessLabel(readinessScore, completenessPercentage);

  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        {/* Header Greeting */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back, <span className="text-primary-gradient">{studentName}!</span>
            </h1>
            <p className="dashboard-subtitle">
              Here is your placement readiness overview and active progress.
            </p>
          </div>

          <Link to="/profile" className="btn btn-outline btn-edit-profile">
            <UserCheck size={18} />
            <span>Manage Profile</span>
          </Link>
        </div>

        {/* Empty State Banner (If profile is missing or < 50% complete) */}
        {completenessPercentage < 50 && (
          <div className="dashboard-prompt-card">
            <div className="prompt-content">
              <AlertCircle size={24} className="prompt-icon" />
              <div>
                <h3 className="prompt-title">Complete your student profile</h3>
                <p className="prompt-desc">
                  Add your college details, target role, coding handles, and skills to unlock accurate readiness score and custom job suggestions.
                </p>
              </div>
            </div>
            <Link to="/profile" className="btn btn-primary prompt-btn">
              Complete Profile
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Hero Score & Summary Cards Row */}
        <div className="dashboard-top-grid">
          {/* Readiness Score Card (Matching Landing Style Widget) */}
          <div className="dashboard-card score-card">
            <div className="score-card-header">
              <div>
                <span className="score-card-subtitle">CAREER READINESS METRIC</span>
                <h2 className="score-card-title">Placement Readiness Score</h2>
              </div>
              <span className={`score-tag tag-${readinessTag.color}`}>
                <TrendingUp size={14} />
                {readinessTag.text}
              </span>
            </div>

            <div className="score-card-body">
              <div className="score-display">
                <span className="score-number">{readinessScore}</span>
                <span className="score-max">/100</span>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>

              <div className="score-breakdown">
                <span>Profile: {completenessPercentage}%</span>
                <span>•</span>
                <span>Skills: {skillsCount} added</span>
                <span>•</span>
                <span>Apps: {applicationsCount} tracked</span>
              </div>
            </div>
          </div>

          {/* 3 Key Metrics Summary Stack */}
          <div className="summary-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-box box-indigo">
                <Kanban size={20} />
              </div>
              <div>
                <h3 className="metric-value">{applicationsCount} Active</h3>
                <p className="metric-label">Applications Tracked</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box box-amber">
                <Award size={20} />
              </div>
              <div>
                <h3 className="metric-value">{skillsCount} Verified</h3>
                <p className="metric-label">Technical Skills</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box box-emerald">
                <Target size={20} />
              </div>
              <div>
                <h3 className="metric-value">{completenessPercentage}%</h3>
                <p className="metric-label">Profile Completeness</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards Grid */}
        <div className="quick-nav-section">
          <h2 className="section-title-sm">Quick Workspace Tools</h2>

          <div className="quick-nav-grid">
            {/* Card 1: Job Suggestions */}
            <div className="nav-tool-card">
              <div className="tool-card-icon-box icon-purple">
                <Sparkles size={24} />
              </div>
              <h3 className="tool-card-title">Job Suggestions & Matching</h3>
              <p className="tool-card-desc">
                Explore curated job listings pre-filtered by your branch defaults, target role, and preferred location.
              </p>
              <Link to="/jobs" className="btn btn-outline tool-card-btn">
                <span>Explore Jobs</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Application Tracker */}
            <div className="nav-tool-card">
              <div className="tool-card-icon-box icon-indigo">
                <Kanban size={24} />
              </div>
              <h3 className="tool-card-title">Application Pipeline Tracker</h3>
              <p className="tool-card-desc">
                Monitor your 7-stage application timeline from Applied to Online Assessment and Final Offer.
              </p>
              <Link to="/tracker" className="btn btn-outline tool-card-btn">
                <span>Open Tracker</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3: Interview Prep */}
            <div className="nav-tool-card">
              <div className="tool-card-icon-box icon-emerald">
                <BookOpen size={24} />
              </div>
              <h3 className="tool-card-title">Interview Prep Portal</h3>
              <p className="tool-card-desc">
                Master company-wise previous question banks, curated DSA practice sheet, and tech interview guides.
              </p>
              <Link to="/interview-prep" className="btn btn-outline tool-card-btn">
                <span>Start Practice</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Kanban, Building, MapPin, DollarSign, Calendar, Trash2, StickyNote, Plus, ChevronRight, CheckCircle2, AlertTriangle, PartyPopper } from 'lucide-react';
import ApplicationStepper from './ApplicationStepper';
import './Tracker.css';

const DEFAULT_STAGES = [
  'Applied',
  'Resume Shortlisted',
  'Online Assessment',
  'Interview Round 1',
  'Interview Round 2',
  'HR Round',
  'Final Result',
];

const SAMPLE_APPLICATIONS = [
  {
    id: 'app_sample_1',
    jobTitle: 'Frontend Developer Intern',
    company: 'TechNova Solutions',
    location: 'Bengaluru, India',
    salary: '₹25,000 / month',
    appliedDate: 'Sep 10, 2026',
    status: 'Interview Round 1',
    currentStageIndex: 3,
    isRejected: false,
    isOfferReceived: false,
    notes: {
      0: 'Applied via CareerOS portal',
      1: 'Shortlisted by HR team on Sep 11',
      2: 'Scored 92% in Online Assessment (React & JS)',
      3: 'Technical Interview R1 scheduled for Sep 15',
    },
    stages: DEFAULT_STAGES,
  },
  {
    id: 'app_sample_2',
    jobTitle: 'Software Engineer (SDE-1)',
    company: 'CloudScale Systems',
    location: 'Hyderabad, India',
    salary: '₹12 - 15 LPA',
    appliedDate: 'Sep 08, 2026',
    status: 'Online Assessment',
    currentStageIndex: 2,
    isRejected: false,
    isOfferReceived: false,
    notes: {
      0: 'Applied directly on careers portal',
      2: 'OA link received - 3 LeetCode Medium questions on Trees & DP',
    },
    stages: DEFAULT_STAGES,
  },
];

/**
 * Tracker Page Component (Teammate 3)
 * Application Pipeline Stepper tracker displaying 7-stage vertical stepper, stage controls,
 * private notes per stage, and localStorage persistence ('career_os_applications').
 */
export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [activeNoteStage, setActiveNoteStage] = useState({}); // Track which app has notes box open

  // Load applications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('career_os_applications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApplications(parsed);
        } else {
          // Fallback to sample apps if empty
          setApplications(SAMPLE_APPLICATIONS);
          localStorage.setItem('career_os_applications', JSON.stringify(SAMPLE_APPLICATIONS));
        }
      } catch (err) {
        console.error('Failed to parse career_os_applications', err);
        setApplications(SAMPLE_APPLICATIONS);
      }
    } else {
      setApplications(SAMPLE_APPLICATIONS);
      localStorage.setItem('career_os_applications', JSON.stringify(SAMPLE_APPLICATIONS));
    }
  }, []);

  // Sync state to localStorage helper
  const saveApplications = (updatedApps) => {
    setApplications(updatedApps);
    localStorage.setItem('career_os_applications', JSON.stringify(updatedApps));
  };

  // Update Application Stage
  const handleStageUpdate = (appId, selectedValue) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;

      const stages = app.stages || DEFAULT_STAGES;

      if (selectedValue === 'REJECTED') {
        return {
          ...app,
          isRejected: true,
          isOfferReceived: false,
          status: 'Process Ended',
        };
      }

      if (selectedValue === 'OFFER') {
        return {
          ...app,
          isRejected: false,
          isOfferReceived: true,
          currentStageIndex: 6,
          status: 'Offer Received',
        };
      }

      const newIndex = parseInt(selectedValue, 10);
      return {
        ...app,
        isRejected: false,
        isOfferReceived: false,
        currentStageIndex: newIndex,
        status: stages[newIndex] || 'In Progress',
      };
    });

    saveApplications(updated);
  };

  // Update Note per Stage
  const handleNoteChange = (appId, stageIdx, noteText) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;
      const currentNotes = app.notes || {};
      return {
        ...app,
        notes: {
          ...currentNotes,
          [stageIdx]: noteText,
        },
      };
    });

    saveApplications(updated);
  };

  // Delete Application
  const handleDeleteApp = (appId) => {
    const updated = applications.filter((app) => app.id !== appId);
    saveApplications(updated);
  };

  return (
    <div className="tracker-page">
      <div className="container tracker-container">
        {/* Page Header */}
        <div className="tracker-header">
          <div>
            <span className="tracker-badge">
              <Kanban size={14} /> Application Pipeline Stepper
            </span>
            <h1 className="tracker-title">Track Application Progress</h1>
            <p className="tracker-subtitle">
              Manage your 7-stage placement pipeline, record stage notes, and track offers in real-time.
            </p>
          </div>

          <Link to="/jobs" className="btn btn-primary btn-add-job">
            <Plus size={18} />
            <span>Apply to New Jobs</span>
          </Link>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="tracker-empty-card text-center">
            <Kanban size={44} className="empty-icon" />
            <h3 className="empty-title">No applications tracked yet</h3>
            <p className="empty-desc">
              Head to the Jobs Portal, explore verified campus roles, and click "Apply Now" to start tracking your recruitment pipeline.
            </p>
            <Link to="/jobs" className="btn btn-primary mt-3">
              Explore Jobs & Apply
              <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="tracker-apps-list">
            {applications.map((app) => {
              const stages = app.stages || DEFAULT_STAGES;
              const activeIndex = app.currentStageIndex ?? 0;
              const activeNote = app.notes?.[activeIndex] || '';

              return (
                <div key={app.id} className="tracker-app-card">
                  {/* Card Top Header */}
                  <div className="app-card-header">
                    <div className="app-company-info">
                      <div className="app-logo-box">
                        <Building size={22} />
                      </div>
                      <div>
                        <h2 className="app-job-title">{app.jobTitle}</h2>
                        <p className="app-company-name">{app.company}</p>
                      </div>
                    </div>

                    {/* Status Dropdown Controls */}
                    <div className="app-actions-row">
                      <div className="stage-select-wrapper">
                        <label className="select-label">Update Stage:</label>
                        <select
                          className="stage-select-dropdown"
                          value={
                            app.isRejected
                              ? 'REJECTED'
                              : app.isOfferReceived
                              ? 'OFFER'
                              : activeIndex
                          }
                          onChange={(e) => handleStageUpdate(app.id, e.target.value)}
                        >
                          {stages.map((stg, idx) => (
                            <option key={idx} value={idx}>
                              Stage {idx + 1}: {stg}
                            </option>
                          ))}
                          <option value="OFFER">🎉 Offer Received</option>
                          <option value="REJECTED">❌ Mark as Rejected / Ended</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteApp(app.id)}
                        className="btn-delete-app"
                        title="Remove Application"
                        aria-label="Remove Application"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="app-meta-row">
                    <span className="meta-item">
                      <MapPin size={14} className="meta-icon" /> {app.location || 'India'}
                    </span>
                    <span className="meta-item">
                      <DollarSign size={14} className="meta-icon" /> {app.salary || 'Standard'}
                    </span>
                    <span className="meta-item">
                      <Calendar size={14} className="meta-icon" /> Applied on {app.appliedDate || 'Recently'}
                    </span>
                  </div>

                  {/* 7-Stage Stepper Component */}
                  <div className="stepper-wrapper">
                    <ApplicationStepper
                      stages={stages}
                      currentStageIndex={activeIndex}
                      isRejected={app.isRejected}
                      isOfferReceived={app.isOfferReceived}
                    />
                  </div>

                  {/* Private Stage Note Input */}
                  <div className="stage-note-box">
                    <div className="note-box-header">
                      <StickyNote size={16} className="note-icon" />
                      <span className="note-title">
                        Private Note for {app.isRejected ? 'Process Ended' : stages[activeIndex]}:
                      </span>
                    </div>
                    <input
                      type="text"
                      className="note-input"
                      placeholder="Add private interview notes, test date, or HR instructions..."
                      value={activeNote}
                      onChange={(e) => handleNoteChange(app.id, activeIndex, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

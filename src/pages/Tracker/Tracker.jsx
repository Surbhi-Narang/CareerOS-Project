import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Kanban, Building, MapPin, DollarSign, Calendar, Trash2, StickyNote, Plus, ChevronRight, CheckCircle2, AlertTriangle, PartyPopper, ExternalLink } from 'lucide-react';
import ApplicationStepper from './ApplicationStepper';
import Modal from '../../components/Modal/Modal';
import InputField from '../../components/form/InputField';
import { useToast } from '../../context/ToastContext';
import {
  DEFAULT_STAGES,
  selectApplications,
  addApplication,
  updateStage,
  deleteApplication,
  updateNote,
} from '../../store/applicationsSlice';
import './Tracker.css';

/**
 * Tracker Page Component (Teammate 3)
 * Application Pipeline Stepper tracker displaying 7-stage vertical stepper, stage controls,
 * private notes per stage, and Add Application modal form with full validation.
 */
export default function Tracker() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const applications = useSelector(selectApplications);

  // Modal and Form state for Add Application
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appFormData, setAppFormData] = useState({
    company: '',
    jobTitle: '',
    appliedDate: new Date().toISOString().split('T')[0],
    jobUrl: '',
  });
  const [appTouched, setAppTouched] = useState({});

  // URL format validator (optional field, but must be valid if entered)
  const isValidUrl = (urlStr) => {
    try {
      const parsed = new URL(urlStr);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Plain React validation rules
  const getAppFormErrors = (values) => {
    const errs = {};
    if (!values.company.trim()) {
      errs.company = 'Company name is required.';
    }
    if (!values.jobTitle.trim()) {
      errs.jobTitle = 'Job title is required.';
    }
    if (!values.appliedDate) {
      errs.appliedDate = 'Applied date is required.';
    }
    if (values.jobUrl.trim() && !isValidUrl(values.jobUrl.trim())) {
      errs.jobUrl = 'Please enter a valid URL (starting with http:// or https://).';
    }
    return errs;
  };

  const appErrors = getAppFormErrors(appFormData);
  const isAppFormValid = Object.keys(appErrors).length === 0;

  // Input change handler
  const handleAppChange = (e) => {
    const { name, value } = e.target;
    setAppFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Blur handler
  const handleAppBlur = (e) => {
    const { name } = e.target;
    setAppTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Close modal and reset touched
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setAppTouched({});
  };

  // Submit new application handler
  const handleCreateApplication = (e) => {
    e.preventDefault();

    // Mark all fields touched
    setAppTouched({
      company: true,
      jobTitle: true,
      appliedDate: true,
      jobUrl: true,
    });

    if (!isAppFormValid) return;

    const newApp = {
      id: `app_${Date.now()}`,
      jobTitle: appFormData.jobTitle.trim(),
      company: appFormData.company.trim(),
      appliedDate: appFormData.appliedDate,
      jobUrl: appFormData.jobUrl.trim() || undefined,
      location: 'Remote / Onsite',
      salary: 'Competitive Stipend',
      status: 'Applied',
      currentStageIndex: 0,
      isRejected: false,
      isOfferReceived: false,
      notes: {
        0: appFormData.jobUrl.trim()
          ? `Application link: ${appFormData.jobUrl.trim()}`
          : 'Applied directly through company portal',
      },
      stages: DEFAULT_STAGES,
    };

    dispatch(addApplication(newApp));
    showToast(`Application for ${newApp.company} added successfully!`, 'success');

    // Clear form state
    setAppFormData({
      company: '',
      jobTitle: '',
      appliedDate: new Date().toISOString().split('T')[0],
      jobUrl: '',
    });
    setAppTouched({});
    setIsAddModalOpen(false);
  };

  // Update Application Stage
  const handleStageUpdate = (appId, selectedValue) => {
    dispatch(updateStage({ id: appId, selectedValue }));
    let stageName = 'In Progress';
    if (selectedValue === 'OFFER') stageName = 'Offer Received 🎉';
    else if (selectedValue === 'REJECTED') stageName = 'Process Ended';
    else stageName = DEFAULT_STAGES[parseInt(selectedValue, 10)] || 'Updated';
    showToast(`Application stage updated to: ${stageName}`, 'success');
  };

  // Update Note per Stage
  const handleNoteChange = (appId, stageIdx, noteText) => {
    dispatch(updateNote({ id: appId, stageIdx, noteText }));
  };

  // Delete Application
  const handleDeleteApp = (appId) => {
    dispatch(deleteApplication(appId));
    showToast('Application deleted successfully.', 'error');
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

          <div className="tracker-header-actions">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-add-app"
            >
              <Plus size={18} />
              <span>Add Application</span>
            </button>
            <Link to="/jobs" className="btn btn-outline btn-explore-jobs">
              <span>Explore Jobs</span>
            </Link>
          </div>
        </div>

        {/* Add Application Modal Form */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
          title="Add New Application"
        >
          <form onSubmit={handleCreateApplication} noValidate className="add-app-form">
            <InputField
              label="Company Name"
              id="company"
              name="company"
              placeholder="e.g. Google, TechNova Solutions"
              value={appFormData.company}
              onChange={handleAppChange}
              onBlur={handleAppBlur}
              error={appTouched.company ? appErrors.company : ''}
              required
            />

            <InputField
              label="Job Title"
              id="jobTitle"
              name="jobTitle"
              placeholder="e.g. Frontend Engineer, SDE Intern"
              value={appFormData.jobTitle}
              onChange={handleAppChange}
              onBlur={handleAppBlur}
              error={appTouched.jobTitle ? appErrors.jobTitle : ''}
              required
            />

            <InputField
              label="Applied Date"
              id="appliedDate"
              name="appliedDate"
              type="date"
              value={appFormData.appliedDate}
              onChange={handleAppChange}
              onBlur={handleAppBlur}
              error={appTouched.appliedDate ? appErrors.appliedDate : ''}
              required
            />

            <InputField
              label="Job URL (Optional)"
              id="jobUrl"
              name="jobUrl"
              type="url"
              placeholder="https://company.com/careers/role-123"
              value={appFormData.jobUrl}
              onChange={handleAppChange}
              onBlur={handleAppBlur}
              error={appTouched.jobUrl ? appErrors.jobUrl : ''}
            />

            <div className="modal-form-actions">
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isAppFormValid}
                className="btn btn-primary"
              >
                Add Application
              </button>
            </div>
          </form>
        </Modal>

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

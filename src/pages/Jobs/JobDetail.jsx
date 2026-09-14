import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Sparkles, ExternalLink, CheckCircle2, X, Briefcase } from 'lucide-react';
import jobsData from '../../data/jobs.json';
import './JobDetail.css';

/**
 * JobDetail Page Component (Dynamic Route: /jobs/:jobId)
 * Displays complete job posting details using useParams(),
 * with Apply Now modal flow & persistence to 'career_os_applications'.
 */
export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Find job matching URL param jobId
  const job = jobsData.find((j) => j.id === jobId);

  const handleApplyClick = () => {
    if (!job) return;
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    setShowApplyModal(true);
  };

  const handleConfirmApplied = () => {
    if (!job) return;

    const savedApps = localStorage.getItem('career_os_applications');
    let apps = [];
    if (savedApps) {
      try {
        apps = JSON.parse(savedApps);
      } catch (e) {
        apps = [];
      }
    }

    const exists = apps.some((app) => app.jobId === job.id);
    if (!exists) {
      const newApp = {
        id: `app_${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        mode: job.mode,
        type: job.type,
        appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Applied',
        currentStageIndex: 0,
        notes: {},
        stages: [
          'Applied',
          'Resume Shortlisted',
          'Online Assessment',
          'Interview Round 1',
          'Interview Round 2',
          'HR Round',
          'Final Result',
        ],
      };

      const updated = [newApp, ...apps];
      localStorage.setItem('career_os_applications', JSON.stringify(updated));
      triggerToast(`Marked "${job.title}" at ${job.company} as Applied!`);
    } else {
      triggerToast(`Already tracking application for "${job.title}".`);
    }

    setShowApplyModal(false);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  if (!job) {
    return (
      <div className="job-detail-page">
        <div className="container">
          <Link to="/jobs" className="back-link">
            <ArrowLeft size={16} /> Back to All Jobs
          </Link>
          <div className="job-not-found-card">
            <Briefcase size={48} className="empty-icon" />
            <h2>Job Listing Not Found</h2>
            <p>The job opportunity with ID "{jobId}" could not be found or may have expired.</p>
            <button onClick={() => navigate('/jobs')} className="btn btn-primary mt-3">
              Browse Available Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <div className="container job-detail-container">
        {/* Back Link */}
        <Link to="/jobs" className="back-link">
          <ArrowLeft size={16} /> Back to Jobs
        </Link>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="jobs-toast" role="alert">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Job Detail Card */}
        <div className="job-detail-card">
          <div className="detail-header-top">
            <div className="detail-company-logo">
              <Building size={32} />
            </div>
            <div className="detail-title-group">
              <span className="detail-company-name">{job.company}</span>
              <h1 className="detail-job-title">{job.title}</h1>
              <div className="detail-badges-row">
                <span className={`job-type-badge ${job.type === 'Internship' ? 'badge-intern' : 'badge-placement'}`}>
                  {job.type}
                </span>
                <span className="job-mode-badge">{job.mode}</span>
                <span className="job-posted-time">
                  <Clock size={14} /> Posted {job.postedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-meta-grid">
            <div className="meta-box">
              <MapPin size={20} className="meta-icon" />
              <div>
                <span className="meta-label">Location</span>
                <p className="meta-val">{job.location}</p>
              </div>
            </div>

            <div className="meta-box">
              <DollarSign size={20} className="meta-icon" />
              <div>
                <span className="meta-label">Salary / Stipend</span>
                <p className="meta-val font-semibold">{job.salary}</p>
              </div>
            </div>

            <div className="meta-box">
              <Briefcase size={20} className="meta-icon" />
              <div>
                <span className="meta-label">Workplace Model</span>
                <p className="meta-val">{job.mode} Opportunity</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-heading">Role Overview & Description</h3>
            <p className="detail-desc-text">{job.description}</p>
          </div>

          <div className="detail-section">
            <h3 className="section-heading">Required Skills & Tech Stack</h3>
            <div className="detail-skills-tags">
              {job.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-footer-actions">
            <button onClick={handleApplyClick} className="btn btn-primary btn-apply-lg">
              <span>Apply Now on Official Portal</span>
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {showApplyModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Opened Application Page</h3>
              <button onClick={() => setShowApplyModal(false)} className="modal-close-btn" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-question">Did you submit your application for this role?</p>
              <div className="modal-job-summary">
                <p className="summary-job-title">{job.title}</p>
                <p className="summary-job-company">{job.company} • {job.location}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleConfirmApplied} className="btn btn-primary modal-btn-confirm">
                <CheckCircle2 size={16} />
                <span>Yes, Mark as Applied</span>
              </button>
              <button onClick={() => setShowApplyModal(false)} className="btn btn-outline modal-btn-cancel">
                Just Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

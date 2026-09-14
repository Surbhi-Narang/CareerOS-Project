import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Filter, ExternalLink, CheckCircle2, RotateCcw, Building, Sparkles, X, Clock, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import jobsData from '../../data/jobs.json';
import './Jobs.css';

/**
 * Custom Dropdown Component
 * Ensures 100% pixel-perfect sizing, height (50px), padding (16px), and font-size (1rem)
 * matching between CLOSED collapsed trigger button and OPEN list items.
 */
function CustomDropdown({ icon: Icon, label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="filter-group" ref={dropdownRef}>
      <label className="filter-label">
        {Icon && <Icon size={14} className="filter-label-icon" />}
        <span>{label}</span>
      </label>
      <div className={`custom-dropdown ${isOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className="custom-dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="dropdown-trigger-label">{selectedOption.label}</span>
          <ChevronDown size={18} className={`dropdown-chevron ${isOpen ? 'is-rotated' : ''}`} />
        </button>

        {isOpen && (
          <div className="custom-dropdown-menu" role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`custom-dropdown-option ${option.value === value ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={option.value === value}
              >
                <span>{option.label}</span>
                {option.value === value && <Check size={16} className="option-check-icon" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Jobs Page Component (Teammate 3)
 * Job & Internship discovery portal with multi-criteria filtering,
 * modal apply flow, and automatic localStorage persistence ('career_os_applications').
 */
export default function Jobs() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('All'); // 'All' | 'Remote' | 'Onsite' | 'Hybrid'
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'Internship' | 'Full-time Placement'
  const [sortBy, setSortBy] = useState('Newest'); // 'Newest' | 'Salary'

  // Syllabus Topic: useRef for auto-focusing search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Syllabus Topic: useCallback to memoize search and filter change handlers
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleModeChange = useCallback((val) => {
    setSelectedMode(val);
  }, []);

  const handleTypeChange = useCallback((val) => {
    setSelectedType(val);
  }, []);

  const handleSortChange = useCallback((val) => {
    setSortBy(val);
  }, []);

  const modeOptions = [
    { value: 'All', label: 'All Modes' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Onsite', label: 'Onsite' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];

  const typeOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Full-time Placement', label: 'Full-time Placement' },
  ];

  const sortOptions = [
    { value: 'Newest', label: 'Newest First' },
    { value: 'Salary', label: 'Highest Salary / Stipend' },
  ];

  // Apply Modal state
  const [activeApplyJob, setActiveApplyJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Syllabus Topic: useMemo to memoize filtered + sorted jobs list
  const filteredJobs = useMemo(() => {
    return jobsData
      .filter((job) => {
        // 1. Text search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.skills.some((s) => s.toLowerCase().includes(query));

        // 2. Mode filter
        const matchesMode = selectedMode === 'All' || job.mode.toLowerCase() === selectedMode.toLowerCase();

        // 3. Type filter
        const matchesType = selectedType === 'All' || job.type.toLowerCase() === selectedType.toLowerCase();

        return matchesQuery && matchesMode && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'Salary') {
          // Approximate numerical sort by salary/stipend text
          const numA = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
          const numB = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
          return numB - numA;
        }
        return a.id.localeCompare(b.id);
      });
  }, [searchQuery, selectedMode, selectedType, sortBy]);

  // Handle Apply button click
  const handleApplyClick = (job) => {
    // 1. Open external job link in new window
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');

    // 2. Open confirmation modal
    setActiveApplyJob(job);
    setShowApplyModal(true);
  };

  // Confirm Mark as Applied
  const handleConfirmApplied = () => {
    if (!activeApplyJob) return;

    // Get existing apps from localStorage
    const savedApps = localStorage.getItem('career_os_applications');
    let apps = [];
    if (savedApps) {
      try {
        apps = JSON.parse(savedApps);
      } catch (e) {
        apps = [];
      }
    }

    // Prevent duplicate application tracking for same job
    const exists = apps.some((app) => app.jobId === activeApplyJob.id);
    if (!exists) {
      const newApp = {
        id: `app_${Date.now()}`,
        jobId: activeApplyJob.id,
        jobTitle: activeApplyJob.title,
        company: activeApplyJob.company,
        location: activeApplyJob.location,
        salary: activeApplyJob.salary,
        mode: activeApplyJob.mode,
        type: activeApplyJob.type,
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

      triggerToast(`Marked "${activeApplyJob.title}" at ${activeApplyJob.company} as Applied!`);
    } else {
      triggerToast(`Already tracking application for "${activeApplyJob.title}".`);
    }

    setShowApplyModal(false);
    setActiveApplyJob(null);
  };

  const handleJustBrowsing = () => {
    setShowApplyModal(false);
    setActiveApplyJob(null);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMode('All');
    setSelectedType('All');
    setSortBy('Newest');
  };

  return (
    <div className="jobs-page">
      <div className="container jobs-container">
        {/* Page Header */}
        <div className="jobs-header">
          <div>
            <span className="jobs-badge">
              <Sparkles size={14} /> Campus Placement & Internship Hub
            </span>
            <h1 className="jobs-title">Explore Verified Job Opportunities</h1>
            <p className="jobs-subtitle">
              Discover active job roles matched with your profile preferences and target skills.
            </p>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="jobs-toast" role="alert">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Bar Controls */}
        <div className="jobs-filter-card">
          <div className="filter-search-box">
            <Search size={20} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="filter-search-input"
              placeholder="Search by job title, company, or skills (e.g. React, Node, SDE)..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-options-row">
            <CustomDropdown
              icon={MapPin}
              label="Workplace Mode"
              options={modeOptions}
              value={selectedMode}
              onChange={handleModeChange}
            />

            <CustomDropdown
              icon={Briefcase}
              label="Opportunity Type"
              options={typeOptions}
              value={selectedType}
              onChange={handleTypeChange}
            />

            <CustomDropdown
              icon={ArrowUpDown}
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
            />

            {(searchQuery || selectedMode !== 'All' || selectedType !== 'All' || sortBy !== 'Newest') && (
              <button onClick={resetFilters} className="btn btn-outline btn-reset-filters">
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Job Listings Grid */}
        {filteredJobs.length === 0 ? (
          <div className="jobs-empty-card text-center">
            <Filter size={40} className="empty-icon" />
            <h3 className="empty-title">No jobs match your active filters</h3>
            <p className="empty-desc">Try clearing your search query or broadening workplace mode and opportunity type filters.</p>
            <button onClick={resetFilters} className="btn btn-primary mt-3">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-card job-card-clickable"
                onClick={() => navigate(`/jobs/${job.id}`)}
                title="Click to view full job details"
              >
                <div className="job-card-top">
                  <div className="company-logo-box">
                    <Building size={22} />
                  </div>
                  <div className="job-card-header">
                    <span className="job-company-name">{job.company}</span>
                    <h2 className="job-card-title">{job.title}</h2>
                  </div>
                </div>

                <div className="job-badges-row">
                  <span className={`job-type-badge ${job.type === 'Internship' ? 'badge-intern' : 'badge-placement'}`}>
                    {job.type}
                  </span>
                  <span className="job-mode-badge">{job.mode}</span>
                  <span className="job-posted-time">
                    <Clock size={12} /> {job.postedDate}
                  </span>
                </div>

                <p className="job-card-desc">{job.description}</p>

                <div className="job-details-row">
                  <div className="job-detail-item">
                    <MapPin size={14} className="detail-icon" />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail-item">
                    <DollarSign size={14} className="detail-icon" />
                    <span className="font-semibold">{job.salary}</span>
                  </div>
                </div>

                {/* Skill Tags */}
                <div className="job-skills-tags">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag-pill">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Apply Button */}
                <div className="job-card-footer">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering card navigation
                      handleApplyClick(job);
                    }}
                    className="btn btn-primary btn-job-apply"
                  >
                    <span>Apply Now</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Confirmation Modal */}
      {showApplyModal && activeApplyJob && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Opened Application Page</h3>
              <button onClick={handleJustBrowsing} className="modal-close-btn" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-question">Did you submit your application for this role?</p>
              <div className="modal-job-summary">
                <p className="summary-job-title">{activeApplyJob.title}</p>
                <p className="summary-job-company">{activeApplyJob.company} • {activeApplyJob.location}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleConfirmApplied} className="btn btn-primary modal-btn-confirm">
                <CheckCircle2 size={16} />
                <span>Yes, Mark as Applied</span>
              </button>
              <button onClick={handleJustBrowsing} className="btn btn-outline modal-btn-cancel">
                Just Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

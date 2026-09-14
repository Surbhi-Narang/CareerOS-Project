import React, { useState, useEffect, useMemo } from 'react';
import { HelpCircle, Code2, BookOpen, Search, ExternalLink, CheckSquare, Square, Building, Filter, Sparkles, CheckCircle2, RotateCcw, Youtube, FileText, GraduationCap } from 'lucide-react';
import questionsData from '../../data/questions.json';
import dsaSheetData from '../../data/dsaSheet.json';
import resourcesData from '../../data/resources.json';
import './InterviewPrep.css';

/**
 * InterviewPrep Page Component (Teammate 4)
 * 3-Tab Portal: Company-wise Question Bank, Curated DSA Sheet with localStorage solved state ('career_os_dsa_solved'),
 * and Categorized Learning Resources. Filters start empty by default so content displays immediately.
 */
export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'dsa' | 'resources'

  // Tab 1: Company Questions State
  const [companyFilter, setCompanyFilter] = useState('All');
  const [questionSearch, setQuestionSearch] = useState('');

  // Tab 2: DSA Sheet State
  const [dsaTopicFilter, setDsaTopicFilter] = useState('All');
  const [dsaDifficultyFilter, setDsaDifficultyFilter] = useState('All');
  const [dsaSearch, setDsaSearch] = useState('');
  const [solvedDsaIds, setSolvedDsaIds] = useState([]);

  // Tab 3: Resource Links State
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState('All');
  const [resourceSearch, setResourceSearch] = useState('');

  // Load solved DSA problem IDs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('career_os_dsa_solved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSolvedDsaIds(parsed);
        }
      } catch (e) {
        console.error('Failed to parse career_os_dsa_solved', e);
      }
    } else {
      // Pre-check 2 sample problems on first view if empty
      const initialSolved = ['dsa_1', 'dsa_2'];
      setSolvedDsaIds(initialSolved);
      localStorage.setItem('career_os_dsa_solved', JSON.stringify(initialSolved));
    }
  }, []);

  // Toggle DSA problem solved checkbox & persist to localStorage
  const toggleDsaSolved = (id) => {
    let updated;
    if (solvedDsaIds.includes(id)) {
      updated = solvedDsaIds.filter((item) => item !== id);
    } else {
      updated = [...solvedDsaIds, id];
    }
    setSolvedDsaIds(updated);
    localStorage.setItem('career_os_dsa_solved', JSON.stringify(updated));
  };

  // Filtered Company Questions (Starts empty by default -> shows all)
  const filteredQuestions = useMemo(() => {
    return questionsData.filter((item) => {
      const matchesCompany = companyFilter === 'All' || item.company === companyFilter;
      const q = questionSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q);
      return matchesCompany && matchesSearch;
    });
  }, [companyFilter, questionSearch]);

  // Filtered DSA Problems (Starts empty by default -> shows all)
  const filteredDsaProblems = useMemo(() => {
    return dsaSheetData.filter((item) => {
      const matchesTopic = dsaTopicFilter === 'All' || item.topic === dsaTopicFilter;
      const matchesDiff = dsaDifficultyFilter === 'All' || item.difficulty === dsaDifficultyFilter;
      const q = dsaSearch.toLowerCase().trim();
      const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.topic.toLowerCase().includes(q);
      return matchesTopic && matchesDiff && matchesSearch;
    });
  }, [dsaTopicFilter, dsaDifficultyFilter, dsaSearch]);

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resourcesData.filter((item) => {
      const matchesCat = resourceCategoryFilter === 'All' || item.category === resourceCategoryFilter;
      const q = resourceSearch.toLowerCase().trim();
      const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [resourceCategoryFilter, resourceSearch]);

  // DSA Solved Metrics
  const dsaTotalCount = dsaSheetData.length;
  const dsaSolvedCount = solvedDsaIds.length;
  const dsaProgressPercent = Math.round((dsaSolvedCount / dsaTotalCount) * 100) || 0;

  // Extract unique companies & topics for select options
  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(questionsData.map((q) => q.company)));
  }, []);

  const uniqueDsaTopics = useMemo(() => {
    return Array.from(new Set(dsaSheetData.map((d) => d.topic)));
  }, []);

  return (
    <div className="prep-page">
      <div className="container prep-container">
        {/* Page Header */}
        <div className="prep-header">
          <div>
            <span className="prep-badge">
              <Sparkles size={14} /> Placement Interview Preparation Portal
            </span>
            <h1 className="prep-title">Master Coding & Technical Interviews</h1>
            <p className="prep-subtitle">
              Browse real company question banks, practice curated DSA sheets, and access top engineering learning guides.
            </p>
          </div>
        </div>

        {/* Responsive 3-Tab Navigation Bar */}
        <div className="prep-tabs-bar">
          <button
            className={`prep-tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <HelpCircle size={18} />
            <span>Company Questions ({questionsData.length})</span>
          </button>

          <button
            className={`prep-tab-btn ${activeTab === 'dsa' ? 'active' : ''}`}
            onClick={() => setActiveTab('dsa')}
          >
            <Code2 size={18} />
            <span>DSA Practice Sheet ({dsaSolvedCount}/{dsaTotalCount})</span>
          </button>

          <button
            className={`prep-tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <BookOpen size={18} />
            <span>Resource Links ({resourcesData.length})</span>
          </button>
        </div>

        {/* TAB 1: COMPANY QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="prep-tab-content">
            {/* Filter Bar */}
            <div className="prep-filter-card">
              <div className="filter-grid-2">
                <div className="filter-search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="filter-search-input"
                    placeholder="Search questions by topic, keyword, or company..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                  />
                </div>

                <div className="filter-group-inline">
                  <label className="filter-inline-label">Company:</label>
                  <select
                    className="filter-select"
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                  >
                    <option value="All">All Companies ({uniqueCompanies.length})</option>
                    {uniqueCompanies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {(companyFilter !== 'All' || questionSearch) && (
                    <button
                      onClick={() => {
                        setCompanyFilter('All');
                        setQuestionSearch('');
                      }}
                      className="btn btn-outline btn-reset-sm"
                    >
                      <RotateCcw size={14} /> Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question Cards Grid */}
            {filteredQuestions.length === 0 ? (
              <div className="prep-empty-card text-center">
                <HelpCircle size={40} className="empty-icon" />
                <h3>No questions match your filter</h3>
                <p>Try resetting company filter or search terms.</p>
              </div>
            ) : (
              <div className="questions-grid">
                {filteredQuestions.map((item) => (
                  <div key={item.id} className="question-card">
                    <div className="question-card-header">
                      <span className="question-company-badge">
                        <Building size={14} /> {item.company}
                      </span>
                      <span
                        className={`diff-badge diff-${item.difficulty.toLowerCase()}`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    <h3 className="question-text">{item.question}</h3>

                    <div className="question-card-footer">
                      <span className="topic-pill-tag">{item.topic}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DSA PRACTICE SHEET */}
        {activeTab === 'dsa' && (
          <div className="prep-tab-content">
            {/* Progress Summary Card */}
            <div className="dsa-progress-card">
              <div className="progress-info">
                <div>
                  <span className="progress-label font-bold">DSA SHEET PROGRESS</span>
                  <h2 className="progress-title">
                    {dsaSolvedCount} / {dsaTotalCount} Problems Solved ({dsaProgressPercent}%)
                  </h2>
                </div>
                <div className="solved-badge">
                  <CheckCircle2 size={16} /> {dsaSolvedCount} Solved
                </div>
              </div>

              <div className="dsa-progress-bar-bg">
                <div
                  className="dsa-progress-bar-fill"
                  style={{ width: `${dsaProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="prep-filter-card">
              <div className="filter-grid-3">
                <div className="filter-search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="filter-search-input"
                    placeholder="Search problem title or topic..."
                    value={dsaSearch}
                    onChange={(e) => setDsaSearch(e.target.value)}
                  />
                </div>

                <div className="filter-group-inline">
                  <label className="filter-inline-label">Topic:</label>
                  <select
                    className="filter-select"
                    value={dsaTopicFilter}
                    onChange={(e) => setDsaTopicFilter(e.target.value)}
                  >
                    <option value="All">All Topics</option>
                    {uniqueDsaTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group-inline">
                  <label className="filter-inline-label">Difficulty:</label>
                  <select
                    className="filter-select"
                    value={dsaDifficultyFilter}
                    onChange={(e) => setDsaDifficultyFilter(e.target.value)}
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DSA Sheet Table */}
            {filteredDsaProblems.length === 0 ? (
              <div className="prep-empty-card text-center">
                <Code2 size={40} className="empty-icon" />
                <h3>No DSA problems match your filter</h3>
                <p>Clear difficulty or topic filters to view all coding problems.</p>
              </div>
            ) : (
              <div className="dsa-table-container">
                <table className="dsa-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Status</th>
                      <th>Problem Title</th>
                      <th>Topic</th>
                      <th>Difficulty</th>
                      <th style={{ width: '100px', textAlign: 'right' }}>Solve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDsaProblems.map((prob) => {
                      const isSolved = solvedDsaIds.includes(prob.id);
                      return (
                        <tr key={prob.id} className={isSolved ? 'row-solved' : ''}>
                          <td className="text-center">
                            <button
                              type="button"
                              onClick={() => toggleDsaSolved(prob.id)}
                              className="checkbox-btn"
                              title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                            >
                              {isSolved ? (
                                <CheckSquare size={20} className="checkbox-icon checked" />
                              ) : (
                                <Square size={20} className="checkbox-icon unchecked" />
                              )}
                            </button>
                          </td>
                          <td className="font-semibold text-primary-dark">
                            <span className={isSolved ? 'title-strikethrough' : ''}>
                              {prob.title}
                            </span>
                          </td>
                          <td>
                            <span className="topic-pill-tag">{prob.topic}</span>
                          </td>
                          <td>
                            <span
                              className={`diff-badge diff-${prob.difficulty.toLowerCase()}`}
                            >
                              {prob.difficulty}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <a
                              href={prob.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline btn-solve-sm"
                            >
                              <span>Solve</span>
                              <ExternalLink size={14} />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESOURCE LINKS */}
        {activeTab === 'resources' && (
          <div className="prep-tab-content">
            {/* Filter Bar */}
            <div className="prep-filter-card">
              <div className="filter-grid-2">
                <div className="filter-search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="filter-search-input"
                    placeholder="Search resources by title or description..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                  />
                </div>

                <div className="filter-group-inline">
                  <label className="filter-inline-label">Category:</label>
                  <select
                    className="filter-select"
                    value={resourceCategoryFilter}
                    onChange={(e) => setResourceCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Article">Article</option>
                    <option value="Course">Course</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resource Cards Grid */}
            {filteredResources.length === 0 ? (
              <div className="prep-empty-card text-center">
                <BookOpen size={40} className="empty-icon" />
                <h3>No resources match your query</h3>
                <p>Try adjusting category filters or search text.</p>
              </div>
            ) : (
              <div className="resources-grid">
                {filteredResources.map((res) => (
                  <div key={res.id} className="resource-card">
                    <div className="resource-card-top">
                      <div className="res-icon-box">
                        {res.category === 'YouTube' ? (
                          <Youtube size={22} className="cat-icon-red" />
                        ) : res.category === 'Article' ? (
                          <FileText size={22} className="cat-icon-blue" />
                        ) : (
                          <GraduationCap size={22} className="cat-icon-purple" />
                        )}
                      </div>
                      <span className={`category-badge cat-${res.category.toLowerCase()}`}>
                        {res.category}
                      </span>
                    </div>

                    <h3 className="resource-title">{res.title}</h3>
                    <p className="resource-desc">{res.description}</p>

                    <div className="resource-card-footer">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-resource-link"
                      >
                        <span>Explore Resource</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

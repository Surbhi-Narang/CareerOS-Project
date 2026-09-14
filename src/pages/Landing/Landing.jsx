import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Briefcase,
  GraduationCap,
  Search,
  Code2,
  FileText,
  StickyNote,
  CheckSquare,
  Compass,
  Target,
  ArrowRight,
  FolderGit2,
  Kanban,
  Award,
  BookOpen,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Star,
  Zap,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import testimonialsData from '../../data/testimonials.json';
import './Landing.css';

/**
 * Landing Page Component (Teammate 1)
 * Hero, Problem (9 tool cluster), Features Marquee, How It Works, Stats, Testimonials, CTA.
 */
export default function Landing() {
  const problemRef = useRef(null);

  // Intersection Observer for scroll-triggered animation in Problem section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (problemRef.current) {
      observer.observe(problemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 9 Tool Badges with distinct brand colors and soft tints
  const problemTools = [
    { name: 'LinkedIn', icon: Briefcase, color: '#0A66C2', bg: '#EFF6FF' },
    { name: 'Internshala', icon: GraduationCap, color: '#008BDC', bg: '#F0F9FF' },
    { name: 'Naukri', icon: Search, color: '#2563EB', bg: '#EEF2FF' },
    { name: 'GitHub', icon: Code2, color: '#1E293B', bg: '#F8FAFC' },
    { name: 'Resume Builder', icon: FileText, color: '#7C3AED', bg: '#F5F3FF' },
    { name: 'Notes App', icon: StickyNote, color: '#D97706', bg: '#FEF3C7' },
    { name: 'To-Do App', icon: CheckSquare, color: '#059669', bg: '#ECFDF5' },
    { name: 'Roadmap Tracker', icon: Compass, color: '#DB2777', bg: '#FCE7F3' },
    { name: 'Placement Tracker', icon: Target, color: '#4F46E5', bg: '#EEF2FF' },
  ];

  // 8 Features for the auto-scrolling marquee
  const features = [
    {
      title: 'Skill Tracking',
      desc: 'Monitor technical proficiency and identify skill gaps instantly.',
      icon: Target,
    },
    {
      title: 'Project Portfolio',
      desc: 'Showcase verified GitHub repositories and live deployments.',
      icon: FolderGit2,
    },
    {
      title: 'Resume Builder',
      desc: 'Craft ATS-optimized resumes tailored to target career goals.',
      icon: FileText,
    },
    {
      title: 'Application Tracker',
      desc: 'Monitor application pipelines with vertical 7-stage steppers.',
      icon: Kanban,
    },
    {
      title: 'Certificate Vault',
      desc: 'Securely archive and present verified course certifications.',
      icon: Award,
    },
    {
      title: 'Interview Prep',
      desc: 'Master company-wise question banks, DSA sheets, and guides.',
      icon: BookOpen,
    },
    {
      title: 'Job Suggestions',
      desc: 'Discover jobs matched auto-filled from your profile defaults.',
      icon: Sparkles,
    },
    {
      title: 'Progress Analytics',
      desc: 'Visualize dynamic readiness scores and application success metrics.',
      icon: BarChart3,
    },
  ];

  // 4 How It Works steps
  const steps = [
    {
      number: '1',
      title: 'Register Account',
      desc: 'Create your free student profile in under 2 minutes.',
    },
    {
      number: '2',
      title: 'Build Profile',
      desc: 'Add career goals, skills, and coding platform usernames.',
    },
    {
      number: '3',
      title: 'Get Matched',
      desc: 'Explore jobs pre-filtered by your role and location preferences.',
    },
    {
      number: '4',
      title: 'Track & Get Hired',
      desc: 'Advance application stages step-by-step to your final offer.',
    },
  ];

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} />
              <span>The #1 Career Operating System for Students</span>
            </div>
            
            <h1 className="hero-title">
              Plan. Build. Apply. <span className="text-highlight">Get Hired.</span>
            </h1>
            
            <p className="hero-description">
              Your placement journey shouldn't feel like managing a chaotic browser with 9 open tabs. Turn your coding projects, skills, and applications into one unified career readiness engine.
            </p>

            <div className="hero-cta-buttons">
              <Link to="/signup" className="btn btn-primary hero-btn">
                <span>Get Started Free</span>
                <ChevronRight size={18} className="hero-btn-icon" />
              </Link>
              <a href="#how-it-works" className="btn btn-outline hero-btn">
                See How It Works
              </a>
            </div>

            <div className="hero-trust-indicators">
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>No live APIs required</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>100% Free for Students</span>
              </div>
            </div>
          </div>

          {/* Static Dashboard Preview Mockup */}
          <div className="hero-preview-wrapper">
            <div className="dashboard-mockup-card">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="mockup-title">CareerOS Student Workspace</div>
              </div>
              
              <div className="mockup-body">
                <div className="mockup-score-banner">
                  <div>
                    <span className="score-label">Career Readiness Score</span>
                    <h3 className="score-val">78<span className="score-max">/100</span></h3>
                  </div>
                  <div className="score-badge">
                    <TrendingUp size={16} /> +12% this week
                  </div>
                </div>

                <div className="mockup-widget-grid">
                  <div className="mockup-widget">
                    <div className="widget-icon-box"><Kanban size={18} /></div>
                    <div>
                      <h4 className="widget-num">6 Active</h4>
                      <p className="widget-sub">Applications Tracked</p>
                    </div>
                  </div>
                  <div className="mockup-widget">
                    <div className="widget-icon-box"><Code2 size={18} /></div>
                    <div>
                      <h4 className="widget-num">42 Solved</h4>
                      <p className="widget-sub">DSA Practice Sheet</p>
                    </div>
                  </div>
                </div>

                <div className="mockup-pipeline-preview">
                  <div className="pipeline-item">
                    <span className="pipeline-dot active" />
                    <span className="pipeline-title">TechNova Solutions</span>
                    <span className="pipeline-stage">Interview R1</span>
                  </div>
                  <div className="pipeline-item">
                    <span className="pipeline-dot" />
                    <span className="pipeline-title">CloudScale Systems</span>
                    <span className="pipeline-stage">Online Assessment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION (9 Scattered Tools -> Central Arrow -> CareerOS Mockup Card) */}
      <section id="problem" className="problem-section" ref={problemRef}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">THE PROBLEM WE SOLVE</span>
            <h2 className="section-title">Tired of Juggling 9 Different Platforms?</h2>
            <p className="section-desc">
              Students lose track of job applications, DSA progress, and project links across disconnected tools and browser tabs.
            </p>
          </div>

          <div className="problem-visual-container">
            {/* Left Side: Scattered Cluster of 9 Tool Badges */}
            <div className="scattered-tools-cluster">
              <span className="cluster-label">Fragmented Tools</span>
              <div className="tools-grid">
                {problemTools.map((tool) => {
                  const IconComp = tool.icon;
                  return (
                    <div key={tool.name} className="tool-badge-card">
                      <div className="tool-badge-icon-box" style={{ backgroundColor: tool.bg, color: tool.color }}>
                        <IconComp size={16} />
                      </div>
                      <span className="tool-name">{tool.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Central Connector Arrow & Lines */}
            <div className="central-connector">
              <div className="connector-lines" />
              <div className="arrow-circle">
                <ArrowRight size={24} />
              </div>
              <span className="connector-text">Unified into</span>
            </div>

            {/* Right Side: Clean Single Destination Mockup Card */}
            <div className="unified-destination-card">
              <div className="unified-card-badge">Single Destination</div>
              <div className="unified-card-header">
                <div className="unified-logo">Career<span>OS</span></div>
                <span className="unified-status">All-in-One</span>
              </div>
              <ul className="unified-features-list">
                <li><CheckCircle2 size={16} className="check-icon" /> Centralized Application Tracker</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Dynamic Readiness Score</li>
                <li><CheckCircle2 size={16} className="check-icon" /> GitHub & LeetCode Profiles</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Curated DSA Practice Sheet</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION (Auto-scrolling Horizontal Marquee) */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">PLATFORM FEATURES</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-desc">
              Designed specifically for engineering students targeting campus placements and internships.
            </p>
          </div>
        </div>

        {/* Marquee Track */}
        <div className="marquee-container">
          <div className="marquee-track">
            {/* First Set of 8 Cards */}
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={`feat-1-${feature.title}`} className="feature-marquee-card">
                  <div className="feature-icon-box">
                    <IconComponent size={22} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              );
            })}

            {/* Duplicated Second Set of 8 Cards for Infinite Loop */}
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={`feat-2-${feature.title}`} className="feature-marquee-card" aria-hidden="true">
                  <div className="feature-icon-box">
                    <IconComponent size={22} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="how-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">SIMPLE 4-STEP WORKFLOW</span>
            <h2 className="section-title">How CareerOS Works</h2>
            <p className="section-desc">
              Four simple steps from account setup to landing your dream job offer.
            </p>
          </div>

          <div className="steps-wrapper">
            <div className="steps-connector-line" />
            <div className="steps-grid">
              {steps.map((step) => (
                <div key={step.number} className="step-card">
                  <div className="step-number-badge">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Students Enrolled</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">200+</h3>
              <p className="stat-label">Companies Tracked</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">95%</h3>
              <p className="stat-label">Placement Success Rate</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Applications Managed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">STUDENT SUCCESS STORIES</span>
            <h2 className="section-title">Loved by Students Across Campuses</h2>
          </div>

          <div className="testimonials-grid">
            {testimonialsData.map((item) => (
              <div key={item.id} className="testimonial-card">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
                <p className="quote-text">"{item.quote}"</p>
                <div className="user-profile">
                  <img src={item.avatar} alt={item.name} className="user-avatar" />
                  <div>
                    <h4 className="user-name">{item.name}</h4>
                    <p className="user-role">{item.role}</p>
                    <p className="user-college">{item.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Take Control of Your Career?</h2>
              <p className="cta-subtitle">
                Join hundreds of students streamlining their placement journey with CareerOS today.
              </p>
            </div>
            <Link to="/signup" className="btn btn-accent cta-btn">
              Get Started Free
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

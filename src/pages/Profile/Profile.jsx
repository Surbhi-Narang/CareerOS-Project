import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Briefcase, Link as LinkIcon, Award, Plus, Trash2, Save, CheckCircle2, Building, GraduationCap, MapPin, Phone, Camera, Globe, Code2 } from 'lucide-react';
import './Profile.css';

/**
 * Profile Page Component (Teammate 2)
 * Comprehensive student profile manager with controlled inputs, conditional career goal fields,
 * dynamic skills editor, and single-object localStorage persistence ('career_os_profile').
 */
export default function Profile() {
  const { user } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initial State setup
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    college: '',
    branch: '',
    currentYear: '4th Year / Final Year',
    location: '',
    careerGoal: 'Both', // 'Internship' | 'Full-time Placement' | 'Both'
    durationPreference: '6 Months',
    stipendExpectation: '₹25,000 / month',
    expectedSalaryRange: '8 - 12 LPA',
    preferredJobRole: 'Full Stack Software Engineer',
    githubUrl: '',
    leetcodeUrl: '',
    linkedinUrl: '',
    otherUrl: '',
    skills: [
      { id: 'sk_1', name: 'React.js', level: 'Intermediate' },
      { id: 'sk_2', name: 'Node.js', level: 'Intermediate' },
      { id: 'sk_3', name: 'Data Structures & Algorithms', level: 'Advanced' },
    ],
  });

  // On mount, load profile from localStorage if exists, else fallback to AuthContext
  useEffect(() => {
    const savedProfile = localStorage.getItem('career_os_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile((prev) => ({
          ...prev,
          ...parsed,
          email: user?.email || parsed.email || '',
        }));
      } catch (err) {
        console.error('Failed to parse career_os_profile from localStorage', err);
      }
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        college: user.college || 'Chitkara University, Punjab',
        branch: user.branch || 'Computer Science & Engineering',
        avatarUrl: user.avatarUrl || '',
        githubUrl: user.githubUrl || '',
        leetcodeUrl: user.leetcodeUrl || '',
        linkedinUrl: user.linkedinUrl || '',
      }));
    }
  }, [user]);

  // Handle generic field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Skill Handlers
  const handleAddSkill = () => {
    const newSkill = {
      id: `sk_${Date.now()}`,
      name: '',
      level: 'Intermediate',
    };
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const handleSkillChange = (id, field, value) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleRemoveSkill = (id) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // Save profile state as single object to localStorage
  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('career_os_profile', JSON.stringify(profile));

    // Show saved toast message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  const showInternship = profile.careerGoal === 'Internship' || profile.careerGoal === 'Both';
  const showPlacement = profile.careerGoal === 'Full-time Placement' || profile.careerGoal === 'Both';

  return (
    <div className="profile-page">
      <div className="container profile-container">
        {/* Page Header */}
        <div className="profile-header">
          <div>
            <h1 className="profile-title">Student Profile</h1>
            <p className="profile-subtitle">
              Keep your academic background, career preferences, and skills up-to-date.
            </p>
          </div>

          <button onClick={handleSave} type="button" className="btn btn-primary btn-save-header">
            <Save size={18} />
            <span>Save Profile</span>
          </button>
        </div>

        {/* Inline Save Confirmation Banner */}
        {saveSuccess && (
          <div className="save-toast-banner" role="alert">
            <CheckCircle2 size={20} className="toast-icon" />
            <span>Profile saved successfully to your workspace!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="profile-form">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="profile-card">
            <div className="card-section-header">
              <User size={22} className="section-header-icon" />
              <div>
                <h2 className="card-section-title">Basic Information</h2>
                <p className="card-section-desc">Personal details and academic background</p>
              </div>
            </div>

            <div className="profile-grid-2">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Aarav Sharma"
                    value={profile.fullName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address (Read-only)</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input input-disabled"
                    value={profile.email || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={profile.phone || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="avatarUrl" className="form-label">Profile Photo URL</label>
                <div className="input-wrapper">
                  <Camera size={18} className="input-icon" />
                  <input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={profile.avatarUrl || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="college" className="form-label">College / University Name</label>
                <div className="input-wrapper">
                  <Building size={18} className="input-icon" />
                  <input
                    id="college"
                    name="college"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chitkara University, Punjab"
                    value={profile.college || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="branch" className="form-label">Branch / Department</label>
                <div className="input-wrapper">
                  <GraduationCap size={18} className="input-icon" />
                  <input
                    id="branch"
                    name="branch"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Computer Science & Engineering"
                    value={profile.branch || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="currentYear" className="form-label">Current Academic Year</label>
                <div className="input-wrapper">
                  <select
                    id="currentYear"
                    name="currentYear"
                    className="form-input form-select"
                    value={profile.currentYear || '4th Year / Final Year'}
                    onChange={handleChange}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year / Final Year">4th Year / Final Year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Current Location / City</label>
                <div className="input-wrapper">
                  <MapPin size={18} className="input-icon" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chandigarh / Mohali"
                    value={profile.location || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CAREER GOAL */}
          <div className="profile-card">
            <div className="card-section-header">
              <Briefcase size={22} className="section-header-icon" />
              <div>
                <h2 className="card-section-title">Career Goal & Target Preferences</h2>
                <p className="card-section-desc">Define what placement type you are aiming for</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Goal Type</label>
              <div className="goal-toggle-group">
                {['Internship', 'Full-time Placement', 'Both'].map((goal) => (
                  <label
                    key={goal}
                    className={`goal-toggle-btn ${profile.careerGoal === goal ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="careerGoal"
                      value={goal}
                      checked={profile.careerGoal === goal}
                      onChange={handleChange}
                      className="radio-hidden"
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Goal Fields */}
            <div className="profile-grid-2 mt-3">
              {showInternship && (
                <>
                  <div className="form-group">
                    <label htmlFor="durationPreference" className="form-label">Internship Duration Preference</label>
                    <input
                      id="durationPreference"
                      name="durationPreference"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 3 Months / 6 Months"
                      value={profile.durationPreference || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="stipendExpectation" className="form-label">Stipend Expectation (Monthly)</label>
                    <input
                      id="stipendExpectation"
                      name="stipendExpectation"
                      type="text"
                      className="form-input"
                      placeholder="e.g. ₹20,000 - ₹35,000 / month"
                      value={profile.stipendExpectation || ''}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {showPlacement && (
                <>
                  <div className="form-group">
                    <label htmlFor="expectedSalaryRange" className="form-label">Expected Salary Package (CTC)</label>
                    <input
                      id="expectedSalaryRange"
                      name="expectedSalaryRange"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 8 - 14 LPA"
                      value={profile.expectedSalaryRange || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredJobRole" className="form-label">Preferred Job Role</label>
                    <input
                      id="preferredJobRole"
                      name="preferredJobRole"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Software Development Engineer (SDE-1)"
                      value={profile.preferredJobRole || ''}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SECTION 3: EXTERNAL PROFILES & LINKS */}
          <div className="profile-card">
            <div className="card-section-header">
              <LinkIcon size={22} className="section-header-icon" />
              <div>
                <h2 className="card-section-title">Coding & Social Profiles</h2>
                <p className="card-section-desc">Connect your repositories and competitive coding handles</p>
              </div>
            </div>

            <div className="profile-grid-2">
              <div className="form-group">
                <label htmlFor="githubUrl" className="form-label">GitHub Profile URL</label>
                <div className="input-wrapper">
                  <Code2 size={18} className="input-icon" />
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/username"
                    value={profile.githubUrl || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="leetcodeUrl" className="form-label">LeetCode Profile URL</label>
                <div className="input-wrapper">
                  <Code2 size={18} className="input-icon" />
                  <input
                    id="leetcodeUrl"
                    name="leetcodeUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://leetcode.com/u/username"
                    value={profile.leetcodeUrl || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="linkedinUrl" className="form-label">LinkedIn Profile URL</label>
                <div className="input-wrapper">
                  <Globe size={18} className="input-icon" />
                  <input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://linkedin.com/in/username"
                    value={profile.linkedinUrl || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="otherUrl" className="form-label">Portfolio / Others (Optional)</label>
                <div className="input-wrapper">
                  <Globe size={18} className="input-icon" />
                  <input
                    id="otherUrl"
                    name="otherUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://myportfolio.dev"
                    value={profile.otherUrl || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: DYNAMIC SKILLS EDITOR */}
          <div className="profile-card">
            <div className="card-section-header flex-between">
              <div className="flex-align">
                <Award size={22} className="section-header-icon" />
                <div>
                  <h2 className="card-section-title">Technical Skills & Proficiency</h2>
                  <p className="card-section-desc">Add skills to boost your placement readiness score</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddSkill}
                className="btn btn-outline btn-add-skill"
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="skills-list">
              {profile.skills.length === 0 ? (
                <p className="empty-skills-msg">No skills added yet. Click "Add Skill" above.</p>
              ) : (
                profile.skills.map((skill) => (
                  <div key={skill.id} className="skill-row">
                    <input
                      type="text"
                      className="form-input skill-name-input"
                      placeholder="e.g. React.js, Python, SQL"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                    />
                    <select
                      className="form-input form-select skill-level-select"
                      value={skill.level}
                      onChange={(e) => handleSkillChange(skill.id, 'level', e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="btn-remove-skill"
                      title="Remove Skill"
                      aria-label="Remove Skill"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="profile-bottom-actions">
            <button type="submit" className="btn btn-primary btn-save-bottom">
              <Save size={18} />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

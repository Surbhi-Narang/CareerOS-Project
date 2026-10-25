import { createSlice } from '@reduxjs/toolkit';

export const DEFAULT_STAGES = [
  'Applied',
  'Resume Shortlisted',
  'Online Assessment',
  'Interview Round 1',
  'Interview Round 2',
  'HR Round',
  'Final Result',
];

export const SAMPLE_APPLICATIONS = [
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

const saveToLocalStorage = (applications) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('career_os_applications', JSON.stringify(applications));
    }
  } catch (err) {
    console.error('Failed to save career_os_applications to localStorage', err);
  }
};

const loadInitialApplications = () => {
  try {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('career_os_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to parse career_os_applications from localStorage', err);
  }
  saveToLocalStorage(SAMPLE_APPLICATIONS);
  return SAMPLE_APPLICATIONS;
};

const initialState = {
  applications: loadInitialApplications(),
};

export const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    addApplication: (state, action) => {
      const newApp = action.payload;
      if (!newApp) return;
      const exists = state.applications.some(
        (app) => app.id === newApp.id || (newApp.jobId && app.jobId === newApp.jobId)
      );
      if (!exists) {
        state.applications.unshift(newApp);
      }
      saveToLocalStorage(state.applications);
    },
    updateStage: (state, action) => {
      const { id, appId, selectedValue, stage } = action.payload || {};
      const targetId = id || appId;
      const val = selectedValue !== undefined ? selectedValue : stage;
      const app = state.applications.find((a) => a.id === targetId);
      if (!app) return;

      const stages = app.stages || DEFAULT_STAGES;

      if (val === 'REJECTED') {
        app.isRejected = true;
        app.isOfferReceived = false;
        app.status = 'Process Ended';
      } else if (val === 'OFFER') {
        app.isRejected = false;
        app.isOfferReceived = true;
        app.currentStageIndex = 6;
        app.status = 'Offer Received';
      } else {
        const newIndex = parseInt(val, 10);
        app.isRejected = false;
        app.isOfferReceived = false;
        app.currentStageIndex = newIndex;
        app.status = stages[newIndex] || 'In Progress';
      }
      saveToLocalStorage(state.applications);
    },
    deleteApplication: (state, action) => {
      const id = typeof action.payload === 'object' && action.payload ? (action.payload.id || action.payload.appId) : action.payload;
      state.applications = state.applications.filter((app) => app.id !== id);
      saveToLocalStorage(state.applications);
    },
    updateNote: (state, action) => {
      const { id, appId, stageIdx, noteText } = action.payload || {};
      const targetId = id || appId;
      const app = state.applications.find((a) => a.id === targetId);
      if (app) {
        if (!app.notes) app.notes = {};
        app.notes[stageIdx] = noteText;
      }
      saveToLocalStorage(state.applications);
    },
    setApplications: (state, action) => {
      state.applications = action.payload || [];
      saveToLocalStorage(state.applications);
    },
  },
});

export const {
  addApplication,
  updateStage,
  deleteApplication,
  updateNote,
  setApplications,
} = applicationsSlice.actions;

export const selectApplications = (state) =>
  state.applications?.applications || (Array.isArray(state.applications) ? state.applications : []);

export const selectApplicationsCount = (state) => selectApplications(state).length;

export default applicationsSlice.reducer;

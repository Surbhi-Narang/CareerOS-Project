# CareerOS

**Plan. Build. Apply. Get Hired.**

A centralized career management platform that helps students track their placement journey, skills, job applications, and interview preparation — all from one dashboard, instead of juggling nine different tools and browser tabs.

> 🎓 Built as a Front-End Engineering group project (PE-1 submission).

---

## What This Is

Most students track their careers across a scattered mess of tools — LinkedIn, Internshala, Naukri, GitHub, a resume doc, a notes app, a to-do list, and a placement spreadsheet. CareerOS pulls all of that into a single, unified workspace.

This repository contains the **PE-1 build**: a fully functional front-end shell of the product, built entirely with React and simulated data (no backend yet — see [Project Scope](#project-scope) below).

---

## Features

| Feature | Description |
|---|---|
| **Landing Page** | Marketing page explaining the product, problem, and features |
| **Auth (Sign In / Sign Up)** | Email-based account creation and login |
| **Profile Builder** | Basic info, career goals (internship/placement), skills, and external links (GitHub, LeetCode, LinkedIn) |
| **Dashboard** | Personalized readiness score, quick stats, and shortcuts to every tool |
| **Job Explorer** | Browse and filter job/internship listings, view full job details, and apply |
| **Application Tracker** | A 7-stage visual pipeline (Applied → Offer) for every job applied to, with private notes per stage |
| **Interview Prep Hub** | Company-wise question bank, a curated DSA practice sheet with progress tracking, and learning resource links |

---

## Tech Stack

- **Frontend:** React 18 (Vite)
- **Routing:** React Router v6 — including nested, protected, and dynamic routes (`/jobs/:jobId`)
- **State Management:** React Context (Auth) + component-level state (useState, useMemo, useCallback, useRef)
- **Styling:** Plain CSS3 with CSS custom properties (`theme.css`) — Flexbox, Grid, fully responsive
- **Icons:** lucide-react
- **Data Layer:** Static JSON files + browser `localStorage` (see [Project Scope](#project-scope))

---

## Project Scope

This is a **PE-1 submission**, so the project intentionally does not include a real backend yet:

- ❌ No Firebase / Firestore
- ❌ No live third-party APIs (GitHub, LeetCode, job boards)
- ❌ No payment or notification backend
- ✅ Authentication, profiles, applications, and DSA progress are all simulated using `localStorage`
- ✅ Jobs, interview questions, and resources are served from static JSON files in `src/data/`

The codebase is structured so that this data layer can be swapped for real Firebase Auth, Firestore, and live APIs (GitHub, LeetCode, Adzuna) in a later phase, without needing to rebuild any UI.

---

## Running Locally

```bash
git clone https: https://github.com/Surbhi-Narang/CareerOS-Project.git
cd career-os
npm install
npm run dev
```

*This project reflects the shared product vision of the CareerOS team. Backend integration and additional features are planned for future evaluation phases.*

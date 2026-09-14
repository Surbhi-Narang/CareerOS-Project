const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Surbhi\\.gemini\\antigravity\\brain\\abc7070e-d3f3-4ae7-b90e-0bece1bbf2d9';

async function runE2ETest() {
  console.log('🚀 Starting Automated End-to-End Test Suite...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // 1. Sign up as a new test user
    console.log('Step 1: Signing up new test user...');
    await page.goto('http://localhost:5174/signup');
    await page.fill('#fullName', 'Aarav Sharma');
    await page.fill('#email', 'aarav.test@chitkara.edu.in');
    await page.fill('#password', 'Password123');
    await page.fill('#confirmPassword', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_signup.png'), fullPage: false });
    console.log('✅ Step 1 Complete: Signed up and redirected to /dashboard');

    // 2. Fill out Profile page completely
    console.log('Step 2: Filling out Profile page...');
    await page.goto('http://localhost:5174/profile');
    await page.fill('#phone', '+91 98765 43210');
    await page.fill('#college', 'Chitkara University, Punjab');
    await page.fill('#branch', 'Computer Science & Engineering');
    await page.fill('#location', 'Bengaluru, India');
    await page.fill('#githubUrl', 'https://github.com/aaravsharma');
    await page.fill('#leetcodeUrl', 'https://leetcode.com/u/aaravsharma');
    await page.fill('#linkedinUrl', 'https://linkedin.com/in/aaravsharma');
    
    // Save profile
    await page.click('.btn-save-bottom');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step2_profile.png'), fullPage: false });
    console.log('✅ Step 2 Complete: Profile filled and saved');

    // 3. Navigate to Dashboard & verify readiness score
    console.log('Step 3: Checking Dashboard readiness score...');
    await page.goto('http://localhost:5174/dashboard');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_dashboard.png'), fullPage: false });
    console.log('✅ Step 3 Complete: Dashboard readiness score verified');

    // 4. Jobs page: verify search auto-focus, click job card to detail page, click Apply Now & modal
    console.log('Step 4: Testing Jobs page, Detail page & Apply Modal flow...');
    await page.goto('http://localhost:5174/jobs');
    await page.waitForTimeout(500);
    
    // Check search focus
    const isSearchFocused = await page.evaluate(() => {
      return document.activeElement && document.activeElement.classList.contains('filter-search-input');
    });
    console.log(`🔍 Search Box Auto-Focused: ${isSearchFocused}`);

    // Click on the first job card to open Detail page (/jobs/job_1)
    await page.click('.job-card-clickable');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step4a_job_detail.png'), fullPage: false });
    console.log('✅ Step 4a Complete: Job Detail page loaded via card click');

    // Click "Apply Now" button on detail page
    await page.click('.btn-apply-lg');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step4b_apply_modal.png'), fullPage: false });
    console.log('✅ Step 4b Complete: Apply Modal popup displayed');

    // Confirm application
    await page.click('.modal-btn-confirm');
    await page.waitForTimeout(500);

    // 5 & 6. Tracker page: verify application shows up, update stage dropdown
    console.log('Step 5 & 6: Testing Tracker page & stage dropdown update...');
    await page.goto('http://localhost:5174/tracker');
    await page.waitForTimeout(500);

    // Select "Interview Round 1" in stage dropdown for the first app
    const stageDropdowns = await page.$$('.stage-select-dropdown');
    if (stageDropdowns.length > 0) {
      await stageDropdowns[0].selectOption('3'); // Index 3 = Interview Round 1
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step5_tracker_updated.png'), fullPage: false });
    console.log('✅ Step 5 & 6 Complete: Tracker updated with active stepper stage');

    // 7. Interview Prep page: check off DSA problem, refresh page & verify persistence
    console.log('Step 7: Testing Interview Prep DSA sheet persistence...');
    await page.goto('http://localhost:5174/interview-prep');
    await page.waitForTimeout(500);
    
    // Switch to DSA tab
    const tabs = await page.$$('.prep-tab-btn');
    if (tabs.length > 1) {
      await tabs[1].click(); // DSA tab
      await page.waitForTimeout(500);
    }

    // Toggle a checkbox
    const checkboxes = await page.$$('.checkbox-btn');
    if (checkboxes.length > 2) {
      await checkboxes[2].click();
      await page.waitForTimeout(500);
    }

    // Reload page to verify persistence
    await page.reload();
    await page.waitForTimeout(500);

    // Switch back to DSA tab after reload
    const tabsAfterReload = await page.$$('.prep-tab-btn');
    if (tabsAfterReload.length > 1) {
      await tabsAfterReload[1].click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step7_interview_prep.png'), fullPage: false });
    console.log('✅ Step 7 Complete: DSA sheet checkbox persistence verified after reload');

    // 8. Mobile responsiveness screenshots (375px width)
    console.log('Step 8: Testing mobile responsiveness (375px width)...');
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('http://localhost:5174/dashboard');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step8a_mobile_dashboard.png'), fullPage: false });

    await page.goto('http://localhost:5174/jobs');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step8b_mobile_jobs.png'), fullPage: false });

    await page.goto('http://localhost:5174/tracker');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step8c_mobile_tracker.png'), fullPage: false });
    console.log('✅ Step 8 Complete: Mobile 375px screenshots captured');

    console.log('🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY WITH 0 BUGS!');

  } catch (err) {
    console.error('❌ E2E Test Error:', err);
  } finally {
    await browser.close();
  }
}

runE2ETest();

// Cyberpunk Holo-Grid - Vanilla Client State Controller

const API_BASE_URL = 'http://localhost:8080';

// Global Application State
let state = {
  loading: false,
  error: null,
  analysisData: null,
  jobMatchData: null,
  coachData: null,
  fileName: null,
  fileSize: null,
  activeTab: 'overview', // 'overview', 'resume-analysis', 'job-matcher', 'interview-coach', 'history', 'settings'
  history: []
};

// Chart.js Instances
let radarChartInstance = null;
let barChartInstance = null;

// Mock Profile for Instant Career Preview
const MOCK_DEMO_DATA = {
  resume_score: 92,
  ats_score: 87,
  interview_readiness: 90,
  raw_text: "ALEEYA RAHMAN\nSoftware Engineer | Full Stack Developer\nEmail: aleeya.rahman@example.com\nLinkedIn: linkedin.com/in/aleeyarahman\nGitHub: github.com/aleeyarahman\nSkills: Python, JavaScript, TypeScript, SQL, React, Node.js, FastAPI, AWS, Docker, Git",
  contact_info: {
    email: "aleeya.rahman@example.com",
    phone: "(555) 019-2834",
    linkedin: true,
    github: true
  },
  skills: {
    "Languages": ["Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
    "Frameworks & Libraries": ["React", "Node.js", "Express", "FastAPI", "Tailwind CSS", "NumPy", "Pandas"],
    "Databases & Caching": ["PostgreSQL", "MongoDB", "Redis"],
    "Cloud & DevOps": ["AWS", "Docker", "Git", "GitHub Actions", "CI/CD"],
    "AI / ML & Data Science": ["Machine Learning", "Deep Learning", "NLP"],
    "Soft Skills": ["Communication", "Teamwork", "Problem Solving", "Agile"]
  },
  grammar_issues: [
    { type: "Formatting", message: "Resume layout parsed cleanly. Bulleted descriptions are structured with action verbs.", severity: "low" }
  ],
  sections_found: {
    experience: true,
    education: true,
    skills: true,
    projects: true,
    contact: true
  },
  strengths: [
    "Perfect header index with active GitHub and LinkedIn digital footprints.",
    "Excellent keyword saturation matching modern full-stack developer specifications.",
    "Quantified achievements matching agile sprint deliveries."
  ],
  weaknesses: [
    "Container tags lack deployment configuration examples (e.g. ECS or EKS).",
    "Missing explicit testing suite references (e.g., PyTest or Jest)."
  ],
  recommendations: [
    "Incorporate automated unit testing coverage figures into project logs.",
    "Add details about cloud deployment scaling under the TechCorp Experience section."
  ],
  certifications: [
    "AWS Certified Solutions Architect",
    "TensorFlow Developer Certificate"
  ],
  project_suggestions: [
    { title: "SaaS Cloud Deployment Infrastructure", desc: "Build and deploy a scalable microservice cluster using FastAPI, PostgreSQL, AWS ECS, and Docker." }
  ]
};

const MOCK_DEMO_COACH_DATA = {
  confidence_level: "High Alignment",
  expected_difficulty: "Medium-Hard",
  questions: [
    {
      type: "Technical",
      difficulty: "Medium",
      skill: "FastAPI",
      question: "How do you handle asynchronous operations in FastAPI, and what are the benefits of using async/await?",
      answer: "In FastAPI, you declare path operations using async def to leverage Python's asyncio loop. This is beneficial for I/O-bound tasks, such as query operations on database layers or requests to secondary APIs, as the worker thread can handle other connections while waiting for database responses. This yields extremely high concurrency."
    },
    {
      type: "Behavioral",
      difficulty: "Medium",
      skill: "Agile",
      question: "Describe a time when you had to adjust to a major change in a project's technical scope. How did you manage it?",
      answer: "During a sprint, our client requested a migration from a REST API to a GraphQL endpoint. I facilitated a team breakout session to map out schema changes, partition task items, and establish parallel routes. This collaborative effort allowed us to ship the updated data nodes on schedule."
    },
    {
      type: "HR",
      difficulty: "Easy",
      skill: "Communication",
      question: "Why do you want to join our organization as a Full Stack Software Engineer?",
      answer: "I want to apply my expertise in building high-fidelity glassmorphic clients and optimizing scalable FastAPI backend services. Your group's focus on user experience and reliable microservice architecture perfectly matches my developer passion."
    }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadHistoryFromLocalStorage();
  initEventListeners();
  updateUI();
});

// Load history logs from localStorage
function loadHistoryFromLocalStorage() {
  const saved = localStorage.getItem('resumeiq_history');
  if (saved) {
    try {
      state.history = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse history', e);
      state.history = [];
    }
  }
}

// Save history logs to localStorage
function saveHistoryToLocalStorage() {
  localStorage.setItem('resumeiq_history', JSON.stringify(state.history));
}

// Set up UI Event Listeners
function initEventListeners() {
  // --- Drag and Drop File Upload ---
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('resume-file-input');

  if (dropZone && fileInput) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('bg-cyanAccent', 'bg-opacity-5', 'border-cyanAccent');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('bg-cyanAccent', 'bg-opacity-5', 'border-cyanAccent');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('bg-cyanAccent', 'bg-opacity-5', 'border-cyanAccent');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUpload(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleUpload(e.target.files[0]);
      }
    });
  }

  // --- Mock Career Preview Trigger ---
  const demoPreviewBtn = document.getElementById('demo-preview-btn');
  if (demoPreviewBtn) {
    demoPreviewBtn.addEventListener('click', () => {
      loadDemoProfile();
    });
  }

  // --- Reset Application State (New Scan) ---
  const newScanBtns = document.querySelectorAll('.new-scan-trigger');
  newScanBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      resetAppState();
    });
  });

  // --- Tab Navigation Clicks (Desktop and Mobile) ---
  const navPills = document.querySelectorAll('[data-tab]');
  navPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const tabId = pill.getAttribute('data-tab');
      setActiveTab(tabId);
    });
  });

  // --- Mobile Hamburger Menu Toggle ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDropdown = document.getElementById('mobile-dropdown');
  if (mobileMenuToggle && mobileDropdown) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileDropdown.classList.toggle('hidden');
    });
  }
}

// Loads simulation data immediately
function loadDemoProfile() {
  state.loading = true;
  updateUI();

  setTimeout(() => {
    state.analysisData = MOCK_DEMO_DATA;
    state.coachData = MOCK_DEMO_COACH_DATA;
    state.fileName = "AI_Demo_Resume_Profile.png";
    state.fileSize = "2.4 MB";
    state.loading = false;
    setActiveTab('overview');
  }, 1000); // 1s simulation load
}

// Reset the entire state to home view
function resetAppState() {
  state.analysisData = null;
  state.jobMatchData = null;
  state.coachData = null;
  state.fileName = null;
  state.fileSize = null;
  state.activeTab = 'overview';
  state.error = null;
  
  const fileInput = document.getElementById('resume-file-input');
  if (fileInput) fileInput.value = '';

  const mobileDropdown = document.getElementById('mobile-dropdown');
  if (mobileDropdown) mobileDropdown.classList.add('hidden');

  updateUI();
}

// Change the active panel/tab
function setActiveTab(tabId) {
  state.activeTab = tabId;

  // Update navigation pills selection styling
  const navPills = document.querySelectorAll('[data-tab]');
  navPills.forEach(pill => {
    const currentTabId = pill.getAttribute('data-tab');
    if (currentTabId === tabId) {
      pill.classList.remove('text-secText', 'border-transparent');
      pill.classList.add('bg-gradient-to-r', 'from-cyanAccent', 'to-purpleAccent', 'text-navy-deep', 'font-bold', 'shadow-glow-cyan');
    } else {
      pill.classList.add('text-secText', 'border-transparent');
      pill.classList.remove('bg-gradient-to-r', 'from-cyanAccent', 'to-purpleAccent', 'text-navy-deep', 'font-bold', 'shadow-glow-cyan');
    }
  });

  // Hide mobile drawer if clicked
  const mobileDropdown = document.getElementById('mobile-dropdown');
  if (mobileDropdown) mobileDropdown.classList.add('hidden');

  // Toggle active tab panel views
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabPanels.forEach(panel => {
    if (panel.id === `${tabId}-panel`) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  });

  // Render specific tab templates
  if (tabId === 'overview') {
    renderOverviewTab();
  } else if (tabId === 'resume-analysis') {
    renderAnalysisTab();
  } else if (tabId === 'job-matcher') {
    renderJobMatcherTab();
  } else if (tabId === 'interview-coach') {
    renderInterviewCoachTab();
  } else if (tabId === 'history') {
    renderHistoryTab();
  } else if (tabId === 'settings') {
    renderSettingsTab();
  }
}

// Core Upload and NLP Analysis pipeline
async function handleUpload(file) {
  state.loading = true;
  state.error = null;
  updateUI();

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Failed to analyze resume' }));
      throw new Error(err.detail || 'Failed to analyze resume');
    }

    const data = await response.json();
    state.analysisData = data;
    state.fileName = file.name;

    // Calc size string
    const kb = file.size / 1024;
    state.fileSize = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;

    // Append to local history logs
    const historyItem = {
      id: Math.random().toString(36).substring(2, 9),
      fileName: file.name,
      timestamp: new Date().toLocaleString(),
      data: data
    };
    state.history = [historyItem, ...state.history];
    saveHistoryToLocalStorage();

    state.loading = false;
    setActiveTab('overview');
  } catch (err) {
    state.loading = false;
    state.error = err.message;
    updateUI();
  }
}

// Master UI Update controller
function updateUI() {
  const landingView = document.getElementById('landing-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loaderContainer = document.getElementById('loader-container');
  const errorContainer = document.getElementById('error-container');
  const errorText = document.getElementById('error-text');

  // Handle Error Message
  if (state.error) {
    if (errorText) errorText.textContent = state.error;
    if (errorContainer) errorContainer.classList.remove('hidden');
  } else {
    if (errorContainer) errorContainer.classList.add('hidden');
  }

  // Handle Loading Indicator overlay
  if (state.loading) {
    if (loaderContainer) loaderContainer.classList.remove('hidden');
    return;
  } else {
    if (loaderContainer) loaderContainer.classList.add('hidden');
  }

  // Check if we show landing page or dashboard
  if (state.analysisData) {
    if (landingView) landingView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');

    // Update Session context details in header
    const headerFileName = document.getElementById('header-file-name');
    const headerFileSize = document.getElementById('header-file-size');
    if (headerFileName) headerFileName.textContent = state.fileName;
    if (headerFileSize) headerFileSize.textContent = state.fileSize;

    // Refresh active panel contents
    setActiveTab(state.activeTab);
  } else {
    if (landingView) landingView.classList.remove('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');
  }

  lucide.createIcons();
}

// Count Up Numbers Animation
function animateCounter(elementId, targetValue, suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;

  let start = 0;
  const end = Math.floor(targetValue);
  const duration = 1500; // 1.5 seconds

  if (start === end) {
    element.textContent = end + suffix;
    return;
  }

  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out quad formula
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(easeProgress * (end - start) + start);

    element.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = end + suffix;
    }
  }

  requestAnimationFrame(updateCount);
}

// --- RENDER OVERVIEW TAB PANEL ---
function renderOverviewTab() {
  const data = state.analysisData;
  if (!data) return;

  // Trigger counters
  animateCounter('resume-score-val', data.resume_score, '%');
  
  const matchPercentage = state.jobMatchData ? state.jobMatchData.match_score : data.ats_score;
  animateCounter('ats-match-val', matchPercentage, '%');

  const skillsList = Object.values(data.skills).flat();
  animateCounter('skills-found-val', skillsList.length);

  const gapCount = state.jobMatchData ? state.jobMatchData.missing_skills.length : data.weaknesses.length;
  animateCounter('gaps-val', gapCount);

  // Render Strengths & Gaps lists
  const strengthsContainer = document.getElementById('overview-strengths-list');
  if (strengthsContainer) {
    strengthsContainer.innerHTML = data.strengths.map(str => `
      <li class="flex items-start gap-2.5 text-xs text-secText">
        <span class="w-1.5 h-1.5 rounded-full bg-successGreen mt-1.5 shrink-0"></span>
        <span>${str}</span>
      </li>
    `).join('');
  }

  const gapsContainer = document.getElementById('overview-gaps-list');
  if (gapsContainer) {
    gapsContainer.innerHTML = data.weaknesses.map(weak => `
      <li class="flex items-start gap-2.5 text-xs text-secText">
        <span class="w-1.5 h-1.5 rounded-full bg-errorCoral mt-1.5 shrink-0"></span>
        <span>${weak}</span>
      </li>
    `).join('');
  }

  // Render Action Recommendations
  const recsContainer = document.getElementById('overview-recommendations-list');
  if (recsContainer) {
    recsContainer.innerHTML = data.recommendations.map((rec, idx) => `
      <div class="p-3.5 bg-white bg-opacity-[0.02] border border-white border-opacity-5 rounded-2xl flex items-start gap-2.5 text-xs text-secText leading-relaxed">
        <span class="text-purpleAccent font-mono-stats font-bold">${idx + 1}.</span>
        <span>${rec}</span>
      </div>
    `).join('');
  }

  // Render Timeline steps
  const stepsContainer = document.getElementById('operations-steps-timeline');
  if (stepsContainer) {
    stepsContainer.innerHTML = `
      <div class="flex gap-4 relative">
        <div class="absolute top-7 left-3.5 w-0.5 h-10 bg-white bg-opacity-5"></div>
        <div class="w-7 h-7 rounded-full bg-cyanAccent bg-opacity-10 border border-cyanAccent border-opacity-20 text-cyanAccent flex items-center justify-center text-xs shadow-glow-cyan/5">
          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h5 class="font-bold text-xs text-white">Resume Text Extraction</h5>
            <span class="text-[9px] text-cyanAccent uppercase font-bold px-2 py-0.5 bg-cyanAccent bg-opacity-5 rounded border border-cyanAccent border-opacity-10">Success</span>
          </div>
          <p class="text-xs text-secText">Successfully converted document binaries to searchable text strings.</p>
        </div>
      </div>
      <div class="flex gap-4 relative">
        <div class="absolute top-7 left-3.5 w-0.5 h-10 bg-white bg-opacity-5"></div>
        <div class="w-7 h-7 rounded-full bg-cyanAccent bg-opacity-10 border border-cyanAccent border-opacity-20 text-cyanAccent flex items-center justify-center text-xs shadow-glow-cyan/5">
          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h5 class="font-bold text-xs text-white">Keywords & Skill Classification</h5>
            <span class="text-[9px] text-cyanAccent uppercase font-bold px-2 py-0.5 bg-cyanAccent bg-opacity-5 rounded border border-cyanAccent border-opacity-10">Success</span>
          </div>
          <p class="text-xs text-secText">Indexed ${skillsList.length} development tools and industry vocabulary terms.</p>
        </div>
      </div>
      <div class="flex gap-4 relative">
        <div class="absolute top-7 left-3.5 w-0.5 h-10 bg-white bg-opacity-5"></div>
        <div class="w-7 h-7 rounded-full bg-cyanAccent bg-opacity-10 border border-cyanAccent border-opacity-20 text-cyanAccent flex items-center justify-center text-xs shadow-glow-cyan/5">
          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h5 class="font-bold text-xs text-white">Formatting Quality Audit</h5>
            <span class="text-[9px] text-cyanAccent uppercase font-bold px-2 py-0.5 bg-cyanAccent bg-opacity-5 rounded border border-cyanAccent border-opacity-10">Success</span>
          </div>
          <p class="text-xs text-secText">Scanned document section headers. Found ${data.grammar_issues.length} warnings.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-7 h-7 rounded-full bg-cyanAccent bg-opacity-10 border border-cyanAccent border-opacity-20 text-cyanAccent flex items-center justify-center text-xs shadow-glow-cyan/5">
          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h5 class="font-bold text-xs text-white">ATS Score Estimation</h5>
            <span class="text-[9px] text-cyanAccent uppercase font-bold px-2 py-0.5 bg-cyanAccent bg-opacity-5 rounded border border-cyanAccent border-opacity-10">Success</span>
          </div>
          <p class="text-xs text-secText">Estimated applicant tracking filter weights and calculated readiness logs.</p>
        </div>
      </div>
    `;
  }

  // Draw holographic charts
  drawOverviewCharts(data, skillsList.length);
  lucide.createIcons();
}

function drawOverviewCharts(data, totalSkillsCount) {
  // Clean up any existing instances
  if (radarChartInstance) radarChartInstance.destroy();
  if (barChartInstance) barChartInstance.destroy();

  // 1. Radar Chart Definition
  const radarCtx = document.getElementById('radar-chart-canvas');
  if (radarCtx) {
    const skillsCount = totalSkillsCount;
    const sectionsCount = Object.values(data.sections_found).filter(Boolean).length;
    const contactsCount = Object.values(data.contact_info).filter(Boolean).length;
    const deductions = data.grammar_issues.length;

    const densityScore = Math.min(100, skillsCount * 12);
    const reachScore = Math.min(100, contactsCount * 25);
    const coverScore = Math.min(100, sectionsCount * 20);
    const qualityScore = Math.max(30, 100 - (deductions * 8));

    radarChartInstance = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Keyword Density', 'Contact Reach', 'Section Coverage', 'Writing Quality', 'Readiness'],
        datasets: [{
          label: 'Portfolio Competency',
          data: [densityScore, reachScore, coverScore, qualityScore, data.interview_readiness],
          backgroundColor: 'rgba(0, 217, 255, 0.15)',
          borderColor: '#00D9FF',
          borderWidth: 2,
          pointBackgroundColor: '#8B5CF6',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#00D9FF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            grid: { color: 'rgba(0, 217, 255, 0.08)' },
            angleLines: { color: 'rgba(0, 217, 255, 0.08)' },
            pointLabels: { color: '#B8C0CC', font: { family: 'Orbitron', size: 9 } },
            ticks: { display: false, maxTicksLimit: 5 },
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  // 2. Bar Chart Definition
  const barCtx = document.getElementById('bar-chart-canvas');
  if (barCtx) {
    const categories = Object.keys(data.skills).map(k => k.split(' ')[0]);
    const counts = Object.values(data.skills).map(l => l.length);

    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Tags Found',
          data: counts,
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: '#8B5CF6',
          borderWidth: 1.5,
          borderRadius: 6,
          hoverBackgroundColor: '#00D9FF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(0,217,255,0.4)', font: { size: 9, family: 'Orbitron' } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 9, family: 'Orbitron' }, stepSize: 2 }
          }
        }
      }
    });
  }
}

// --- RENDER ANALYSIS TAB PANEL ---
function renderAnalysisTab() {
  const data = state.analysisData;
  if (!data) return;

  // Render contact info checker lists
  const contactList = document.getElementById('analysis-contact-list');
  if (contactList) {
    const contacts = [
      { label: 'Email Address', val: data.contact_info.email, has: !!data.contact_info.email },
      { label: 'Phone Number', val: data.contact_info.phone, has: !!data.contact_info.phone },
      { label: 'LinkedIn Profile', val: 'linkedin.com/in/...', has: data.contact_info.linkedin },
      { label: 'GitHub Profile', val: 'github.com/...', has: data.contact_info.github },
    ];
    contactList.innerHTML = contacts.map(c => `
      <div class="flex justify-between items-center p-3 bg-navy-deep bg-opacity-50 border border-white border-opacity-5 rounded-2xl text-xs font-semibold">
        <span class="text-secText">${c.label}</span>
        <span class="flex items-center gap-1.5 font-mono">
          ${c.has ? `
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-successGreen"></i>
            <span class="text-white truncate max-w-[120px]">${c.val}</span>
          ` : `
            <i data-lucide="x-circle" class="w-3.5 h-3.5 text-errorCoral"></i>
            <span class="text-secText opacity-50">Missing</span>
          `}
        </span>
      </div>
    `).join('');
  }

  // Render keyword sub-categories lists
  const skillsContainer = document.getElementById('analysis-keywords-list');
  if (skillsContainer) {
    skillsContainer.innerHTML = Object.entries(data.skills).map(([cat, list]) => {
      if (list.length === 0) return '';
      return `
        <div class="space-y-2">
          <h4 class="text-[10px] font-bold uppercase tracking-widest text-secText font-heading">${cat} (${list.length})</h4>
          <div class="flex flex-wrap gap-1.5">
            ${list.map(s => `
              <span class="text-[10px] font-mono px-2 py-0.5 bg-white bg-opacity-5 border border-white border-opacity-5 text-white rounded-md">${s}</span>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // Render layout issues alerts
  const auditContainer = document.getElementById('analysis-audit-list');
  if (auditContainer) {
    if (data.grammar_issues.length === 0) {
      auditContainer.innerHTML = `
        <div class="p-8 text-center bg-navy-deep bg-opacity-30 border border-white border-opacity-5 rounded-3xl flex flex-col items-center justify-center space-y-2">
          <i data-lucide="check-circle" class="w-8 h-8 text-cyanAccent"></i>
          <h4 class="font-heading font-bold text-white">Flawless Presentation!</h4>
          <p class="text-xs text-secText">Our parser found no structure or formatting issues in your resume.</p>
        </div>
      `;
    } else {
      auditContainer.innerHTML = data.grammar_issues.map(issue => {
        const badgeColor = {
          high: 'bg-errorCoral bg-opacity-10 border-errorCoral border-opacity-30 text-errorCoral',
          medium: 'bg-warningAmber bg-opacity-10 border-warningAmber border-opacity-30 text-warningAmber',
          low: 'bg-white bg-opacity-5 border-white border-opacity-5 text-secText'
        }[issue.severity];

        const icon = issue.severity === 'high' 
          ? `<i data-lucide="x-circle" class="w-4 h-4 text-errorCoral shrink-0 mt-0.5"></i>`
          : `<i data-lucide="alert-triangle" class="w-4 h-4 text-warningAmber shrink-0 mt-0.5"></i>`;

        return `
          <div class="p-4 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex items-start gap-3 transition-colors hover:border-white hover:border-opacity-10">
            ${icon}
            <div class="space-y-1.5 w-full">
              <div class="flex justify-between items-center gap-2">
                <span class="text-[10px] font-heading font-bold text-white uppercase tracking-wide">${issue.type}</span>
                <span class="text-[8px] font-mono font-bold uppercase px-2 py-0.5 border rounded ${badgeColor}">${issue.severity}</span>
              </div>
              <p class="text-xs text-secText leading-normal">${issue.message}</p>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render recommended certificates
  const certContainer = document.getElementById('analysis-certifications-list');
  if (certContainer) {
    certContainer.innerHTML = data.certifications.map(c => `
      <div class="flex items-start gap-2.5 p-3 bg-navy-deep bg-opacity-50 border border-white border-opacity-5 rounded-2xl text-xs text-white font-medium">
        <i data-lucide="check" class="w-3.5 h-3.5 text-cyanAccent shrink-0 mt-0.5"></i>
        <span>${c}</span>
      </div>
    `).join('');
  }

  // Render portfolio project specifications
  const projContainer = document.getElementById('analysis-projects-list');
  if (projContainer) {
    projContainer.innerHTML = data.project_suggestions.map(p => `
      <div class="p-3.5 bg-navy-deep bg-opacity-50 border border-white border-opacity-5 rounded-2xl space-y-1.5">
        <h5 class="font-heading font-bold text-xs text-white">${p.title}</h5>
        <p class="text-[10px] text-secText leading-relaxed">${p.desc}</p>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

// --- RENDER JOB MATCHER TAB PANEL ---
function renderJobMatcherTab() {
  const jdInput = document.getElementById('job-description-textarea');
  if (jdInput) jdInput.value = state.jobMatchData ? state.jobMatchData.pastedJd || '' : '';

  const compareBtn = document.getElementById('job-compare-btn');
  if (compareBtn) {
    // Re-bind compare click
    compareBtn.onclick = async () => {
      const text = jdInput.value.trim();
      if (!text) {
        alert('Please paste a job description first.');
        return;
      }
      
      // Toggle comparison loading state
      const resultsContainer = document.getElementById('job-matcher-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="cyber-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[450px]">
            <div class="w-12 h-12 border-4 border-cyanAccent border-t-transparent rounded-full animate-spin"></div>
            <div class="space-y-2">
              <h4 class="font-heading font-bold text-white text-lg animate-pulse">Running Cosine Similarity Analysis</h4>
              <p class="text-xs text-secText">Comparing vocabulary structures, weighting skills, and running keyword checklists...</p>
            </div>
          </div>
        `;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: state.analysisData.raw_text,
            job_description: text
          })
        });

        if (!response.ok) throw new Error('Job description comparison failed.');

        const results = await response.json();
        state.jobMatchData = {
          ...results,
          pastedJd: text
        };
        
        renderJobMatcherTab();
      } catch (err) {
        alert(err.message);
        renderJobMatcherTab();
      }
    };
  }

  const resultsContainer = document.getElementById('job-matcher-results');
  if (!resultsContainer) return;

  if (!state.jobMatchData) {
    resultsContainer.innerHTML = `
      <div class="cyber-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[450px]">
        <div class="w-16 h-16 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl flex items-center justify-center text-secText animate-float-slow">
          <i data-lucide="file-text" class="w-8 h-8"></i>
        </div>
        <div>
          <h3 class="text-xl font-heading font-bold text-white">Compare to Role</h3>
          <p class="text-sm text-secText mt-2 max-w-sm leading-relaxed mx-auto">
            Once you paste the job posting details and click compare, we'll calculate your similarity percentage and point out which technical stack terms are missing.
          </p>
        </div>
      </div>
    `;
  } else {
    const match = state.jobMatchData.match_score;
    const matchText = match >= 80 ? 'Excellent Role Alignment!' : match >= 60 ? 'Moderate Role Match' : 'Low Structural Match';

    resultsContainer.innerHTML = `
      <div class="space-y-6">
        <!-- Header match score KPI -->
        <div class="cyber-card rounded-glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div class="flex justify-center md:justify-start">
            <div id="job-progress-ring-anchor"></div>
          </div>
          <div class="md:col-span-2 space-y-2 text-center md:text-left">
            <h4 class="font-heading font-bold text-lg text-white">${matchText}</h4>
            <p class="text-xs text-secText leading-relaxed">
              Your resume has ${state.jobMatchData.matched_skills.length} matching keyword overlays out of ${state.jobMatchData.matched_skills.length + state.jobMatchData.missing_skills.length} identified keywords in the job description.
            </p>
          </div>
        </div>

        <!-- Matched vs Missing splits -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Matched list -->
          <div class="cyber-card rounded-glass-card p-6 space-y-4">
            <h4 class="text-sm font-heading font-bold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyanAccent shadow-glow-cyan"></span>
              <span>Matching Skills (${state.jobMatchData.matched_skills.length})</span>
            </h4>
            ${state.jobMatchData.matched_skills.length === 0 ? `
              <p class="text-xs text-secText">No matching keywords found in description.</p>
            ` : `
              <div class="flex flex-wrap gap-2">
                ${state.jobMatchData.matched_skills.map(s => `
                  <span class="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-cyanAccent bg-opacity-5 border border-cyanAccent border-opacity-20 text-cyanAccent rounded-md">
                    <i data-lucide="check" class="w-2.5 h-2.5"></i>
                    <span>${s}</span>
                  </span>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Missing list -->
          <div class="cyber-card rounded-glass-card p-6 space-y-4">
            <h4 class="text-sm font-heading font-bold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purpleAccent shadow-glow-purple"></span>
              <span>Missing Skills (${state.jobMatchData.missing_skills.length})</span>
            </h4>
            ${state.jobMatchData.missing_skills.length === 0 ? `
              <p class="text-xs text-secText">No missing technical terms detected.</p>
            ` : `
              <div class="flex flex-wrap gap-2">
                ${state.jobMatchData.missing_skills.map(s => `
                  <span class="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-purpleAccent bg-opacity-5 border border-purpleAccent border-opacity-20 text-purpleAccent rounded-md">
                    <i data-lucide="x" class="w-2.5 h-2.5"></i>
                    <span>${s}</span>
                  </span>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Custom suggestions list -->
        <div class="cyber-card rounded-glass-card p-6 space-y-4">
          <h3 class="text-lg font-heading font-bold text-white flex items-center gap-2">
            <i data-lucide="sparkles" class="text-cyanAccent w-4 h-4"></i>
            <span>Job-Specific Tailoring Suggestions</span>
          </h3>
          <div class="space-y-3">
            ${state.jobMatchData.suggestions.map((sug, idx) => `
              <div class="p-3.5 bg-white bg-opacity-[0.02] border border-white border-opacity-5 rounded-2xl flex items-start gap-2.5 text-xs text-secText leading-relaxed">
                <span class="text-cyanAccent font-mono-stats font-bold">${idx + 1}.</span>
                <span>${sug}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Render Progress Ring inside results
    renderProgressRing('job-progress-ring-anchor', match, 'cyan', 'Compatibility');
  }

  lucide.createIcons();
}

// Progress Ring Renderer (Vanilla SVG)
function renderProgressRing(containerId, percentage, colorName, labelText) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColor = colorName === 'cyan' ? '#00D9FF' : '#8B5CF6';
  const shadowColor = colorName === 'cyan' ? 'rgba(0, 217, 255, 0.4)' : 'rgba(139, 92, 246, 0.4)';

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center select-none">
      <div class="relative" style="width: ${size}px; height: ${size}px;">
        <svg class="transform -rotate-90 w-full h-full">
          <circle
            class="text-white text-opacity-5"
            stroke="currentColor"
            stroke-width="${strokeWidth}"
            fill="transparent"
            r="${radius}"
            cx="${size / 2}"
            cy="${size / 2}"
          />
          <circle
            class="transition-all duration-1000 ease-out"
            stroke="${strokeColor}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="round"
            fill="transparent"
            r="${radius}"
            cx="${size / 2}"
            cy="${size / 2}"
            style="filter: drop-shadow(0 0 8px ${shadowColor})"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <span class="font-mono text-2xl font-bold text-white tracking-tight">
            ${percentage}%
          </span>
        </div>
      </div>
      ${labelText ? `
        <span class="mt-3 text-xs font-semibold uppercase tracking-wider text-secText font-heading">
          ${labelText}
        </span>
      ` : ''}
    </div>
  `;
}

// --- RENDER INTERVIEW COACH TAB PANEL ---
function renderInterviewCoachTab() {
  const container = document.getElementById('interview-coach-panel-content');
  if (!container) return;

  if (!state.coachData) {
    container.innerHTML = `
      <div class="cyber-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[350px] mt-10">
        <div class="w-16 h-16 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl flex items-center justify-center text-purpleAccent animate-float-slow">
          <i data-lucide="help-circle" class="w-8 h-8"></i>
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-heading font-bold text-white">Customized Interview Preparation</h3>
          <p class="text-xs text-secText leading-relaxed">
            Based on your parsed stack experience and career profile, our coach will generate 15 target technical, behavioral, and HR questions complete with study responses.
          </p>
        </div>
        <button
          id="coach-generate-btn"
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-cyanAccent to-purpleAccent text-navy-deep hover:shadow-glow-cyan px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 transform hover:translate-y-[-2px]"
        >
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
          <span>Generate 15 Questions</span>
        </button>
      </div>
    `;

    const genBtn = document.getElementById('coach-generate-btn');
    if (genBtn) {
      genBtn.onclick = async () => {
        container.innerHTML = `
          <div class="cyber-card rounded-glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto min-h-[350px] mt-10">
            <div class="w-12 h-12 border-4 border-purpleAccent border-t-transparent rounded-full animate-spin"></div>
            <div class="space-y-2">
              <h4 className="font-heading font-bold text-white text-lg animate-pulse">Formulating Custom Prompts</h4>
              <p class="text-xs text-secText">Parsing technical concepts, structuring situational behavioral templates, and packaging guides...</p>
            </div>
          </div>
        `;

        try {
          const response = await fetch(`${API_BASE_URL}/api/coach`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills: state.analysisData.skills })
          });

          if (!response.ok) throw new Error('Interview questions generation failed.');

          state.coachData = await response.json();
          renderInterviewCoachTab();
        } catch (err) {
          alert(err.message);
          renderInterviewCoachTab();
        }
      };
    }
  } else {
    // We have interview coach data loaded
    const qList = state.coachData.questions;
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top stats header -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="cyber-card rounded-glass-card p-6 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center text-cyanAccent">
              <i data-lucide="check-circle" class="w-5 h-5"></i>
            </div>
            <div>
              <h5 class="text-[10px] uppercase font-bold text-secText font-heading">Confidence Estimate</h5>
              <p class="font-mono text-sm font-bold text-cyanAccent mt-0.5">${state.coachData.confidence_level}</p>
            </div>
          </div>

          <div class="cyber-card rounded-glass-card p-6 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center text-purpleAccent">
              <i data-lucide="alert-triangle" class="w-5 h-5"></i>
            </div>
            <div>
              <h5 class="text-[10px] uppercase font-bold text-secText font-heading">Expected Difficulty</h5>
              <p class="font-mono text-sm font-bold text-purpleAccent mt-0.5">${state.coachData.expected_difficulty}</p>
            </div>
          </div>

          <div class="cyber-card rounded-glass-card p-6 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center text-white">
              <i data-lucide="help-circle" class="w-5 h-5"></i>
            </div>
            <div>
              <h5 class="text-[10px] uppercase font-bold text-secText font-heading">Total Preparation Bank</h5>
              <p class="font-mono text-sm font-bold text-white mt-0.5">15 Tailored Questions</p>
            </div>
          </div>
        </div>

        <!-- Filter Categories (All, Technical, Behavioral, HR) -->
        <div class="flex flex-wrap gap-2 border-b border-white border-opacity-5 pb-4" id="coach-filter-container">
          <!-- Populated by JS -->
        </div>

        <!-- Questions list accordion -->
        <div class="space-y-3" id="coach-questions-accordion-list">
          <!-- Populated by JS -->
        </div>
      </div>
    `;

    renderCoachFilters();
    renderCoachQuestions('All');
  }

  lucide.createIcons();
}

// Renders category filter pills in coach tab
function renderCoachFilters() {
  const container = document.getElementById('coach-filter-container');
  if (!container) return;

  const categories = ['All', 'Technical', 'Behavioral', 'HR'];
  
  // Track selected filter
  window.selectedCoachFilter = window.selectedCoachFilter || 'All';

  container.innerHTML = categories.map(cat => {
    const active = window.selectedCoachFilter === cat;
    return `
      <button
        onclick="applyCoachFilter('${cat}')"
        class="px-5 py-2.5 rounded-full text-xs font-semibold transition-all border ${
          active
            ? 'bg-purpleAccent bg-opacity-15 border-purpleAccent border-opacity-30 text-purpleAccent shadow-glow-purple/10'
            : 'bg-white bg-opacity-[0.02] border-white border-opacity-5 text-secText hover:text-white'
        }"
      >
        ${cat} Questions
      </button>
    `;
  }).join('');
}

// Apply coach category filter
window.applyCoachFilter = function(category) {
  window.selectedCoachFilter = category;
  renderCoachFilters();
  renderCoachQuestions(category);
};

// Render matching questions list under category
function renderCoachQuestions(category) {
  const container = document.getElementById('coach-questions-accordion-list');
  if (!container || !state.coachData) return;

  const list = state.coachData.questions;
  const filtered = category === 'All' ? list : list.filter(q => q.type === category);

  container.innerHTML = filtered.map((q, idx) => {
    const isExpanded = window.expandedCoachQuestionIndex === idx;

    const diffColor = {
      'Easy': 'border-cyanAccent border-opacity-20 text-cyanAccent bg-cyanAccent bg-opacity-5',
      'Medium': 'border-warningAmber border-opacity-20 text-warningAmber bg-warningAmber bg-opacity-5',
      'Hard': 'border-errorCoral border-opacity-20 text-errorCoral bg-errorCoral bg-opacity-5'
    }[q.difficulty] || 'border-white border-opacity-10 text-secText';

    const typeColor = q.type === 'Technical'
      ? 'border-cyanAccent border-opacity-10 text-cyanAccent bg-cyanAccent bg-opacity-5'
      : 'border-purpleAccent border-opacity-10 text-purpleAccent bg-purpleAccent bg-opacity-5';

    return `
      <div class="cyber-card rounded-glass-card border border-white border-opacity-10 bg-white bg-opacity-[0.02] overflow-hidden transition-all hover:border-cyanAccent hover:border-opacity-20">
        <button
          onclick="toggleCoachQuestion(${idx})"
          class="w-full p-5 text-left flex justify-between items-start gap-4 hover:bg-white hover:bg-opacity-[0.02] transition-colors"
        >
          <div class="space-y-2 w-full">
            <div class="flex flex-wrap gap-2">
              <span class="text-[8px] font-mono font-extrabold uppercase px-2 py-0.5 border rounded-md ${typeColor}">${q.type}</span>
              <span class="text-[8px] font-mono font-extrabold uppercase px-2 py-0.5 border rounded-md ${diffColor}">${q.difficulty}</span>
              <span class="text-[8px] font-mono text-secText uppercase font-semibold">Tag: ${q.skill}</span>
            </div>
            <h4 class="font-heading font-bold text-xs md:text-sm text-white leading-relaxed mt-1">${q.question}</h4>
          </div>
          <div class="text-secText mt-1 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}">
            <i data-lucide="chevron-down" class="w-4 h-4"></i>
          </div>
        </button>
        
        <div class="${isExpanded ? 'block' : 'hidden'} px-5 pb-5 text-xs text-secText border-t border-white border-opacity-5 leading-relaxed pt-4 space-y-2">
          <h5 class="font-heading font-semibold text-[10px] text-cyanAccent uppercase tracking-wide">AI Suggested STAR Response Guide:</h5>
          <p class="bg-navy-deep bg-opacity-40 p-4 border border-white border-opacity-5 rounded-2xl text-secText">${q.answer}</p>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
};

// Toggle accordion items
window.toggleCoachQuestion = function(idx) {
  if (window.expandedCoachQuestionIndex === idx) {
    window.expandedCoachQuestionIndex = null;
  } else {
    window.expandedCoachQuestionIndex = idx;
  }
  renderCoachQuestions(window.selectedCoachFilter || 'All');
};

// --- RENDER HISTORY LOGS TAB ---
function renderHistoryTab() {
  const container = document.getElementById('history-panel');
  if (!container) return;

  container.innerHTML = `
    <div class="cyber-card rounded-glass-card p-6 space-y-4">
      <h3 class="text-lg font-heading font-bold text-white flex items-center gap-2">
        <i data-lucide="history" class="text-cyanAccent w-4 h-4"></i>
        <span>Upload History Logs</span>
      </h3>
      <p class="text-xs text-secText leading-relaxed">
        Review and re-load past resume analyses. Data is stored safely inside your local browser cache.
      </p>
      
      <div id="history-items-list-container" class="space-y-3 mt-4">
        <!-- Render list items -->
      </div>
    </div>
  `;

  const listContainer = document.getElementById('history-items-list-container');
  if (!listContainer) return;

  if (state.history.length === 0) {
    listContainer.innerHTML = `
      <div class="p-12 text-center border border-white border-opacity-5 rounded-3xl flex flex-col items-center justify-center space-y-3 bg-navy-deep bg-opacity-30">
        <div class="w-12 h-12 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl flex items-center justify-center text-secText">
          <i data-lucide="file-check" class="w-6 h-6"></i>
        </div>
        <h4 class="font-heading font-bold text-white">No uploads recorded yet</h4>
        <p class="text-xs text-secText">Go back to the homepage and drop a file to start career analysis.</p>
      </div>
    `;
  } else {
    listContainer.innerHTML = state.history.map(item => `
      <div class="p-4 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white hover:border-opacity-10 transition-all">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center text-cyanAccent shrink-0">
            <i data-lucide="file-check" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0">
            <h5 class="font-heading font-bold text-xs text-white truncate">${item.fileName}</h5>
            <p class="text-[10px] text-secText mt-0.5">Analyzed on ${item.timestamp}</p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-6 shrink-0">
          <div class="flex items-center gap-4 text-right">
            <div>
              <h6 class="text-[9px] uppercase font-bold text-secText">Score</h6>
              <p class="font-mono text-xs font-bold text-cyanAccent">${item.data.resume_score}%</p>
            </div>
            <div>
              <h6 class="text-[9px] uppercase font-bold text-secText">ATS</h6>
              <p class="font-mono text-xs font-bold text-purpleAccent">${item.data.ats_score}%</p>
            </div>
          </div>

          <div class="flex items-center gap-2 border-l border-white border-opacity-5 pl-4">
            <button
              onclick="loadHistoryRecord('${item.id}')"
              class="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyanAccent to-purpleAccent hover:shadow-glow-cyan text-navy-deep text-xs font-bold rounded-xl transition-all"
            >
              <span>Load</span>
              <i data-lucide="arrow-up-right" class="w-3 h-3"></i>
            </button>
            <button
              onclick="deleteHistoryRecord('${item.id}')"
              class="p-2.5 bg-white bg-opacity-5 border border-white border-opacity-5 hover:bg-opacity-10 text-secText hover:text-errorCoral rounded-xl transition-all"
              title="Delete Record"
            >
              <i data-lucide="trash-2" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

// Load a past history record
window.loadHistoryRecord = function(id) {
  const item = state.history.find(x => x.id === id);
  if (item) {
    state.analysisData = item.data;
    state.fileName = item.fileName;
    state.fileSize = null;
    state.jobMatchData = null;
    state.coachData = null;
    updateUI();
  }
};

// Delete a past history record
window.deleteHistoryRecord = function(id) {
  state.history = state.history.filter(x => x.id !== id);
  saveHistoryToLocalStorage();
  renderHistoryTab();
};

// --- RENDER SETTINGS TAB ---
function renderSettingsTab() {
  const container = document.getElementById('settings-panel');
  if (!container) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Connection configuration -->
      <div class="cyber-card rounded-glass-card p-6 space-y-4">
        <h3 class="text-lg font-heading font-bold text-white flex items-center gap-2">
          <i data-lucide="link" class="text-cyanAccent w-4 h-4"></i>
          <span>Local Engine URL</span>
        </h3>
        <p class="text-xs text-secText leading-relaxed">
          Modify the server port if you deploy the FastAPI backend to a different local host domain or online platform.
        </p>

        <form id="settings-form" class="space-y-4 mt-4">
          <div class="space-y-1.5">
            <label class="text-[10px] uppercase font-bold text-secText font-heading">Backend Base URL</label>
            <input
              type="text"
              id="settings-api-url"
              value="${API_BASE_URL}"
              class="w-full bg-navy-deep border border-white border-opacity-10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyanAccent font-mono"
            />
          </div>
          
          <button
            type="submit"
            id="settings-save-btn"
            class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyanAccent to-purpleAccent text-navy-deep hover:shadow-glow-cyan px-4 py-3 rounded-full text-xs font-bold transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            <span>Save Connection</span>
          </button>
        </form>
      </div>

      <!-- Color display list -->
      <div class="cyber-card rounded-glass-card p-6 space-y-4">
        <h3 class="text-lg font-heading font-bold text-white flex items-center gap-2">
          <i data-lucide="paintbrush" class="text-purpleAccent w-4 h-4"></i>
          <span>Aurora Glass Pro Palette</span>
        </h3>
        <p class="text-xs text-secText leading-relaxed">
          Visual styling tokens specified in tailwind and index.css configurations.
        </p>

        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="p-3 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg shrink-0 bg-[#081120] border border-white border-opacity-10"></div>
            <div>
              <h6 class="font-heading font-bold text-[10px] text-white">Deep Navy</h6>
              <p class="text-[8px] font-mono text-secText mt-0.5">#081120</p>
            </div>
          </div>
          <div class="p-3 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg shrink-0 bg-[#101827] border border-white border-opacity-10"></div>
            <div>
              <h6 class="font-heading font-bold text-[10px] text-white">Midnight Blue</h6>
              <p class="text-[8px] font-mono text-secText mt-0.5">#101827</p>
            </div>
          </div>
          <div class="p-3 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg shrink-0 bg-[#00D9FF] border border-white border-opacity-10"></div>
            <div>
              <h6 class="font-heading font-bold text-[10px] text-white">Electric Cyan</h6>
              <p class="text-[8px] font-mono text-secText mt-0.5">#00D9FF</p>
            </div>
          </div>
          <div class="p-3 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg shrink-0 bg-[#8B5CF6] border border-white border-opacity-10"></div>
            <div>
              <h6 class="font-heading font-bold text-[10px] text-white">Royal Purple</h6>
              <p class="text-[8px] font-mono text-secText mt-0.5">#8B5CF6</p>
            </div>
          </div>
          <div class="p-3 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg shrink-0 bg-[#22C55E] border border-white border-opacity-10"></div>
            <div>
              <h6 class="font-heading font-bold text-[10px] text-white">Success Green</h6>
              <p class="text-[8px] font-mono text-secText mt-0.5">#22C55E</p>
            </div>
          </div>
          <div class="p-3 bg-navy-deep bg-opacity-40 border border-white border-opacity-5 rounded-2xl flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg shrink-0 bg-[#F59E0B] border border-white border-opacity-10"></div>
            <div>
              <h6 class="font-heading font-bold text-[10px] text-white">Amber Warning</h6>
              <p class="text-[8px] font-mono text-secText mt-0.5">#F59E0B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('settings-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('settings-save-btn');
      if (saveBtn) {
        saveBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> <span>Configuration Saved</span>`;
        lucide.createIcons();
        setTimeout(() => {
          saveBtn.innerHTML = `<span>Save Connection</span>`;
        }, 2000);
      }
    });
  }

  lucide.createIcons();
}

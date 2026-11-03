// ======================================================
// 0. LOADING SCREEN
// ======================================================

(function () {
  const screen = document.getElementById("loading-screen");
  const line = document.getElementById("loading-line");

  const bootLines = [
    "  initializing portfolio...",
    "  loading assets...",
    "  compiling stylesheets...",
    "  mounting components...",
    "  starting dev server...",
    "  ready.",
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let typeTimer = null;

  function typeNext() {
    const current = bootLines[lineIdx];

    if (charIdx <= current.length) {
      line.textContent = current.slice(0, charIdx);
      charIdx++;
      typeTimer = setTimeout(typeNext, 38);
    } else {
      // Pause at end of line, then move to next
      charIdx = 0;
      lineIdx++;

      if (lineIdx < bootLines.length) {
        typeTimer = setTimeout(typeNext, 420);
      } else {
        // All lines done — hide loading screen
        setTimeout(dismissLoader, 500);
      }
    }
  }

  // Dismiss loading screen
  function dismissLoader() {
    screen.remove();
  }

  // Start typing after a tiny delay so the Lottie has a frame to render
  setTimeout(typeNext, 300);

  // Safety net: force-dismiss after 8 s no matter what
  setTimeout(dismissLoader, 8000);
})();

//    SECTION NAVIGATION
//    Syncs: tabs, tree items, breadcrumb, section display

const fileNames = {
  readme: { file: "README.md", lang: "Markdown" },
  home: { file: "home.tsx", lang: "TypeScript React" },
  about: { file: "project.js", lang: "JavaScript" },
  skills: { file: "skills.html", lang: "HTML" },
  certifications: { file: "certifications.html", lang: "HTML" },
  experience: { file: "experience.ts", lang: "TypeScript" },
  projects: { file: "projects.css", lang: "CSS" },
  contact: { file: "contact.css", lang: "CSS" },
};

function navigateTo(section) {
  // Guard
  if (!fileNames[section]) return;

  // -- Tabs --
  document.querySelectorAll(".tab").forEach((tab) => {
    // Re-open hidden tab if needed
    if (tab.dataset.section === section) {
      tab.style.display = "flex";
    }
    tab.classList.toggle("active", tab.dataset.section === section);
  });

  // -- Tree items --
  document.querySelectorAll(".tree-item[data-section]").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === section);
  });

  // -- Breadcrumb --
  const bc = document.getElementById("breadcrumbFile");
  if (bc) bc.textContent = fileNames[section].file;

  // -- Status bar language --
  const lang = document.getElementById("statusLang");
  if (lang) lang.textContent = fileNames[section].lang;

  // -- Sections --
  document.querySelectorAll(".editor-section").forEach((s) => {
    s.classList.toggle("active", s.id === "section-" + section);
  });

  // Scroll editor to top on switch
  const editor = document.getElementById("editorMain");
  if (editor) editor.scrollTo({ top: 0, behavior: "smooth" });

  updateEmptyEditorState();
}

// Update empty editor state
function updateEmptyEditorState() {
  const visibleTabs = [...document.querySelectorAll(".tab")].filter(
    (tab) => tab.style.display !== "none",
  );

  const emptyState = document.getElementById("empty-editor-state");

  if (!emptyState) return;

  if (visibleTabs.length === 0) {
    document.querySelectorAll(".editor-section").forEach((section) => {
      section.classList.remove("active");
    });

    const breadcrumb = document.querySelector(".breadcrumb");
    if (breadcrumb) {
      breadcrumb.style.display = "none";
    }

    emptyState.style.display = "flex";
  } else {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (breadcrumb) {
      breadcrumb.style.display = "";
    }

    emptyState.style.display = "none";
  }
}

// Wire up tabs
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => navigateTo(tab.dataset.section));
});

// Wire up tree items
document.querySelectorAll(".tree-item[data-section]").forEach((item) => {
  item.addEventListener("click", () => {
    const section = item.dataset.section;

    const tab = document.querySelector(`.tab[data-section="${section}"]`);

    if (tab) {
      tab.style.display = "flex";
    }

    navigateTo(section);
  });
});

// ======================================================
// TAB CLOSE FUNCTIONALITY
// ======================================================

document.querySelectorAll(".tab-close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const tab = closeBtn.closest(".tab");
    if (!tab) return;

    // Prevent permanent tabs from closing
    if (tab.classList.contains("tab--permanent")) {
      return;
    }

    const wasActive = tab.classList.contains("active");

    // Get visible tabs BEFORE closing
    const visibleTabs = [...document.querySelectorAll(".tab")].filter(
      (t) => t.style.display !== "none",
    );

    const closedIndex = visibleTabs.indexOf(tab);

    // Hide tab
    tab.style.display = "none";

    if (wasActive) {
      const remainingTabs = visibleTabs.filter((t) => t !== tab);

      if (remainingTabs.length > 0) {
        const previousTab = remainingTabs[Math.max(0, closedIndex - 1)];

        navigateTo(previousTab.dataset.section);
      } else {
        updateEmptyEditorState();
      }
    } else {
      updateEmptyEditorState();
    }
  });
});

// CLOSE WHEN CLICKING OUTSIDE (MOBILE)
const mobileSheetBackdrop = document.getElementById("mobileSheetBackdrop");

mobileSheetBackdrop?.addEventListener("click", () => {
  document.getElementById("mobileFileSheet")?.classList.remove("open");

  mobileSheetBackdrop.classList.remove("open");
});

// Explorer toggle (sidebar icon)
const explorerToggle = document.getElementById("explorerToggle");

const explorer = document.getElementById("explorer");

const mobileExplorerBtn = document.getElementById("mobileExplorerBtn");

const mobileDownloadBtn = document.getElementById("mobileDownloadBtn");

const mobileSearchBtn = document.getElementById("mobileSearchBtn");

const commandPaletteBackdrop = document.getElementById(
  "commandPaletteBackdrop",
);

const commandPaletteClose = document.getElementById("commandPaletteClose");

const commandPaletteInput = document.getElementById("commandPaletteInput");

const commandPaletteResults = document.getElementById("commandPaletteResults");

const sidebarSearchBtn = document.getElementById("sidebarSearchBtn");

function openCommandPalette() {
  commandPaletteBackdrop?.classList.add("open");
  selectedSearchIndex = -1;

  commandPaletteInput.value = "";

  renderSearchResults(searchData);

  commandPaletteInput?.focus();
}
function closeCommandPalette() {
  commandPaletteBackdrop?.classList.remove("open");
}

/* SEARCH BUTTON */
mobileSearchBtn?.addEventListener("click", openCommandPalette);

sidebarSearchBtn?.addEventListener("click", openCommandPalette);

/* ESC BUTTON */
commandPaletteClose?.addEventListener("click", closeCommandPalette);

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    event.preventDefault();

    openCommandPalette();
  }
});

/* DOWNLOAD BUTTON */
mobileDownloadBtn?.addEventListener("click", downloadResume);

/* EXPLORER BUTTON */
mobileExplorerBtn?.addEventListener("click", () => {
  explorerToggle?.click();
});

explorerToggle &&
  explorerToggle.addEventListener("click", () => {
    explorer.classList.toggle("collapsed");
    explorerToggle.classList.toggle("active");
  });
/* =========================================
   COPILOT PANEL TOGGLE
========================================= */

const copilotPanel = document.getElementById("copilotPanel");

/* SIDEBAR COPILOT BUTTON */
const sidebarCopilotBtn = document.getElementById("copilotToggle");

/* STATUS BAR COPILOT BUTTON */
const statusCopilotBtn = document.getElementById("statusCopilot");

const mobileCopilotBtn = document.getElementById("mobileCopilotBtn");

function toggleCopilot() {
  document.getElementById("mobileFileSheet")?.classList.remove("open");

  copilotPanel.classList.toggle("collapsed");
}

/* BOTH BUTTONS OPEN CHAT */
sidebarCopilotBtn?.addEventListener("click", toggleCopilot);

statusCopilotBtn?.addEventListener("click", toggleCopilot);
mobileCopilotBtn?.addEventListener("click", toggleCopilot);

/* CLOSE BUTTON */
const copilotClose = document.getElementById("copilotClose");

copilotClose?.addEventListener("click", () => {
  copilotPanel.classList.add("collapsed");
});

// ======================================================
// 2. TYPING ANIMATION
//    Cycles through multiple subtitle strings
// ======================================================

const typingEl = document.getElementById("typingText");
const phrases = [
  "> Building modern web applications",
  "> Designing intuitive user experiences",
  "> Transforming data into insights",
  "> Creating impactful digital solutions",
  "> Web Developer • UI/UX Designer • Data Analyst",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  if (typingEl) typingEl.textContent = current.slice(0, charIndex);

  let speed = isDeleting ? 45 : 75;

  if (!isDeleting && charIndex === current.length) {
    // Pause at end
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  typingTimer = setTimeout(type, speed);
}

// Start typing after a short delay
setTimeout(type, 800);

// ======================================================
// 3. STATUS BAR CLOCK
// ======================================================

function updateClock() {
  const el = document.getElementById("statusTime");
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  el.textContent = `${h}:${m}`;
}

updateClock();
setInterval(updateClock, 10000);

/* =========================
   TIMELINE SCROLL EFFECT
========================= */

const timelineRows = document.querySelectorAll(".timeline-row");

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.01,
  },
);

timelineRows.forEach((row) => {
  timelineObserver.observe(row);
});

// ======================================================
// 4. CONTACT FORM SEND HANDLER
// ======================================================

async function handleSend() {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const subject = document.getElementById("contactSubject").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showToast("Please enter a valid email address.", "error");

    return;
  }

  const sendBtn = document.getElementById("sendBtn");

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  try {
    await emailjs.send("service_8bx1n6c", "template_e2pqjb3", {
      name: name,
      email: email,
      subject: subject,
      message: message,
    });

    showToast("Message sent successfully!", "success");
    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactSubject").value = "";
    document.getElementById("contactMessage").value = "";
  } catch (error) {
    console.error(error);

    showToast("Failed to send message.", "error");
  }

  sendBtn.disabled = false;
  sendBtn.textContent = "Send Message";
}

// ======================================================
// 5. TOAST NOTIFICATIONS
// ======================================================

function showToast(message, type = "info") {
  // Remove any existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add("toast--show"));

  setTimeout(() => {
    toast.classList.remove("toast--show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Inject toast styles dynamically
const toastStyle = document.createElement("style");
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 40px; right: 24px;
    background: #252538;
    border: 1px solid #2e2e45;
    border-left: 3px solid #7c3aed;
    color: #cdd6f4;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 9999;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    max-width: 340px;
  }
  .toast--show { opacity: 1; transform: translateY(0); }
  .toast--success { border-left-color: #a6e3a1; }
  .toast--error   { border-left-color: #f38ba8; }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-6px); }
    40%,80% { transform: translateX(6px); }
  }
  .shake { animation: shake 0.5s ease; }
`;
document.head.appendChild(toastStyle);

// ======================================================
// 6. SKILL BAR INTERSECTION OBSERVER
//    Animates bars only when they scroll into view
// ======================================================

const skillFills = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Reset and replay animation
        const el = entry.target;
        el.style.animation = "none";
        requestAnimationFrame(() => {
          el.style.animation = "";
        });
        skillObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.2 },
);

skillFills.forEach((fill) => skillObserver.observe(fill));

// ======================================================
// 7. KEYBOARD SHORTCUTS (Ctrl+1..6 = switch sections)
// ======================================================

const sections = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    const n = parseInt(e.key);
    if (n >= 1 && n <= sections.length) {
      e.preventDefault();
      navigateTo(sections[n - 1]);
    }
  }
});
function downloadResume() {
  const link = document.createElement("a");

  link.href = "files/Madronero_Kristine_Resume.pdf";
  link.download = "Madronero_Kristine_Resume.pdf";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Explorer resume item
document
  .getElementById("downloadResume")
  ?.addEventListener("click", downloadResume);

// Left sidebar download button
document
  .getElementById("sidebarResumeDownload")
  ?.addEventListener("click", downloadResume);
document
  .getElementById("downloadResumeHero")
  ?.addEventListener("click", downloadResume);

/*CONTENT INDEX FOR COMMAND PALETTE SEARCH*/
function buildContentIndex() {
  const sections = document.querySelectorAll(".editor-section");

  return [...sections].map((section) => ({
    id: section.id,

    section: section.id.replace("section-", ""),

    text: section.innerText.toLowerCase(),
  }));
}

const contentIndex = buildContentIndex();

/*SEARCH DATA*/
const searchData = [
  /* FILES */
  {
    category: "FILES",
    title: "README.md",
    section: "readme",
    icon: "https://cdn.simpleicons.org/markdown",
  },
  {
    category: "FILES",
    title: "home.tsx",
    section: "home",
    icon: "icons/section-typescri.png",
  },

  {
    category: "FILES",
    title: "about.js",
    section: "about",
    icon: "icons/section-javasc.jpg",
  },

  {
    category: "FILES",
    title: "skills.html",
    section: "skills",
    icon: "icons/section-hypertxtml.png",
  },

  {
    category: "FILES",
    title: "certifications.html",
    section: "certifications",
    icon: "icons/section-hypertxtml.png",
  },

  {
    category: "FILES",
    title: "experience.tsx",
    section: "experience",
    icon: "icons/section-typescri.png",
  },

  {
    category: "FILES",
    title: "projects.css",
    section: "projects",
    icon: "icons/section-cascss.png",
  },

  {
    category: "FILES",
    title: "contact.css",
    section: "contact",
    icon: "icons/section-cascss.png",
  },

  /* SKILLS */

  {
    category: "SKILLS",
    title: "HTML",
    section: "skills",
  },

  {
    category: "SKILLS",
    title: "CSS",
    section: "skills",
  },

  {
    category: "SKILLS",
    title: "JavaScript",
    section: "skills",
  },

  {
    category: "SKILLS",
    title: "React",
    section: "skills",
  },

  /* PROJECTS */

  {
    category: "PROJECTS",
    title: "Portfolio Website",
    section: "projects",
  },

  {
    category: "HOME",
    title: "Web Development",
    description: "Frontend and Mobile Development",
    section: "home",
    keywords: ["frontend", "developer", "web", "mobile", "react"],
  },

  {
    category: "HOME",
    title: "Data Analytics",
    description: "Transforming Data Into Insights",
    section: "home",
    keywords: ["data", "analytics", "insights", "visualization"],
  },

  {
    category: "PROJECTS",
    title: "Portfolio Website",
    description: "Personal Portfolio Project",
    section: "projects",
    keywords: ["portfolio", "website", "frontend", "react"],
  },

  {
    category: "SKILLS",
    title: "React",
    description: "Frontend Development Skill",
    section: "skills",
    keywords: ["react", "frontend", "javascript", "web development"],
  },
  /* =========================================
   EXPERIENCE
========================================= */

  {
    category: "EXPERIENCE",
    title: "Frontend Development",
    description: "Building Responsive Web Applications",
    section: "experience",
    keywords: [
      "frontend",
      "react",
      "javascript",
      "web development",
      "responsive",
      "ui",
    ],
  },

  {
    category: "EXPERIENCE",
    title: "UI/UX Design",
    description: "Designing User-Centered Interfaces",
    section: "experience",
    keywords: ["ui", "ux", "figma", "wireframe", "prototype", "design"],
  },

  {
    category: "EXPERIENCE",
    title: "Data Analytics",
    description: "Transforming Data Into Insights",
    section: "experience",
    keywords: [
      "data",
      "analytics",
      "dashboard",
      "visualization",
      "reporting",
      "insights",
    ],
  },

  /* =========================================
   CERTIFICATIONS
========================================= */

  {
    category: "CERTIFICATIONS",
    title: "Professional Certifications",
    description: "Industry-Recognized Credentials",
    section: "certifications",
    keywords: [
      "certificate",
      "certification",
      "credential",
      "achievement",
      "course",
    ],
  },

  {
    category: "CERTIFICATIONS",
    title: "Data Analytics Certifications",
    description: "Data Analysis and Visualization",
    section: "certifications",
    keywords: ["analytics", "data", "tableau", "dashboard", "visualization"],
  },

  {
    category: "CERTIFICATIONS",
    title: "Web Development Certifications",
    description: "Frontend and Web Technologies",
    section: "certifications",
    keywords: ["frontend", "html", "css", "javascript", "web development"],
  },

  /* =========================================
   PROJECTS
========================================= */

  {
    category: "PROJECTS",
    title: "Portfolio Website",
    description: "VS Code Inspired Portfolio",
    section: "projects",
    keywords: ["portfolio", "website", "frontend", "react", "design"],
  },

  {
    category: "PROJECTS",
    title: "Data Analytics Projects",
    description: "Dashboards and Reports",
    section: "projects",
    keywords: ["data", "dashboard", "analytics", "visualization", "tableau"],
  },

  {
    category: "PROJECTS",
    title: "Web Development Projects",
    description: "Interactive Applications",
    section: "projects",
    keywords: ["web", "frontend", "html", "css", "javascript"],
  },

  /* =========================================
   CONTACT
========================================= */

  {
    category: "CONTACT",
    title: "Get In Touch",
    description: "Send a Message",
    section: "contact",
    keywords: ["contact", "email", "message", "reach out", "hire"],
  },

  {
    category: "CONTACT",
    title: "LinkedIn",
    description: "Professional Networking",
    section: "contact",
    keywords: ["linkedin", "profile", "network", "professional"],
  },

  {
    category: "CONTACT",
    title: "GitHub",
    description: "Source Code and Projects",
    section: "contact",
    keywords: ["github", "repository", "code", "projects"],
  },

  /* =========================================
   ADDITIONAL SKILLS
========================================= */

  {
    category: "SKILLS",
    title: "Python",
    description: "Programming Language",
    section: "skills",
    keywords: ["python", "programming", "data analysis", "automation"],
  },

  {
    category: "SKILLS",
    title: "SQL",
    description: "Database Query Language",
    section: "skills",
    keywords: ["sql", "database", "queries", "mysql"],
  },

  {
    category: "SKILLS",
    title: "Figma",
    description: "UI/UX Design Tool",
    section: "skills",
    keywords: ["figma", "design", "prototype", "wireframe", "ui", "ux"],
  },

  {
    category: "SKILLS",
    title: "Data Analytics",
    description: "Analysis and Visualization",
    section: "skills",
    keywords: ["data", "analytics", "dashboard", "visualization", "insights"],
  },
];

let selectedSearchIndex = -1;

//AUTOSCROLL TO MATCHING SEARCH RESULT
function scrollToSearchMatch(sectionName, searchTerm) {
  const section = document.getElementById("section-" + sectionName);

  if (!section) return;

  const elements = section.querySelectorAll("*");

  const exactMatch = [...elements].find((el) => {
    const text = el.textContent?.trim().toLowerCase();

    return text === searchTerm.toLowerCase();
  });

  const partialMatch = [...elements].find((el) => {
    const text = el.textContent?.trim().toLowerCase();

    if (!text) return false;

    return text.includes(searchTerm.toLowerCase()) && text.length < 300;
  });

  const match = exactMatch || partialMatch;

  if (!match) return;

  match.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function renderSearchResults(results) {
  if (!commandPaletteResults) return;

  commandPaletteResults.innerHTML = "";

  if (results.length === 0) {
    commandPaletteResults.innerHTML = `
      <div class="command-group">
        <div class="command-group-title">
          NO RESULTS
        </div>
      </div>
    `;

    return;
  }

  const grouped = {};

  results.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }

    grouped[item.category].push(item);
  });

  Object.keys(grouped).forEach((category) => {
    const group = document.createElement("div");

    group.className = "command-group";

    group.innerHTML = `
      <div class="command-group-title">
        ${category}
      </div>
    `;

    grouped[category].forEach((item) => {
      const currentIndex = document.querySelectorAll(".command-result").length;
      const button = document.createElement("button");

      button.className = "command-result";
      button.dataset.index =
        document.querySelectorAll(".command-result").length;

      button.innerHTML = `

  ${
    item.icon
      ? `
        <img
          src="${item.icon}"
          class="command-result-icon"
          alt=""
        >
      `
      : ""
  }

  <div class="command-result-content">

    <div class="command-result-title">
      ${item.title}
    </div>

    ${
      item.description
        ? `
          <div class="command-result-description">
            ${item.description}
          </div>
        `
        : ""
    }

  </div>
  `;

      button.addEventListener("click", () => {
        const tab = document.querySelector(
          `.tab[data-section="${item.section}"]`,
        );

        if (tab) {
          tab.style.display = "flex";
        }

        navigateTo(item.section);

        closeCommandPalette();

        if (item.searchTerm) {
          setTimeout(() => {
            scrollToSearchMatch(item.section, item.searchTerm);
          }, 300);
        }
      });

      group.appendChild(button);
    });

    commandPaletteResults.appendChild(group);
  });
}

function updateSearchSelection() {
  const results = document.querySelectorAll(".command-result");

  results.forEach((result) => {
    result.classList.remove("active");
  });

  if (selectedSearchIndex >= 0 && selectedSearchIndex < results.length) {
    results[selectedSearchIndex].classList.add("active");

    results[selectedSearchIndex].scrollIntoView({
      block: "nearest",
    });
  }
}

commandPaletteInput?.addEventListener("input", () => {
  const query = commandPaletteInput.value.trim().toLowerCase();

  if (!query) {
    renderSearchResults(searchData);

    return;
  }

  const searchDataMatches = searchData.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(query);

    const keywordMatch = item.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(query),
    );

    return titleMatch || keywordMatch;
  });

  const contentMatches = contentIndex
    .filter((section) => section.text.includes(query))
    .map((section) => ({
      category: "CONTENT",

      title: section.section.charAt(0).toUpperCase() + section.section.slice(1),

      description: `Found "${query}" in ${section.section}`,

      section: section.section,

      searchTerm: query,
    }));

  const filtered = [...searchDataMatches, ...contentMatches];

  renderSearchResults(filtered);
});

commandPaletteInput?.addEventListener("keydown", (event) => {
  const results = document.querySelectorAll(".command-result");

  if (!results.length) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();

    selectedSearchIndex++;

    if (selectedSearchIndex >= results.length) {
      selectedSearchIndex = 0;
    }

    updateSearchSelection();
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();

    selectedSearchIndex--;

    if (selectedSearchIndex < 0) {
      selectedSearchIndex = results.length - 1;
    }

    updateSearchSelection();
  }

  if (event.key === "Enter") {
    event.preventDefault();

    if (selectedSearchIndex >= 0) {
      results[selectedSearchIndex].click();
    }
  }

  if (event.key === "Escape") {
    closeCommandPalette();
  }
});

/* =========================================
   MOBILE FILE SHEET
========================================= */

const mobileFileItems = document.querySelectorAll(".mobile-file-item");
const mobileFileSheet = document.getElementById("mobileFileSheet");

mobileFileItems.forEach((item) => {
  item.addEventListener("click", () => {
    const section = item.dataset.section;

    const tab = document.querySelector(`.tab[data-section="${section}"]`);

    if (tab) {
      tab.style.display = "flex";
    }

    navigateTo(section);

    mobileFileSheet?.classList.remove("open");
    document.getElementById("mobileSheetBackdrop")?.classList.remove("open");
  });
});

// =========================================
// INITIAL OPEN TABS
// =========================================

// Hide all tabs except README and Home
document.querySelectorAll(".tab").forEach((tab) => {
  const section = tab.dataset.section;

  if (section !== "home" && section !== "readme") {
    tab.style.display = "none";
  }
});

// Open Home by default
navigateTo("home");
updateEmptyEditorState();

// Send message to backend and get response
async function sendMessage(message) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();
  return data.reply;
}

const chatBtn = document.getElementById("chatWithKristineBtn");

if (chatBtn) {
  chatBtn.addEventListener("click", () => {
    copilotPanel.classList.remove("collapsed");
  });
}

// ======================================================
// THEME TOGGLE
// ======================================================
const themeToggle = document.getElementById("themeToggle");

const mobileThemeToggle = document.getElementById("mobileThemeToggle");

const savedTheme = localStorage.getItem("theme");

// The sun / moon icons are inline SVGs switched by the .light-mode class in CSS
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const isLight = document.body.classList.contains("light-mode");

  localStorage.setItem("theme", isLight ? "light" : "dark");
});

mobileThemeToggle?.addEventListener("click", () => {
  themeToggle?.click();
});

/* =========================================
   COPILOT AI CHAT
========================================= */
// ELEMENTS
const copilotMessages = document.getElementById("copilotMessages");
const copilotInput = document.getElementById("copilotInput");

// AUTO-RESIZE INPUT
function autoResizeCopilotInput() {
  copilotInput.style.height = "auto";
  copilotInput.style.height = copilotInput.scrollHeight + "px";
}
copilotInput.addEventListener("input", autoResizeCopilotInput);
const copilotSend = document.getElementById("copilotSend");

// SEND MESSAGE
async function sendCopilotMessage() {
  const message = copilotInput.value.trim();
  if (!message) return;

  // USER MESSAGE
  const userDiv = document.createElement("div");
  userDiv.className = "user-message";
  userDiv.textContent = message;
  copilotMessages.appendChild(userDiv);

  // CLEAR INPUT
  copilotInput.value = "";
  copilotInput.style.height = "42px";

  // AI LOADING
  const aiDiv = document.createElement("div");
  aiDiv.className = "ai-message";
  // Placeholder text while waiting for response
  aiDiv.textContent = "Thinking...";
  copilotMessages.appendChild(aiDiv);

  // FETCH AI RESPONSE
  try {
    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    // UPDATE AI RESPONSE
    aiDiv.innerHTML = marked.parse(data.reply || "No response.");
  } catch (error) {
    aiDiv.textContent = "Something went wrong.";

    console.error(error);
  }

  // AUTO SCROLL
  copilotMessages.scrollTop = copilotMessages.scrollHeight;
}

// SEND BUTTON
copilotSend.addEventListener("click", sendCopilotMessage);

// ENTER KEY
copilotInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    sendCopilotMessage();
  }
});

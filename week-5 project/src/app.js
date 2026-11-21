/* ==========================================================================
   Week 5 Task: Single Page Application (SPA) Simulation
   Controller: Client-side hash/state router, browser history sync, dynamic
               view rendering, shared application state, and fallback 404 view.
   ========================================================================== */

(() => {
  "use strict";

  const outlet = document.getElementById("spa-outlet");
  const routeBadge = document.getElementById("routeBadge");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const navToggleBtn = document.getElementById("navToggleBtn");
  const spaNav = document.getElementById("spaNav");

  // Shared SPA State
  const state = {
    projectTitle: "Customer Portal Redesign",
    activeStage: "Routing & State Sync",
    visits: 0,
    historyStack: [],
    modules: [
      { id: "router", name: "Hash & History Router", status: "Active", summary: "Resolves routes without full document reloads and syncs browser Back/Forward navigation." },
      { id: "state", name: "Reactive View Store", status: "Active", summary: "Maintains shared application state across view switches with instant DOM rendering." },
      { id: "transitions", name: "View Transition Engine", status: "Active", summary: "Applies smooth CSS entrance animations and focuses the active view container." },
      { id: "guards", name: "Route Fallback Handler", status: "Active", summary: "Catches unknown paths cleanly and provides one-click recovery back to Overview." },
      { id: "prefetch", name: "View Data Prefetcher", status: "Beta", summary: "Prepares view templates and metadata ahead of user navigation for snappy switches." },
      { id: "telemetry", name: "Navigation Trace Log", status: "Active", summary: "Records visited routes and state updates during the active browser session." }
    ]
  };

  function normalizePath(rawHash) {
    if (!rawHash || rawHash === "#" || rawHash === "#/") return "/";
    const cleaned = rawHash.replace(/^#/, "");
    return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderOverview() {
    return `
      <div class="container view-panel">
        <section class="view-hero">
          <span class="eyebrow">Week 5 SPA Simulation &bull; Route: #/</span>
          <h1>Seamless Navigation Without Full Page Reloads</h1>
          <p class="lead">
            <strong>NexusSPA</strong> simulates a client-side Single Page Application using a single HTML shell, dynamic JavaScript view templates, browser history integration, and smooth CSS transitions.
          </p>
          <div class="action-row">
            <a href="#/modules" class="btn btn-primary" data-route="/modules">Explore Modules</a>
            <a href="#/workspace" class="btn btn-outline" data-route="/workspace">Update Shared State</a>
          </div>
        </section>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Active Project</span>
            <div class="stat-value">${escapeHtml(state.projectTitle)}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Current Stage</span>
            <div class="stat-value">${escapeHtml(state.activeStage)}</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Route Transitions</span>
            <div class="stat-value">${state.visits}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderModules() {
    const cardsMarkup = state.modules
      .map((mod) => {
        const badgeClass = mod.status === "Active" ? "status-active" : "status-beta";
        return `
          <article class="module-card">
            <div>
              <span class="status-badge ${badgeClass}">${escapeHtml(mod.status)}</span>
              <h3>${escapeHtml(mod.name)}</h3>
              <p>${escapeHtml(mod.summary)}</p>
            </div>
            <div>
              <a href="#/workspace" class="btn btn-outline" data-route="/workspace">Inspect in Workspace &rarr;</a>
            </div>
          </article>
        `;
      })
      .join("");

    return `
      <div class="container view-panel">
        <section class="view-hero">
          <span class="eyebrow">Dynamic View &bull; Route: #/modules</span>
          <h1>Application Modules</h1>
          <p class="lead">
            Rendered dynamically from JavaScript state. Switching to this view updates the URL fragment and DOM without reloading <code>index.html</code> or <code>styles.css</code>.
          </p>
        </section>
        <div class="cards-grid">${cardsMarkup}</div>
      </div>
    `;
  }

  function renderWorkspace() {
    const logItems = state.historyStack
      .slice()
      .reverse()
      .slice(0, 6)
      .map(
        (entry) => `
          <li class="history-item">
            <span><strong>${escapeHtml(entry.route)}</strong> &mdash; ${escapeHtml(entry.note)}</span>
            <span>${escapeHtml(entry.time)}</span>
          </li>
        `
      )
      .join("");

    return `
      <div class="container view-panel">
        <section class="view-hero">
          <span class="eyebrow">State Management &bull; Route: #/workspace</span>
          <h1>Interactive State &amp; History Workspace</h1>
          <p class="lead">
            Modify shared SPA state below and navigate back to <code>#/</code> (Overview) to verify that state persists across dynamically rendered views.
          </p>
        </section>

        <div class="workspace-grid">
          <form id="spaStateForm" class="panel-card">
            <h2>Update Application State</h2>
            <div class="field-group">
              <label for="projectInput">Active Project Name</label>
              <input id="projectInput" name="projectTitle" type="text" value="${escapeHtml(state.projectTitle)}" required />
            </div>
            <div class="field-group">
              <label for="stageSelect">Workflow Stage</label>
              <select id="stageSelect" name="activeStage">
                <option value="Wireframe & Shell" ${state.activeStage === "Wireframe & Shell" ? "selected" : ""}>Wireframe &amp; Shell</option>
                <option value="Routing & State Sync" ${state.activeStage === "Routing & State Sync" ? "selected" : ""}>Routing &amp; State Sync</option>
                <option value="Transition & QA Polish" ${state.activeStage === "Transition & QA Polish" ? "selected" : ""}>Transition &amp; QA Polish</option>
                <option value="Release Ready" ${state.activeStage === "Release Ready" ? "selected" : ""}>Release Ready</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Save State</button>
          </form>

          <aside class="panel-card">
            <h2>Recent Navigation &amp; State Events</h2>
            <ul class="history-log">${logItems}</ul>
          </aside>
        </div>
      </div>
    `;
  }

  function renderArchitecture() {
    return `
      <div class="container view-panel">
        <section class="view-hero">
          <span class="eyebrow">SPA Architecture &bull; Route: #/architecture</span>
          <h1>How Client-Side Routing &amp; Transitions Work</h1>
          <p class="lead">
            <strong>1. Shell &amp; Outlet:</strong> <code>index.html</code> defines persistent chrome (header and footer) around <code>#spa-outlet</code>.<br />
            <strong>2. Route Table:</strong> <code>src/app.js</code> maps paths (<code>/</code>, <code>/modules</code>, <code>/workspace</code>, <code>/architecture</code>) to view renderers.<br />
            <strong>3. History &amp; Hash Sync:</strong> Intercepting route links and listening to <code>hashchange</code> / <code>popstate</code> keeps URLs shareable and Back/Forward buttons functional.
          </p>
          <div class="action-row">
            <a href="#/" class="btn btn-primary" data-route="/">Return to Overview</a>
          </div>
        </section>
      </div>
    `;
  }

  function renderNotFound(attemptedRoute) {
    return `
      <div class="container view-panel">
        <div class="error-panel">
          <span class="eyebrow">404 &bull; Unmatched Route</span>
          <h1>View Not Found (${escapeHtml(attemptedRoute)})</h1>
          <p class="lead">The requested client route does not exist in the SPA route table.</p>
          <a href="#/" class="btn btn-primary" data-route="/">Go to Overview (#/)</a>
        </div>
      </div>
    `;
  }

  const routes = {
    "/": renderOverview,
    "/modules": renderModules,
    "/workspace": renderWorkspace,
    "/architecture": renderArchitecture
  };

  function recordEvent(route, note) {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    state.historyStack.push({ route, note, time: now });
  }

  function updateNavState(activeRoute) {
    navLinks.forEach((link) => {
      const target = link.getAttribute("data-route");
      const isMatch = target === activeRoute;
      link.classList.toggle("is-active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (routeBadge) {
      routeBadge.textContent = `#${activeRoute}`;
    }
  }

  function bindViewEvents(activeRoute) {
    if (activeRoute !== "/workspace") return;
    const form = document.getElementById("spaStateForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const projectInput = document.getElementById("projectInput");
      const stageSelect = document.getElementById("stageSelect");
      if (projectInput && projectInput.value.trim()) {
        state.projectTitle = projectInput.value.trim();
      }
      if (stageSelect) {
        state.activeStage = stageSelect.value;
      }
      recordEvent("/workspace", `Updated state (${state.activeStage})`);
      navigate("/workspace", { countVisit: false });
    });
  }

  function navigate(rawRoute, options = { countVisit: true }) {
    const path = normalizePath(rawRoute.startsWith("#") || rawRoute.startsWith("/") ? rawRoute : `#/${rawRoute}`);
    if (options.countVisit) {
      state.visits += 1;
      recordEvent(path, "Navigated to view");
    }

    const renderer = routes[path];
    if (outlet) {
      outlet.innerHTML = renderer ? renderer() : renderNotFound(path);
    }

    updateNavState(path);
    bindViewEvents(path);

    if (spaNav && navToggleBtn) {
      spaNav.classList.remove("is-open");
      navToggleBtn.setAttribute("aria-expanded", "false");
    }
  }

  function navigateTo(path) {
    const normalized = normalizePath(path);
    const targetHash = `#${normalized}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      navigate(normalized);
    }
  }

  document.addEventListener("click", (event) => {
    const routeTrigger = event.target.closest("[data-route]");
    if (!routeTrigger) return;
    event.preventDefault();
    const targetRoute = routeTrigger.getAttribute("data-route") || "/";
    navigateTo(targetRoute);
  });

  if (navToggleBtn && spaNav) {
    navToggleBtn.addEventListener("click", () => {
      const open = navToggleBtn.getAttribute("aria-expanded") === "true";
      navToggleBtn.setAttribute("aria-expanded", String(!open));
      spaNav.classList.toggle("is-open", !open);
    });
  }

  window.addEventListener("hashchange", () => {
    navigate(normalizePath(window.location.hash));
  });

  window.addEventListener("popstate", () => {
    navigate(normalizePath(window.location.hash));
  });

  // Initial boot
  if (!window.location.hash) {
    window.history.replaceState({ route: "/" }, "", "#/");
  }
  navigate(normalizePath(window.location.hash));
})();

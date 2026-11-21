# Week 5 Technical Report: Single Page Application (SPA) Simulation

## 1. Project Plan & Objectives
The goal of this capstone simulation (**NexusSPA**) was to build a client-side Single Page Application that dynamically renders views inside a single HTML container (`index.html`) without triggering full page reloads. The architecture integrates:
* **HTML Shell (`index.html`):** Provides persistent top navigation, a live active-route indicator, a dynamic view outlet (`#spa-outlet`), and footer chrome.
* **Uniform Styling & Transitions (`src/styles.css`):** Defines custom design tokens, responsive layouts, and smooth view entrance animations (`@keyframes viewEnter`).
* **Client-Side Router & State Controller (`src/app.js`):** Manages route resolution, hash/history synchronization, shared application state, dynamic view rendering, and fallback `404` handling.

---

## 2. Routing, Browser History & Dynamic Content Management
1. **Route Table & Dynamic View Rendering:** `src/app.js` maps paths (`/`, `/modules`, `/workspace`, `/architecture`) to dedicated template functions (`renderOverview`, `renderModules`, `renderWorkspace`, `renderArchitecture`), injecting active markup into `#spa-outlet` on navigation.
2. **URL & History Synchronization:** Clicking `[data-route]` elements updates `window.location.hash` without reloading the document, while `hashchange` and `popstate` listeners keep browser Back/Forward navigation synchronized with the rendered view.
3. **Shared Session State:** State such as `projectTitle`, `activeStage`, `visits`, and `historyStack` lives in `app.js`, allowing updates in `#/workspace` to reflect immediately in `#/` (Overview) and across route transitions.

---

## 3. Challenges Encountered & Resolutions
1. **Preventing Full Page Reloads & Keeping Links Accessible:**
   * *Challenge:* Standard anchor links cause full reloads if not intercepted, while non-link elements lose standard browser link semantics.
   * *Resolution:* Used semantic `<a href="#/..." data-route="/...">` links and called `event.preventDefault()` on delegated clicks to route smoothly through `navigateTo()`.
2. **Handling Direct or Invalid Route Hashes:**
   * *Challenge:* Users or tests may load an arbitrary hash route (such as `#/unknown`) or open the app without a hash fragment.
   * *Resolution:* Added `normalizePath()` to normalize hashes, initialized `#/` via `history.replaceState` when absent, and rendered a dedicated `renderNotFound()` fallback view with a one-click return path to `#/`.
3. **Preserving State Across Re-Renders:**
   * *Challenge:* Re-rendering `#spa-outlet` replaces DOM nodes dynamically, which can wipe transient form or telemetry state if stored only in DOM elements.
   * *Resolution:* Kept canonical application state inside `state` in `src/app.js` and re-bound view-specific listeners (such as `#spaStateForm`) after each render.

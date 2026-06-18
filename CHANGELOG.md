# Changelog

All notable changes to Secure Cave are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] — 2024-12-01

### 🔴 Critical Bug Fixes

- **`useVault.js`** — All four vault API calls used `/api/vault` as the path but `apiFetch` already prepends `/api`. Every vault operation was hitting `/api/api/vault` → 404. Fixed all paths to `/vault`.
- **`App.jsx`** — No login/register UI existed. The app went directly to a master-key lock screen with no way to authenticate. Added `AuthScreen.jsx` with tab-based Sign In/Register, field validation, and loading states.
- **`AuthContext.jsx`** — `apiFetch` only read `data.error` from failed responses but express-validator returns `{errors:[{msg, path}]}`. Every validation failure showed "Request failed" instead of the real error. Fixed to handle both response shapes.
- **`middleware/auth.js`** — `console.log(req.headers)` was printing the full `Authorization: Bearer <token>` header on every authenticated request, leaking JWTs to server logs. Removed.
- **`App.jsx`** — Vault data was loaded inside `setTimeout(100)` after unlock — a fragile timing hack that caused race conditions. Replaced with a proper `await vault.loadVault()` + `await totp.loadEntries()` sequence.
- **`EntryModal.jsx`** — The `validate()` function required `username` to be non-empty, but the Mongoose schema marks it optional. Any save attempt without a username was silently blocked. Removed the erroneous required check.

### 🟡 Logic Bugs Fixed

- **`AuthContext.jsx`** — `apiFetch` was wrapped in `useCallback([token])`, causing it to be re-created on every token change. Vault hooks could hold a stale closure with `token: null`. Replaced with a stable `tokenRef` pattern — `apiFetch` is created once and always reads the current token from a mutable ref.
- **`PasswordCard.jsx`** — The "90+ days old" warning was computed from `createdAt`. Entries updated last week still triggered the warning. Fixed to use `updatedAt` with a `createdAt` fallback.
- **`VaultView.jsx`** — The Finance category was mapped to the `ShoppingCart` icon (incorrect). Fixed to `TrendingUp`.

### ✅ New Components & Features

- **`AuthScreen.jsx`** — Full login/register panel with animated cave branding, tab switching, show/hide password toggle, inline error display, and loading state.
- **`LockScreen.jsx`** — Redesigned as a dedicated master-key unlock screen. Shows the authenticated user's email with a green online dot and a sign-out link. Distinct from account authentication.
- **`TOTPView.jsx`** — Each TOTP entry now shows a circular SVG countdown ring. Color transitions green → orange → red in the final 10 seconds. Each entry has a per-code copy button with a ✓ flash animation.
- **`HealthView.jsx`** — Score display replaced with a circular SVG progress gauge with animated stroke. Added a warning banner when some entries haven't been revealed yet and therefore cannot be scanned.
- **`VaultView.jsx`** — Category filter tabs now show per-category item counts in a badge.
- **`Sidebar.jsx`** — Displays the logged-in user's email below the nav links and styles the "Lock & Sign Out" button in red for clarity.
- **`SettingsView.jsx`** — Export button now disables when the vault is empty. Added a visible plain-text warning to the export card. Fixed a duplicate `style`/`style2` prop that caused a React warning.

### 🎨 CSS / Style Improvements

- `.btn-ember:disabled` no longer applies the hover `transform: translateY(-1px)` or glow shadow
- `.spin` now sets `display: inline-flex` so loading spinners don't collapse to 0×0
- Added `backdrop-filter: blur(6px)` to `.modal-bg` for a frosted-glass effect
- Added `cardIn` keyframe animation for staggered vault card entry
- Custom scrollbar track/thumb/hover styles across all scrollable areas
- Basic responsive padding at `max-width: 640px` for modal and card components

---

## [1.0.0] — 2024-10-01

### Added

- Initial release
- AES-256-GCM client-side encryption with PBKDF2-SHA256 key derivation (120,000 iterations)
- JWT authentication with bcrypt password hashing (12 rounds)
- Vault CRUD — site, username (optional), password, category
- TOTP 2FA code generation (RFC 6238, 30-second window)
- Password health analysis — weak, reused, and aged-90-days detection
- HIBP breach detection via k-anonymity (5-char SHA-1 prefix)
- CSV import/export via PapaParse
- In-browser password generator — configurable length (8–32) and charset
- Helmet, CORS, rate limiting, morgan security/logging middleware
- Cave-themed dark UI — Cinzel + Syne + JetBrains Mono typefaces
- Category filter tabs — Social, Work, Finance, Other
- Vault search by site and username
- Password strength bar (analyseStrength, 5 levels)
- Favicon, skeleton loading cards, empty state, toast notifications

---

## [2.1.0] — 2024-12-15

### Added — Roadmap Items (Priority 1–4 + E2E)

#### 🔒 Auto-Lock (`hooks/useAutoLock.js`)
- New `useAutoLock(onLock, timeoutMs)` hook — idles vault lock after configurable period
- Locks immediately on `document.visibilitychange` (tab hidden / window minimised)
- Activity events reset the idle timer: `mousemove`, `keydown`, `click`, `touchstart`, `scroll`
- Timeout options in Settings: Disabled / 1 / 5 / 15 / 30 minutes
- Preference persisted to `localStorage` key `sc_autolock`
- Stable `lockRef` prevents effect re-fires on every render

#### 🌗 Dark / Light Theme (`context/ThemeContext.jsx`)
- `ThemeProvider` applies `data-theme` attribute to `<html>` element
- Full CSS variable override in `:root[data-theme="light"]` — all 14 colour tokens
- Preference persisted in `localStorage` key `sc_theme`
- Sun/Moon toggle button in sidebar footer
- All view components use `useTheme()` hook `C` colour object for inline styles
- 250ms CSS transition on `background` and `color` for smooth switch

#### 📱 Mobile Responsive Layout
- Sidebar converts to fixed overlay on `max-width: 768px`
- `transform: translateX(-100%)` when closed; `.open` class slides it in
- Frosted-glass backdrop (`sidebar-backdrop`) — click to dismiss
- Hamburger `<Menu>` button in top bar — hidden on desktop via CSS
- iOS Safari `min-height: -webkit-fill-available` fix applied to root
- Button padding reduced at `max-width: 540px`
- `min-width: 0` on main content flex child prevents overflow

#### 🎲 Passphrase Generator (`utils/passphrase.js`)
- 256-word curated EFF-subset wordlist (unambiguous, no homophones)
- `generatePassphrase(wordCount, separator)` — CSPRNG via `crypto.getRandomValues`
- Entropy display: shows bit count based on word count
- `EntryModal` Forge panel now has Password / Passphrase tabs
- Separator picker: `-` / space / `.` / `_`
- Word count slider: 3–8 words

#### 🧪 E2E Test Suite (Playwright)
- `playwright.config.ts` — Chromium + Pixel 5 mobile project
- 5 test files, 28 tests total:
  - `auth.spec.ts` — register, login, logout, persistence, error states
  - `vault.spec.ts` — add, reveal, copy, edit, delete, search, forge, validation
  - `health.spec.ts` — empty state, weak detection, reuse detection, fix button
  - `settings.spec.ts` — auto-lock, export disabled state, security section
  - `ui.spec.ts` — theme toggle persistence, mobile sidebar, backdrop
- Shared `helpers.ts` — `registerAndUnlock()` and `loginAndUnlock()` utilities
- `npm run test:e2e` / `npm run test:e2e:ui` scripts added to `package.json`

---

## [2.1.1] — 2024-12-20

### 🔴 Critical Fixes — "Route not found" on login

The root cause was never a single bug but an entire class of silent failure: any mismatch between the frontend's configured API base URL and the backend's actual address produced a generic, undebuggable `{"error":"Route not found"}`. Hardened against the whole class instead of patching one instance:

- **`server.js`** — added slash-normalizing middleware (`req.url.replace(/\/{2,}/g, "/")`) as the very first middleware in the stack. A trailing slash in `VITE_API_URL` (e.g. `https://host/api/`) previously produced double-slashed paths like `/api//auth/login` that silently 404'd. Now normalized before routing.
- **`server.js`** — the 404 handler now echoes back `method`, `path`, and a `hint` field instead of a bare `"Route not found"` string, and logs a `console.warn` server-side. A misconfigured request is now instantly diagnosable from the Network tab or server logs instead of requiring source-code archaeology.
- **`AuthContext.jsx`** — `apiFetch` now strips any trailing slash from the configured base URL before concatenating paths, eliminating the double-slash bug at its source rather than only band-aiding it server-side.
- **`AuthContext.jsx`** — distinguishes three previously-conflated failure modes that all used to surface as "Request failed": (1) the request never reached any server (`fetch` itself threw — now reported as "Could not reach the server at ..."), (2) the server responded with non-JSON (now reported with the actual HTTP status), (3) a genuine 404 from the hardened backend (now includes the method/path/hint detail).
- **`useServerStatus.js`** *(new hook)* — pings `/api/health` on mount with a 4-second timeout. The Auth screen now shows an upfront red banner — including the exact URL that was tried — if the backend is unreachable, instead of letting the user discover this only after submitting the login form.

### 🟡 UX Fix — "What is master password?"

The app previously used three different terms for the same value across two screens: "Password" (login), "Master Password" (register), and "Master Key" (post-login unlock screen). This was a genuine design flaw, not a misunderstanding — fixed by:

- **`AuthScreen.jsx`** — both Sign In and Register tabs now label the field simply "Password." A persistent info box beneath the form explains, in plain language, that this password does double duty (authentication + encryption) and that a second prompt will follow.
- **`LockScreen.jsx`** — renamed from referring to "Master Key" to "Password," matching the login screen. The heading changed from "Cave Locked" to "One More Step" to better signal this is a continuation of login, not a separate, unexplained gate. An inline explanation clarifies this step happens entirely in-browser and is the same password just entered.
- **`SettingsView.jsx`** — the Security Architecture list's PBKDF2 entry no longer refers to a "master key," for consistency with the rest of the UI.
- Internal variable names (`masterKey`, `deriveKey(masterPassword)`, etc.) were intentionally left unchanged — they are implementation detail, not user-facing copy, and renaming them carried no benefit while increasing diff noise.

### ✅ Documentation

- **`README.md`** — full rewrite. Added a dedicated **"How Login Actually Works"** section explaining the two-step model with a diagram, a **Troubleshooting** section addressing both bugs above by name (matching the exact symptoms reported), a `curl`-based backend health-check verification step in Setup, and a complete **Screenshots** section with 16 named placeholders.
- **`docs/screenshots/README.md`** *(new)* — a checklist describing exactly what to capture for each of the 16 screenshot placeholders referenced in the main README.

### 🧪 Test Updates

- `e2e/helpers.ts`, `e2e/auth.spec.ts`, `e2e/ui.spec.ts` — updated to match the renamed UI text (`"Register"` tab / `"Create Account"` submit button are now distinct accessible names to avoid Playwright strict-mode ambiguity; `"One More Step"` / `"Unlock Vault"` replace the old `"Cave Locked"` / `"Unlock Cave"` text).
- `auth.spec.ts` — added a new test asserting both explanation boxes (login and register) are visible, directly covering the fixed UX issue.

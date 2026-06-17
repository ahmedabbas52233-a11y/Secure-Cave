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

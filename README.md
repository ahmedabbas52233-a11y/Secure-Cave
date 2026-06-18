<div align="center">

# 🔥 Secure Cave

**A zero-knowledge, self-hosted password manager**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev)
[![License](https://img.shields.io/badge/License-MIT-f97316?style=flat-square)](LICENSE)

*Your passwords stay encrypted in your browser. The server never sees them.*

</div>

---

## Table of Contents

- [Screenshots](#-screenshots)
- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Project Structure](#-project-structure)
- [Setup](#%EF%B8%8F-setup)
- [How Login Actually Works](#-how-login-actually-works-read-this-first)
- [API Endpoints](#-api-endpoints)
- [Security Model](#-security-model)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#%EF%B8%8F-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📸 Screenshots

> Replace the placeholders below by adding images to `docs/screenshots/` — see [`docs/screenshots/README.md`](docs/screenshots/README.md) for exact filenames and what to capture in each one.

### Sign in & account creation

| Sign In | Create Account |
|---|---|
| ![Sign in screen](docs/screenshots/auth-login.png) | ![Register screen](docs/screenshots/auth-register.png) |

### Unlocking your vault

After signing in, you're asked for your password **one more time** — this second entry happens entirely in the browser and derives the key that decrypts your vault. See [How Login Actually Works](#-how-login-actually-works-read-this-first) below for why this exists.

![Unlock screen](docs/screenshots/unlock-screen.png)

### Vault

| Empty vault | Populated vault |
|---|---|
| ![Empty vault](docs/screenshots/vault-empty.png) | ![Vault with entries](docs/screenshots/vault-list.png) |

| Add entry — Password Forge | Add entry — Passphrase Forge |
|---|---|
| ![Password generator](docs/screenshots/vault-add-modal.png) | ![Passphrase generator](docs/screenshots/vault-passphrase-forge.png) |

![Revealed password](docs/screenshots/vault-reveal.png)

### Vault Health

![Health scanner](docs/screenshots/health-view.png)

### 2FA Codes

![TOTP codes](docs/screenshots/totp-view.png)

### Settings

![Settings view](docs/screenshots/settings-view.png)

### Themes

| Dark (default) | Light |
|---|---|
| ![Dark theme](docs/screenshots/theme-dark.png) | ![Light theme](docs/screenshots/theme-light.png) |

### Mobile

| Sidebar closed | Sidebar open |
|---|---|
| ![Mobile closed](docs/screenshots/mobile-sidebar-closed.png) | ![Mobile open](docs/screenshots/mobile-sidebar-open.png) |

---

## Overview

Secure Cave is a full-stack, zero-knowledge password manager. Passwords are encrypted in the browser using **AES-256-GCM** before any data is sent to the server. The backend only ever stores ciphertext and IVs — it has no mathematical ability to recover plaintext passwords, even if fully compromised.

Built with a prehistoric cave aesthetic — dark, moody, and fast.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 AES-256-GCM Encryption | Every password encrypted in-browser with a unique random IV |
| 🗝️ PBKDF2 Key Derivation | 120,000 iterations of SHA-256 before the key touches any data |
| 👤 Zero-Knowledge Backend | Server stores ciphertext only — mathematically cannot read passwords |
| 🔑 JWT Auth | Stateless authentication, 7-day expiry by default |
| 🛡️ Vault Health Scanner | Detects weak, reused, and aged passwords across your vault |
| ⏱️ TOTP 2FA Manager | Add TOTP secrets and generate live codes with a circular countdown |
| 🩹 Breach Detection | HIBP k-anonymity — only the first 5 hex chars of your SHA-1 hash leave the browser |
| 🔒 Auto-Lock | Locks after a configurable idle period, or instantly when the tab is hidden |
| 🌗 Dark / Light Theme | Toggle persisted across sessions |
| 📱 Mobile Responsive | Collapsible sidebar with backdrop overlay below 768px |
| 🎲 Password & Passphrase Forge | Configurable random password generator, plus an EFF-wordlist passphrase generator with entropy display |
| 📦 CSV Import/Export | Migrate to/from any other password manager |
| 🔎 Search + Filter | Real-time vault search and category filtering |
| 🧪 E2E Tested | 29 Playwright tests across auth, vault, health, settings, and UI |

---

## 🛠️ Tech Stack

### Backend

| Package | Version | Purpose |
|---|---|---|
| Express | ^4.18.2 | HTTP server |
| Mongoose | ^8.0.3 | MongoDB ODM |
| jsonwebtoken | ^9.0.2 | JWT signing/verification |
| bcryptjs | ^2.4.3 | Login password hashing (12 rounds) |
| helmet | ^7.1.0 | Security headers |
| cors | ^2.8.5 | Cross-origin policy |
| express-validator | ^7.0.1 | Input validation |
| express-rate-limit | ^7.1.5 | Rate limiting |
| morgan | ^1.10.0 | HTTP request logging |
| dotenv | ^16.3.1 | Environment variable loading |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| React | ^18.2.0 | UI framework |
| Vite | 5.x | Build tool + dev server |
| lucide-react | ^0.383.0 | Icon library |
| papaparse | ^5.4.1 | CSV parsing |
| @playwright/test | ^1.44.0 | End-to-end testing |
| Web Crypto API | native | AES-256-GCM, PBKDF2 |

---

## 📁 Project Structure

```
secure-cave/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js              JWT verification middleware
│   ├── models/
│   │   ├── User.js              Email + bcrypt password hash
│   │   ├── VaultEntry.js        ciphertext + iv + metadata
│   │   └── TOTPEntry.js         Encrypted TOTP secrets
│   ├── routes/
│   │   ├── auth.js              /api/auth — register, login, /me
│   │   ├── vault.js             /api/vault — CRUD vault entries
│   │   └── totp.js              /api/totp — CRUD TOTP entries
│   ├── .env.example
│   ├── package.json
│   └── server.js                Slash-normalizing middleware, debuggable 404s
│
├── docs/
│   └── screenshots/             Screenshot assets referenced by this README
│
└── frontend/
    ├── e2e/                     Playwright test suite (29 tests)
    │   ├── helpers.ts
    │   ├── auth.spec.ts
    │   ├── vault.spec.ts
    │   ├── health.spec.ts
    │   ├── settings.spec.ts
    │   └── ui.spec.ts
    ├── src/
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── modals/
    │   │   │   ├── EntryModal.jsx   Add/edit, Password + Passphrase forge
    │   │   │   └── DeleteModal.jsx
    │   │   ├── AuthScreen.jsx       Sign in / Register + connectivity banner
    │   │   ├── LockScreen.jsx       Vault unlock step (re-enter password)
    │   │   ├── Sidebar.jsx          Navigation + theme toggle
    │   │   ├── VaultView.jsx
    │   │   ├── PasswordCard.jsx
    │   │   ├── HealthView.jsx
    │   │   ├── TOTPView.jsx
    │   │   └── SettingsView.jsx     Auto-lock controls, import/export
    │   ├── context/
    │   │   ├── AuthContext.jsx      JWT state, hardened apiFetch
    │   │   └── ThemeContext.jsx     Dark/light theme state
    │   ├── hooks/
    │   │   ├── useVault.js
    │   │   ├── useTOTP.js
    │   │   ├── useAutoLock.js       Idle + visibility-based locking
    │   │   └── useServerStatus.js   Backend reachability check
    │   ├── utils/
    │   │   ├── crypto.js            AES-256-GCM + PBKDF2
    │   │   ├── totp.js              RFC 6238 TOTP engine
    │   │   ├── breach.js            HIBP k-anonymity check
    │   │   ├── strength.js          Password strength analyser
    │   │   ├── generator.js         Random password generator
    │   │   └── passphrase.js        EFF-wordlist passphrase generator
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── playwright.config.ts
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Setup

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local (`mongodb://localhost:27017`) or MongoDB Atlas

---

### 1. Clone

```bash
git clone https://github.com/your-username/secure-cave.git
cd secure-cave
```

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securecave
JWT_SECRET=replace-with-a-long-random-string-minimum-32-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

> **Generate a secure JWT_SECRET:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
> ```

Start the backend:

```bash
npm run dev      # hot-reload via nodemon
# or
npm start        # production
```

You should see:

```
✅ MongoDB connected
🔥 Secure Cave server running on port 5000
   Health check: http://localhost:5000/api/health
   CORS origin:  http://localhost:5173
```

**Verify it's actually working** before touching the frontend:

```bash
curl http://localhost:5000/api/health
# → {"status":"alive","cave":"secure"}
```

If that doesn't return JSON, nothing past this point will work — fix the backend first. See [Troubleshooting](#-troubleshooting).

---

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

`frontend/.env`:

```env
VITE_API_URL=/api
```

Start the dev server:

```bash
npm run dev
```

Open **http://localhost:5173**

> The Vite dev server proxies `/api/*` → `http://localhost:5000` (configured in `vite.config.js`), so there's no CORS issue in development and `VITE_API_URL=/api` is correct as-is. You only need to change this for production deployments where frontend and backend live on different domains — see below.

---

### 4. Production Build

```bash
# Build the frontend
cd frontend && npm run build    # outputs to frontend/dist/

# Serve dist/ with any static host (Nginx, Vercel, etc.)
# Backend can be deployed to Railway, Render, Fly.io, etc.
```

If your frontend and backend are on **different domains** in production, set `VITE_API_URL` to the **full** backend URL *with no trailing slash* before building:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
```

> ⚠️ **Trailing slash warning:** `VITE_API_URL=https://host/api/` (note the trailing `/`) will produce double-slashed request URLs like `https://host/api//auth/login`. The backend now normalizes this automatically (see `server.js`), but it's still worth getting right — copy the URL without a trailing slash.

Also update `backend/.env`'s `FRONTEND_URL` to your deployed frontend's origin, so CORS allows it.

---

## 🔑 How Login Actually Works (read this first)

Secure Cave asks for your password **twice** in a row when you sign in. This is intentional, not a bug — but it's confusing if you don't know why, so here's the full picture:

```
Step 1 — Sign In (AuthScreen)
   You enter: email + password
   → Sent to the server
   → Server checks the bcrypt hash, returns a JWT
   → This proves WHO you are

Step 2 — Unlock Vault (LockScreen, shown immediately after Step 1)
   You enter: the SAME password again
   → Used ONLY in your browser — never sent anywhere
   → Run through PBKDF2 (120,000 iterations) to derive an AES-256 key
   → This key decrypts your vault entries locally
   → This proves you can DECRYPT your data
```

**Why two separate steps for the same password?** Because the server authenticates you, but it must never see anything capable of decrypting your vault — that's the zero-knowledge guarantee. The password is reused for both, but it's processed completely differently in each step: bcrypt-compared by the server in Step 1, PBKDF2-derived locally in Step 2.

**Practical consequences:**
- If you reload the page or your JWT is still valid, you'll skip Step 1 but always be asked for Step 2 again — your vault re-locks on every fresh page load by design.
- There is currently no server-side way to verify Step 2's password is correct before attempting decryption (this is intentional — see [SECURITY.md](SECURITY.md) for why). If you mistype it, you won't get an error; you'll just see garbled/empty passwords. Lock and try again.
- Auto-Lock (configurable in Settings) re-triggers Step 2 after an idle period or when you switch tabs — Step 1's session stays valid, only the vault re-locks.

---

## 🌐 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | `{ email, password }` | Create account |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | Sign in, returns JWT |
| `GET` | `/api/auth/me` | ✅ | — | Validate token, return user |

### Vault — `/api/vault`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/vault` | ✅ | Get all vault entries |
| `POST` | `/api/vault` | ✅ | Create new entry |
| `PUT` | `/api/vault/:id` | ✅ | Update entry |
| `DELETE` | `/api/vault/:id` | ✅ | Delete entry |

**Entry shape:**
```json
{
  "site":       "github.com",
  "username":   "caveman@tribe.net",
  "ciphertext": "<base64 AES-GCM ciphertext>",
  "iv":         "<base64 12-byte IV>",
  "category":   "Work"
}
```

### TOTP — `/api/totp`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/totp` | ✅ | Get all TOTP entries |
| `POST` | `/api/totp` | ✅ | Add TOTP entry |
| `DELETE` | `/api/totp/:id` | ✅ | Remove TOTP entry |

### Diagnostics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Liveness check — also used by the frontend's connectivity banner |

**404 responses** now include debugging detail (added specifically to fix opaque "Route not found" reports):
```json
{
  "error": "Route not found",
  "method": "POST",
  "path": "/api/api/auth/login",
  "hint": "Check that VITE_API_URL in frontend/.env matches where this backend is actually running, and that it has no trailing slash."
}
```

---

## 🔒 Security Model

```
User registers / logs in
        │
        ▼
  [ Backend receives email + password ]
        │
        ├─► bcrypt(password, 12 rounds) → stored as passwordHash
        └─► JWT signed with JWT_SECRET → returned to client

User unlocks vault (client-side only — Step 2 above)
        │
        ▼
  [ Browser: PBKDF2(password, salt, 120000, SHA-256) ]
        │
        └─► CryptoKey (AES-256-GCM) — NEVER leaves the browser

Adding a password
        │
        ▼
  [ Browser: AES-GCM.encrypt(plaintext, CryptoKey, randomIV) ]
        │
        └─► { ciphertext, iv } sent to server → stored in MongoDB

Retrieving a password
        │
        ▼
  [ Server sends ciphertext + iv ]
        │
        └─► [ Browser: AES-GCM.decrypt(ciphertext, CryptoKey, iv) ] → plaintext
```

| Layer | Mechanism | Standard |
|---|---|---|
| Passwords at rest | AES-256-GCM | NIST SP 800-38D |
| Key derivation | PBKDF2-SHA256, 120k iterations | NIST SP 800-132 |
| Login credential | bcrypt, 12 rounds | — |
| Session token | JWT HS256, 7-day expiry | RFC 7519 |
| Breach detection | HIBP k-anonymity (5-char prefix) | — |
| Transport | HTTPS (enforced in production) | TLS 1.2+ |
| Security headers | Helmet.js (CSP, HSTS, X-Frame) | OWASP |

See [SECURITY.md](SECURITY.md) for known design trade-offs and the responsible disclosure process.

---

## 🌿 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | HTTP server port |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `FRONTEND_URL` | No | `http://localhost:5173` | CORS allowed origin |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `/api` | API base URL. Use the full backend URL (**no trailing slash**) if frontend and backend are on different domains |

---

## 🧪 Testing

29 Playwright E2E tests across 5 suites, run against a real backend + MongoDB instance.

```bash
cd frontend

# Headless run (used in CI)
npm run test:e2e

# Interactive UI mode — step through tests, inspect DOM, time-travel debug
npm run test:e2e:ui

# View the HTML report from the last run
npm run test:report
```

| Suite | Covers |
|---|---|
| `auth.spec.ts` | Register, login, logout, session persistence, validation errors, explanation boxes |
| `vault.spec.ts` | Add/edit/delete/reveal/copy, search, password & passphrase forge, validation |
| `health.spec.ts` | Empty state, weak/reused detection, fix-button navigation |
| `settings.spec.ts` | Auto-lock persistence, export disabled state, security section content |
| `ui.spec.ts` | Theme toggle + persistence, mobile sidebar open/close/backdrop |

Tests run against both a desktop Chromium project and a Pixel 5 mobile-emulation project (see `playwright.config.ts`).

---

## 🩹 Troubleshooting

### "Route not found" when logging in

This means a request reached the backend but didn't match any registered route — almost always a URL mismatch, not a code bug. Steps to fix, in order:

1. **Is the backend actually running?** Run `curl http://localhost:5000/api/health` (or your deployed backend URL + `/api/health`). If this doesn't return `{"status":"alive",...}`, start/fix the backend first — nothing else matters until this works.
2. **Check `frontend/.env`'s `VITE_API_URL`.** For local dev it should be exactly `/api`. For production with a separate backend domain, it must be the full URL **with no trailing slash** (e.g. `https://api.example.com/api`, not `https://api.example.com/api/`).
3. **Read the error message itself.** As of this version, both the backend's 404 response and the frontend's error handling surface the *exact* method and path that failed to match, e.g. `Route not found: POST /api/api/auth/login`. A doubled `/api/api/` prefix means `VITE_API_URL` already ends in `/api` AND the frontend code is also adding `/api` — check `AuthContext.jsx`'s `apiFetch` calls aren't passing paths that already start with `/api`.
4. **Restart the Vite dev server after changing `.env`.** Vite only reads `.env` files at startup — edits while it's running won't take effect until you restart `npm run dev`.

If the backend is unreachable entirely (not a 404, but no response at all), the Auth screen now shows a red banner on load telling you exactly which URL it tried and failed to reach — no need to dig through DevTools.

### "What is the master password?" / asked for my password twice

This isn't a separate password — it's the same one, asked for in two different contexts. See [How Login Actually Works](#-how-login-actually-works-read-this-first) above for the full explanation. As of this version, the app no longer uses the term "master password" or "master key" anywhere in the UI — both screens consistently say "Password," and each screen includes an inline explanation of what that step does and why.

### Can't register — "Email already registered"

Each email can only have one account. If you're testing repeatedly, use a fresh email each time, or drop the `users` collection in MongoDB:

```bash
mongosh securecave --eval "db.users.deleteMany({})"
```

### Passwords show as garbled text after unlocking

You entered the wrong password on the unlock screen (Step 2). There's no validation against a stored hash for this step by design (see [SECURITY.md](SECURITY.md)) — lock the vault again (Settings → or reload the page) and re-enter your password carefully.

### MongoDB connection fails on startup

```
❌ MongoDB connection failed: ...
```

- **Local MongoDB:** make sure `mongod` is actually running (`mongosh` should connect without error).
- **MongoDB Atlas:** check your IP is allow-listed in Atlas's Network Access settings, and that the connection string includes the correct username/password (URL-encode any special characters in the password).

### CORS errors in the browser console

`FRONTEND_URL` in `backend/.env` must exactly match the origin your frontend is actually served from (protocol + domain + port, no trailing slash). `http://localhost:5173` ≠ `http://127.0.0.1:5173` as far as CORS is concerned.

---

## 🗺️ Roadmap

- [ ] Browser extension (Chrome/Firefox)
- [ ] Folder/group organisation for vault entries
- [ ] Argon2id key derivation (stronger than PBKDF2)
- [ ] Emergency access / account recovery
- [ ] Optional server-side verifier so a wrong unlock password shows a clear error instead of silent garbled output

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions, and coding standards.

```bash
git checkout -b fix/your-fix-name
# make changes
npm run test:e2e   # from frontend/ — must pass before opening a PR
```

---

## 🛡️ Security Vulnerabilities

Please **do not** open a public GitHub issue for security bugs. See [SECURITY.md](SECURITY.md) for the responsible disclosure process.

---

## 📄 License

[MIT](LICENSE) © 2024 Ahmad Abbas Hussain

---

<div align="center">
Built with 🔥 and way too much dark theme
</div>

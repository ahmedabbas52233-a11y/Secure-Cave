<div align="center">

# 🔥 Secure Cave

**A zero-knowledge, self-hosted password manager**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-f97316?style=flat-square)](LICENSE)

*Your passwords stay encrypted in your browser. The server never sees them.*

---

[Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-setup) · [API](#-api-endpoints) · [Security](#-security-model) · [Contributing](#-contributing)

</div>

---

## Overview

Secure Cave is a full-stack, zero-knowledge password manager. Passwords are encrypted in the browser using **AES-256-GCM** before any data is sent to the server. The backend only ever stores ciphertext and IVs — it has no mathematical ability to recover plaintext passwords, even if fully compromised.

Built with a prehistoric cave aesthetic — dark, moody, and fast.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **AES-256-GCM Encryption** | Every password encrypted in-browser with a unique random IV |
| 🗝️ **PBKDF2 Key Derivation** | 120,000 iterations of SHA-256 before the key touches any data |
| 👤 **Zero-Knowledge Backend** | Server stores ciphertext only — mathematically cannot read passwords |
| 🔑 **JWT Auth** | Stateless authentication with configurable expiry (default 7 days) |
| 🛡️ **Vault Health Scanner** | Detects weak, reused, and aged passwords across your vault |
| ⏱️ **TOTP 2FA Manager** | Add TOTP secrets and generate live codes with circular countdown |
| 🩹 **Breach Detection** | HIBP k-anonymity — only the first 5 hex chars of your SHA-1 hash leave the browser |
| 🔒 **Rate Limiting** | Auth endpoints: 20 req/15min. API: 100 req/min |
| 📦 **CSV Import/Export** | Migrate to/from any other password manager |
| 🔎 **Search + Filter** | Real-time vault search and category filtering |
| ⚡ **Password Forge** | Configurable in-browser generator (length, charset, symbols) |

---

## 🛠️ Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| Express | 4.18 | HTTP server |
| Mongoose | 8.0 | MongoDB ODM |
| jsonwebtoken | 9.0 | JWT signing/verification |
| bcryptjs | 2.4 | Password hashing (12 rounds) |
| helmet | 7.1 | Security headers |
| cors | 2.8 | Cross-Origin policy |
| express-validator | 7.0 | Input validation |
| express-rate-limit | 7.1 | Rate limiting |
| morgan | 1.10 | HTTP request logging |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 5.0 | Build tool + dev server |
| lucide-react | 0.383 | Icon library |
| papaparse | 5.4 | CSV parsing |
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
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── EmptyState.jsx
    │   │   │   ├── Favicon.jsx
    │   │   │   ├── SkeletonCard.jsx
    │   │   │   ├── StrengthBar.jsx
    │   │   │   └── Toast.jsx
    │   │   ├── modals/
    │   │   │   ├── EntryModal.jsx   Add/edit password entry
    │   │   │   └── DeleteModal.jsx  Confirm deletion
    │   │   ├── AuthScreen.jsx       Login + register
    │   │   ├── LockScreen.jsx       Master key unlock
    │   │   ├── Sidebar.jsx          Navigation
    │   │   ├── VaultView.jsx        Password list
    │   │   ├── PasswordCard.jsx     Single entry card
    │   │   ├── HealthView.jsx       Security analysis
    │   │   ├── TOTPView.jsx         2FA code generator
    │   │   └── SettingsView.jsx     Import/export/security
    │   ├── context/
    │   │   └── AuthContext.jsx      JWT state + apiFetch
    │   ├── hooks/
    │   │   ├── useVault.js          Vault CRUD + decryption
    │   │   └── useTOTP.js           TOTP generation loop
    │   ├── utils/
    │   │   ├── crypto.js            AES-256-GCM + PBKDF2
    │   │   ├── totp.js              RFC 6238 TOTP engine
    │   │   ├── breach.js            HIBP k-anonymity check
    │   │   ├── strength.js          Password strength analyser
    │   │   └── generator.js         Random password generator
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
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

The API will be running at `http://localhost:5000`.

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

> The Vite dev server proxies `/api/*` → `http://localhost:5000`, so no CORS issues in development.

---

### 4. Production Build

```bash
# Build the frontend
cd frontend && npm run build    # outputs to frontend/dist/

# Serve dist/ with any static host (Nginx, Vercel, etc.)
# Backend can be deployed to Railway, Render, Fly.io, etc.
```

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

**Entry schema:**
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

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Liveness check |

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

User unlocks vault (client-side only)
        │
        ▼
  [ Browser: PBKDF2(masterPassword, email_salt, 120000, SHA-256) ]
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
| `VITE_API_URL` | No | `/api` | API base URL (use full URL in production if on different domain) |

---

## 🗺️ Roadmap

- [ ] Browser extension (Chrome/Firefox)
- [ ] Mobile-responsive layout improvements
- [ ] Passphrase generator (EFF word lists)
- [ ] Folder/group organisation for vault entries
- [ ] Argon2id key derivation (stronger than PBKDF2)
- [ ] Emergency access / account recovery
- [ ] Auto-lock on tab focus loss
- [ ] Dark/light theme toggle
- [ ] E2E test suite (Playwright)

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on issues, branches, and pull requests.

```bash
# Fork → clone → create a branch
git checkout -b fix/your-fix-name

# Make changes, then open a Pull Request against main
```

---

## 🛡️ Security Vulnerabilities

Please **do not** open a public GitHub issue for security bugs.  
See [SECURITY.md](SECURITY.md) for the responsible disclosure process.

---

## 📄 License

[MIT](LICENSE) © 2024 Ahmad Abbas Hussain

---

<div align="center">
Built with 🔥 and way too much dark theme
</div>

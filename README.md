# 🔥 Secure Cave — Password Manager

A zero-knowledge, self-hosted password manager with AES-256-GCM client-side encryption, TOTP 2FA support, and a cave-themed UI.

---

## Architecture

```
secure-cave/
├── backend/          Express + MongoDB API
│   ├── middleware/   JWT auth middleware
│   ├── models/       Mongoose schemas (User, VaultEntry, TOTPEntry)
│   ├── routes/       auth, vault, totp
│   └── server.js
└── frontend/         React + Vite SPA
    └── src/
        ├── components/   UI components
        ├── context/      AuthContext (JWT + apiFetch)
        ├── hooks/        useVault, useTOTP
        └── utils/        crypto, totp, breach, strength, generator
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017 (or a remote URI)

---

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create or edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securecave
JWT_SECRET=replace-with-a-random-32+-char-string
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev      # with nodemon (hot-reload)
# or
npm start        # production
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Security Model

| Layer | Mechanism |
|-------|-----------|
| Login auth | bcrypt-hashed password (12 rounds) |
| Session | JWT (7-day expiry, HS256) |
| Vault encryption | AES-256-GCM, unique IV per entry |
| Key derivation | PBKDF2-SHA256, 120,000 iterations |
| Server storage | Ciphertext + IV only (zero-knowledge) |
| Breach checking | HIBP k-anonymity (5-char SHA-1 prefix) |
| Rate limiting | 20 auth requests / 15 min |

> **Important:** Your master password is never sent to the server. It is used only in your browser to derive the AES key. If you forget it, your vault entries cannot be recovered.

---

## Bug Fixes Applied (v1 → v2)

1. **Critical** `useVault.js` — API paths were `/api/vault` causing a double-prefix (`/api/api/vault`) → 404 on every vault operation. Fixed to `/vault`.
2. **Critical** `App.jsx` — No login/register UI existed. Users could never authenticate. Added `AuthScreen` component.
3. **Critical** `AuthContext.jsx` — `apiFetch` did not handle express-validator's `{errors:[]}` response shape, always showing "Request failed" instead of the real validation message.
4. **Security** `middleware/auth.js` — `console.log(req.headers)` leaked Authorization (JWT) tokens to server logs. Removed.
5. **Logic** `App.jsx` — `setTimeout(100)` hack for vault load timing replaced with correct async/await flow.
6. **Logic** `EntryModal.jsx` — `username` field was marked required in frontend validation but is optional in the DB schema. Removed the erroneous check.
7. **Logic** `AuthContext.jsx` — `apiFetch` was wrapped in `useCallback([token])` causing re-creation on every token change and potential stale-closure issues. Replaced with a stable `tokenRef` pattern.
8. **UI** `PasswordCard.jsx` — Age calculation used `createdAt` instead of `updatedAt` (always showed creation age, even after edits).
9. **UI** `VaultView.jsx` — Finance category used `ShoppingCart` icon (incorrect). Replaced with `TrendingUp`.

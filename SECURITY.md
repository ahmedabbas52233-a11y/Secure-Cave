# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | ✅ Active |
| 1.x     | ❌ End of life |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue in Secure Cave, please report it privately so it can be patched before any public disclosure.

### How to Report

Email: **ahmad.abbas@securecave.dev** *(replace with your real email)*

Include in your report:
- A clear description of the vulnerability
- Steps to reproduce it
- The potential impact (data exposure, auth bypass, etc.)
- Any suggested mitigations (optional)

### What to Expect

| Timeline | Action |
|----------|--------|
| **Within 48 hours** | Acknowledgement of your report |
| **Within 7 days** | Severity assessment and triage |
| **Within 30 days** | Patch released (for confirmed vulnerabilities) |
| **After patch release** | Public disclosure coordinated with reporter |

We will credit you in the CHANGELOG and release notes unless you prefer to remain anonymous.

---

## Known Security Design Decisions

### Master Key Not Verified at Unlock

When a user enters their master password on the lock screen, it is accepted as long as a JWT is valid. There is no server-side verification that the master password is correct, by design — verifying it would require the server to know something about it, breaking zero-knowledge guarantees.

**Consequence:** If a user enters the wrong master password, decryption will silently fail and return empty/garbage passwords. There is no error message indicating the master key was wrong.

**Mitigation considered:** Storing an HMAC verifier derived from the master key. This would confirm key correctness without revealing the key. Not yet implemented.

### TOTP Secrets Stored Encrypted on Server

TOTP secrets are encrypted the same way as vault passwords (AES-256-GCM with the master key). They are inaccessible to the server.

### JWT Stored in localStorage

JWTs are stored in `localStorage`. This exposes them to XSS attacks. The application uses `helmet` to set a strict Content Security Policy which mitigates most XSS vectors, but this is a known trade-off versus `httpOnly` cookies.

**Mitigation in progress:** Moving to `httpOnly` `SameSite=Strict` cookies in a future release.

### Rate Limiting

Auth endpoints are rate-limited to **20 requests per 15 minutes** per IP. General API endpoints are limited to **100 requests per minute**. These limits are enforced by `express-rate-limit` and can be adjusted in `server.js`.

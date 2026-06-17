# Contributing to Secure Cave

Thank you for taking the time to contribute! Below is everything you need to know.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

Be kind and respectful. Harassment, discrimination, or hostile behaviour of any kind will not be tolerated.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/secure-cave.git
   cd secure-cave
   ```
3. **Set up** both services (see [README → Setup](README.md#️-setup))
4. **Create a branch** for your change (see below)
5. Make your changes, test thoroughly
6. Open a **Pull Request** against `main`

---

## Branch Naming

Use the following prefixes:

| Prefix | When to use |
|--------|-------------|
| `fix/` | Bug fixes |
| `feat/` | New features |
| `docs/` | Documentation only |
| `refactor/` | Code changes with no behavior change |
| `test/` | Adding or improving tests |
| `chore/` | Build scripts, deps, tooling |

**Examples:**
```
fix/vault-api-double-prefix
feat/argon2-key-derivation
docs/update-api-table
```

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `fix`, `feat`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

**Examples:**
```
fix(vault): correct API path double-prefix in useVault.js

apiFetch already prepends /api, so paths should be /vault not /api/vault.
Affected: loadVault, addEntry, updateEntry, deleteEntry.

Closes #14
```

```
feat(totp): add circular SVG countdown ring to TOTP cards
```

```
docs(readme): add production deployment section
```

---

## Pull Request Process

1. Ensure your branch is up to date with `main` before opening a PR
2. Fill in the PR template completely
3. Link any related issues with `Closes #<number>`
4. Wait for CI checks to pass before requesting review
5. At least one approval is required to merge
6. Squash commits on merge (the maintainer will do this)

---

## Coding Standards

### General
- Keep components small and single-purpose
- Prefer named exports over default exports for utilities
- No `console.log` in committed code (use `console.error` for errors only)
- No secrets or API keys committed to source — always use `.env`

### Frontend (React)
- Use functional components and hooks only (no class components)
- Keep state as close as possible to where it is used
- Prefer `useCallback` for functions passed as props to avoid unnecessary re-renders
- All inline styles are acceptable (the project uses an inline style pattern for clarity)
- Use `lucide-react` for all icons — do not add other icon libraries

### Backend (Express)
- All routes must go through `authMiddleware` unless explicitly public
- Always validate user input with `express-validator` before processing
- Use `try/catch` or `.catch()` on all async route handlers
- Never log request headers or authorization tokens

### Security (critical)
- The `ciphertext` and `iv` stored in the DB must **never** be decrypted server-side
- Any change to the crypto flow (`utils/crypto.js`) requires sign-off from a maintainer
- Do not add any new npm packages that perform encryption or key derivation without discussion first

---

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml) issue template.

Before opening a new issue:
- Search existing issues to avoid duplicates
- Check if the bug exists on the latest version (`main` branch)
- For security vulnerabilities, see [SECURITY.md](SECURITY.md) — **do not open a public issue**

---

## Requesting Features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml) issue template.

Include:
- **Problem:** What are you trying to do that you can't currently do?
- **Proposed solution:** How would you like it to work?
- **Alternatives considered:** Other approaches you thought about
- **Security implications:** Does this change anything about the threat model?

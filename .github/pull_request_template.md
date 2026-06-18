# Pull Request

## Summary

<!-- One or two sentences describing what this PR does and why. -->

## Type of Change

- [ ] 🔴 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality not to work as expected)
- [ ] 📝 Documentation only
- [ ] 🔧 Refactor / code cleanup (no behavior change)
- [ ] 🔒 Security fix

## Related Issues

Closes # <!-- issue number -->

## Changes Made

<!-- Bullet points describing each meaningful change -->

-
-
-

## Testing Done

<!-- How did you test this? What did you verify? -->

- [ ] Tested locally with a fresh vault (register → add entries → verify)
- [ ] Tested import/export CSV round-trip
- [ ] Tested TOTP code generation
- [ ] Tested health scanner
- [ ] Checked browser console for errors
- [ ] Checked backend server logs for unexpected output
- [ ] Ran `npm run test:e2e` — all tests pass

## Screenshots / Recordings

<!-- For UI changes, include before/after screenshots. Delete this section if not applicable. -->

## Security Checklist

<!-- Only fill in if your change touches auth, encryption, or the API. -->

- [ ] No secrets or API keys added to source code
- [ ] No `console.log` statements log sensitive data (tokens, passwords)
- [ ] Input validation in place for any new API endpoints
- [ ] Auth middleware applied to any new protected routes
- [ ] Server does not decrypt any stored ciphertext

## Checklist

- [ ] My code follows the project coding standards (see CONTRIBUTING.md)
- [ ] I have updated documentation where needed (README, CHANGELOG, comments)
- [ ] My changes do not introduce new ESLint warnings
- [ ] CI checks pass on this branch

// ── AES-256-GCM Client-Side Encryption ─────────────────────────────────────
// The server never sees plaintext passwords. All encryption/decryption
// happens here in the browser using the Web Crypto API.

const PBKDF2_SALT = "SecureCave_PBKDF2_v1_salt";
const PBKDF2_ITER = 120_000;

/**
 * Derives a CryptoKey from the user's master password.
 * Uses PBKDF2-SHA256 with 120k iterations → AES-256-GCM key.
 */
export async function deriveKey(masterPassword) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(masterPassword), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode(PBKDF2_SALT), iterations: PBKDF2_ITER, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts plaintext with AES-256-GCM.
 * Returns { ciphertext, iv } as base64 strings.
 */
export async function encryptText(plaintext, key) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, key, enc.encode(plaintext)
  );
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

/**
 * Decrypts AES-256-GCM ciphertext.
 * Returns plaintext string, or empty string on failure.
 */
export async function decryptText(ciphertext, ivBase64, key) {
  try {
    const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const iv   = Uint8Array.from(atob(ivBase64),  c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return new TextDecoder().decode(decrypted);
  } catch {
    return "";
  }
}

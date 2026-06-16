/**
 * RFC 6238 TOTP implementation using Web Crypto HMAC-SHA1.
 * Works entirely in the browser.
 */

function base32ToBytes(secret) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = secret.replace(/\s+/g, "").toUpperCase();
  let bits = "";
  for (const ch of clean) {
    const i = alphabet.indexOf(ch);
    if (i >= 0) bits += i.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

/**
 * Generates a 6-digit TOTP code from a Base32 secret.
 * @param {string} secret - Base32 TOTP secret
 * @param {number} period - time step in seconds (default 30)
 * @returns {Promise<string>} 6-digit code
 */
export async function getTOTP(secret, period = 30) {
  const keyBytes = base32ToBytes(secret);
  const counter  = Math.floor(Date.now() / 1000 / period);

  // Pack counter as big-endian 8-byte integer
  const counterBytes = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) { counterBytes[i] = c & 0xff; c = Math.floor(c / 256); }

  const key = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));

  const offset = sig[sig.length - 1] & 0x0f;
  const code = (
    ((sig[offset]     & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) <<  8) |
    ( sig[offset + 3] & 0xff)
  ) % 1_000_000;

  return code.toString().padStart(6, "0");
}

/** Seconds remaining in the current TOTP window */
export function timeLeft(period = 30) {
  return period - (Math.floor(Date.now() / 1000) % period);
}

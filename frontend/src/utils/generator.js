/**
 * Generates a cryptographically random password.
 * @param {number} length - desired length
 * @param {{ upper, lower, nums, syms }} opts - character types
 */
export function generatePassword(length = 16, opts = {}) {
  const { upper = true, lower = true, nums = true, syms = true } = opts;
  let charset = "";
  if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (nums)  charset += "0123456789";
  if (syms)  charset += "!@#$%^&*-_+=[]{}|;:,.<>?";
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => charset[n % charset.length]).join("");
}

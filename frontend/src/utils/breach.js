/**
 * Checks a password against the HaveIBeenPwned database
 * using the k-anonymity API — only the first 5 chars of the
 * SHA-1 hash are sent to the server; the full hash never leaves
 * this browser.
 *
 * @returns {number} count of times the password appeared in known breaches
 * @throws {Error} if the HIBP API is unreachable
 */
export async function checkBreach(password) {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-1", enc.encode(password));
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  const prefix = hex.slice(0, 5);
  const suffix = hex.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { "Add-Padding": "true" },
  });
  if (!response.ok) throw new Error("HIBP API unreachable");

  const text = await response.text();
  for (const line of text.split("\n")) {
    const [s, count] = line.trim().split(":");
    if (s === suffix) return parseInt(count, 10);
  }
  return 0;
}

/**
 * Analyses password strength.
 * Returns { score (1–5), label, color }
 */
export function analyzeStrength(pw) {
  if (!pw) return { score: 0, label: "Empty", color: "#3d3028" };

  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw))         score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^a-zA-Z0-9]/.test(pw))  score++;

  const levels = [
    null,
    { score: 1, label: "Stick 🥢",      color: "#ef4444" },
    { score: 2, label: "Pebble 🪨",     color: "#f97316" },
    { score: 3, label: "Boulder 🗿",    color: "#eab308" },
    { score: 4, label: "Stone Wall 🧱", color: "#22c55e" },
    { score: 5, label: "Mammoth 🦣",    color: "#10b981" },
  ];

  return levels[score <= 2 ? 1 : score <= 3 ? 2 : score <= 4 ? 3 : score <= 5 ? 4 : 5];
}

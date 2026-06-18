require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes  = require("./routes/auth");
const vaultRoutes = require("./routes/vault");
const totpRoutes  = require("./routes/totp");

const app = express();

// ── FIX: collapse accidental double slashes (e.g. "/api//auth/login")
// before routing. This protects against a trailing slash in VITE_API_URL
// (e.g. "https://host/api/") silently producing 404s that are hard to
// diagnose from the frontend side.
app.use((req, _res, next) => {
  req.url = req.url.replace(/\/{2,}/g, "/");
  next();
});

// ── Security middleware ───────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// ── Rate limiting ─────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { error: "Too many requests, slow down caveman." },
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Rate limit exceeded." },
});

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// ── Routes ────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/totp", totpRoutes);

// ── Health check ──────────────────────────────
// Used by the frontend's connectivity banner — see AuthScreen.jsx
app.get("/api/health", (_req, res) => res.json({ status: "alive", cave: "secure" }));

// ── 404 handler ───────────────────────────────
// FIX: echo back the method + path that was actually requested.
// "Route not found" alone gives zero debugging signal — this turns
// a silent misconfiguration (wrong port, stale VITE_API_URL, double
// /api prefix, trailing slash, etc.) into something instantly diagnosable
// in the browser Network tab or server logs.
app.use((req, res) => {
  console.warn(`404: ${req.method} ${req.originalUrl} did not match any route`);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
    hint: "Check that VITE_API_URL in frontend/.env matches where this backend is actually running, and that it has no trailing slash.",
  });
});

// ── Error handler ─────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// ── MongoDB + Start ───────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🔥 Secure Cave server running on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
      console.log(`   CORS origin:  ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   Check MONGODB_URI in backend/.env — is MongoDB running?");
    process.exit(1);
  });

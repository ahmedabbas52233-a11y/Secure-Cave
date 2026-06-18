import { useState } from "react";
import { Flame, Eye, EyeOff, LogIn, UserPlus, AlertCircle, RefreshCw, WifiOff, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useServerStatus } from "../hooks/useServerStatus";

export default function AuthScreen() {
  const { login, register, apiBase } = useAuth();
  const serverStatus = useServerStatus();

  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim())    { setError("Email is required"); return; }
    if (!password.trim()) { setError("Password is required"); return; }
    if (mode === "register" && password.length < 8) {
      setError("Password must be at least 8 characters"); return;
    }
    setLoading(true);
    try {
      if (mode === "login") await login(email.trim(), password);
      else                  await register(email.trim(), password);
    } catch (e) {
      setError(e.message || "Something went wrong");
    }
    setLoading(false);
  };

  const switchMode = (m) => { setMode(m); setError(""); setPassword(""); };

  return (
    <div style={{ minHeight: "100vh", background: "#060504", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(139,92,246,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", pointerEvents: "none" }} viewBox="0 0 1400 140" preserveAspectRatio="none">
        <path d="M0,0 L0,60 Q50,120 100,50 Q150,0 200,80 Q250,140 300,60 Q350,0 400,90 Q450,140 500,50 Q550,0 600,80 Q650,140 700,60 Q750,0 800,100 Q850,140 900,55 Q950,0 1000,85 Q1050,140 1100,50 Q1150,0 1200,90 Q1250,140 1300,55 Q1350,0 1400,70 L1400,0Z" fill="#0a0807" opacity="0.8"/>
      </svg>

      <div className="lock-appear" style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 10 }}>

        {/* ── Server connectivity banner ──────────────────────── */}
        {/* FIX: surfaces "backend unreachable" immediately on load,
            instead of letting the user discover it only after submitting
            the form and seeing a cryptic error. */}
        {serverStatus === "offline" && (
          <div style={{ background: "#2a0f0f", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <WifiOff size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ color: "#ef4444", fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>Can't reach the server</div>
              <div style={{ color: "#c89a9a", fontSize: 11, marginTop: 2, lineHeight: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>
                Tried: {apiBase}/health
              </div>
              <div style={{ color: "#a87a7a", fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
                Make sure the backend is running (<code>cd backend &amp;&amp; npm run dev</code>) and that VITE_API_URL in <code>frontend/.env</code> points at it.
              </div>
            </div>
          </div>
        )}

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "radial-gradient(circle, #1e0e06 0%, #0d0b09 70%)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(249,115,22,0.15)" }}>
              <Flame size={30} color="#f97316" />
            </div>
            <div className="pulse-ring" style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.15)" }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: "#f5ede4", margin: 0, letterSpacing: "0.1em" }}>SECURE CAVE</h1>
          <p style={{ color: "#4a3f35", fontFamily: "'Syne', sans-serif", fontSize: 11, marginTop: 6, letterSpacing: "0.2em", textTransform: "uppercase" }}>Fortress of Secrets</p>
        </div>

        <div style={{ background: "#0d0b09", border: "1px solid #2a1f17", borderRadius: 16, padding: 28, boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", background: "#060504", borderRadius: 10, padding: 3, marginBottom: 24 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? "#1e1208" : "transparent",
                color: mode === m ? "#f97316" : "#4a3f35",
                fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
                transition: "all 0.2s", boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
              }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="caveman@tribe.net"
              className="cave-input"
              autoFocus
            />
          </div>

          {/* Password — FIX: same label ("Password") in both modes now.
              The dual-purpose explanation lives in one persistent info box
              below instead of changing the field's name, which was the
              actual source of the "what is master password?" confusion. */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder={mode === "login" ? "Your password…" : "Min 8 characters…"}
                className="cave-input"
                style={{ paddingRight: 44, fontFamily: "'JetBrains Mono', monospace", letterSpacing: showPw ? "0.06em" : "0.12em" }}
              />
              <button onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a6050", display: "flex", padding: 4 }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ color: "#ef4444", fontSize: 12, margin: "10px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>
              <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} className="btn-ember" style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "12px 0", marginTop: 16 }}>
            {loading
              ? <><RefreshCw size={14} className="spin" /> {mode === "login" ? "Entering…" : "Creating account…"}</>
              : mode === "login"
                ? <><LogIn size={14} /> Enter the Cave</>
                : <><UserPlus size={14} /> Create Account</>
            }
          </button>

          {/* FIX: persistent, clear explanation of the two-step unlock model.
              Shown in BOTH modes (not just register) so it's visible the
              first time someone logs in too — this is the box that directly
              answers "what is master password?" */}
          <div style={{ marginTop: 16, padding: "12px 14px", background: "#0a0807", borderRadius: 10, border: "1px solid #1e1610", display: "flex", gap: 9 }}>
            <Info size={13} color="#7a6050" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: "#7a6050", fontSize: 11.5, fontFamily: "'Syne', sans-serif", lineHeight: 1.7, margin: 0 }}>
              {mode === "register"
                ? <>This password does two jobs: it signs you in, <em>and</em> it encrypts your vault. After creating your account you'll enter it once more to unlock your vault — that second time, it never leaves your browser.</>
                : <>After signing in, you'll be asked for this same password once more to unlock your vault. That step happens entirely in your browser — nothing is sent to the server.</>
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Lock, Eye, EyeOff, Unlock, AlertCircle, RefreshCw, LogOut, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LockScreen({ onUnlock }) {
  const { user, logout } = useAuth();
  const [pw,       setPw]       = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    if (!pw.trim()) { setError("Enter your password"); return; }
    setLoading(true); setError("");
    try {
      await onUnlock(pw);
    } catch (e) {
      setError(e.message || "Failed to unlock");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060504", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      {[{x:"12%",y:"20%"},{x:"88%",y:"15%"},{x:"8%",y:"75%"},{x:"92%",y:"70%"}].map((pos,i) => (
        <div key={i} style={{ position:"absolute", left:pos.x, top:pos.y, width:4, height:4, borderRadius:"50%", background:"#f97316", boxShadow:"0 0 12px 4px rgba(249,115,22,0.4)", opacity:0.6, animation:`pulseRing ${2+i*0.4}s ease-in-out infinite` }} />
      ))}

      <div className="lock-appear" style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, #1a0e06 0%, #0d0b09 70%)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 48px rgba(249,115,22,0.18)" }}>
              <Lock size={32} color="#f97316" />
            </div>
            <div className="pulse-ring" style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.18)" }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "#f5ede4", margin: "0 0 8px", letterSpacing: "0.08em" }}>One More Step</h1>
          {user?.email && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#130f0c", border: "1px solid #2a1f17", borderRadius: 20, padding: "4px 14px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ color: "#7a6050", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{user.email}</span>
            </div>
          )}
        </div>

        <div style={{ background: "#0d0b09", border: "1px solid #2a1f17", borderRadius: 16, padding: 26, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>

          {/* FIX: consistent label — "Password", not "Master Key". Same
              field name as the login screen, since it IS the same value.
              A clear explanation box (below) covers WHY it's asked again,
              instead of inventing a new term for the same secret. */}
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Password
          </label>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Enter the password you just signed in with…"
              className="cave-input"
              style={{ fontSize: 14, paddingRight: 44, fontFamily: "'JetBrains Mono', monospace", letterSpacing: showPw ? "0.06em" : "0.14em" }}
              autoFocus
            />
            <button onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a6050", display: "flex", padding: 4 }}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 6 }}>
              <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{error}</span>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-ember" style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "12px 0" }}>
            {loading ? <><RefreshCw size={14} className="spin" /> Unlocking…</> : <><Unlock size={14} /> Unlock Vault</>}
          </button>

          {/* FIX: explains WHY this screen exists at all, in plain language,
              right where the confusion happens — instead of a vague
              one-liner ("Master key never leaves this browser") that
              assumes the reader already knows what a master key is. */}
          <div style={{ marginTop: 14, padding: "11px 13px", background: "#060504", borderRadius: 8, border: "1px solid #1a1208", display: "flex", gap: 8 }}>
            <Info size={12} color="#4a3f35" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: "#4a3f35", fontSize: 11, fontFamily: "'Syne', sans-serif", lineHeight: 1.6, margin: 0 }}>
              This is the <strong style={{ color: "#7a6050" }}>same password</strong> you just signed in with. Entering it here decrypts your vault locally — it's never sent to the server.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a3f35", fontFamily: "'Syne', sans-serif", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 5, transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#7a6050"}
            onMouseLeave={e => e.currentTarget.style.color = "#4a3f35"}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

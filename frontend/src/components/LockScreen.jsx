import { useState } from "react";
import { Lock, Eye, EyeOff, Unlock, AlertCircle, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LockScreen({ onUnlock }) {
  const { user, logout } = useAuth();
  const [master, setMaster]   = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!master.trim()) { setError("Enter your master key"); return; }
    setLoading(true); setError("");
    try {
      await onUnlock(master);
    } catch (e) {
      setError(e.message || "Failed to unlock");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060504", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Torch flicker dots */}
      {[{x:"12%",y:"20%"},{x:"88%",y:"15%"},{x:"8%",y:"75%"},{x:"92%",y:"70%"}].map((pos,i) => (
        <div key={i} style={{ position:"absolute", left:pos.x, top:pos.y, width:4, height:4, borderRadius:"50%", background:"#f97316", boxShadow:"0 0 12px 4px rgba(249,115,22,0.4)", opacity:0.6, animation:`pulseRing ${2+i*0.4}s ease-in-out infinite` }} />
      ))}

      <div className="lock-appear" style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 10 }}>
        {/* Lock icon */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, #1a0e06 0%, #0d0b09 70%)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 48px rgba(249,115,22,0.18)" }}>
              <Lock size={32} color="#f97316" />
            </div>
            <div className="pulse-ring" style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.18)" }} />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "#f5ede4", margin: "0 0 8px", letterSpacing: "0.08em" }}>Cave Locked</h1>
          {user?.email && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#130f0c", border: "1px solid #2a1f17", borderRadius: 20, padding: "4px 14px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ color: "#7a6050", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{user.email}</span>
            </div>
          )}
        </div>

        <div style={{ background: "#0d0b09", border: "1px solid #2a1f17", borderRadius: 16, padding: 26, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Master Key</label>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              type={showPw ? "text" : "password"}
              value={master}
              onChange={e => setMaster(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Enter your master password…"
              className="cave-input"
              style={{ fontSize: 14, paddingRight: 44, fontFamily: "'JetBrains Mono', monospace", letterSpacing: showPw ? "0.06em" : "0.14em" }}
              autoFocus
            />
            <button onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a6050", display: "flex", padding: 4 }}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={12} /> {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-ember" style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "12px 0" }}>
            {loading ? <><RefreshCw size={14} className="spin" /> Unlocking…</> : <><Unlock size={14} /> Unlock Cave</>}
          </button>

          <div style={{ marginTop: 16, padding: "10px 12px", background: "#060504", borderRadius: 8, border: "1px solid #1a1208" }}>
            <p style={{ color: "#4a3f35", fontSize: 11, fontFamily: "'Syne', sans-serif", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
              🔐 Master key never leaves this browser
            </p>
          </div>
        </div>

        {/* Sign out link */}
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

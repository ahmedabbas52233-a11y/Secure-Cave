import { useState } from "react";
import { Key, X, Eye, EyeOff, Zap, RefreshCw, Check, AlertTriangle, CheckCircle, WifiOff } from "lucide-react";
import StrengthBar from "../ui/StrengthBar";
import { generatePassword } from "../../utils/generator";
import { checkBreach }      from "../../utils/breach";

const CAT_COLOR = { Social: "#818cf8", Work: "#38bdf8", Finance: "#34d399", Other: "#a78bfa" };
const CAT_ICON  = { Social: "👥", Work: "💼", Finance: "💰", Other: "🌐" };

export default function EntryModal({ mode, form, setForm, onSave, onCancel }) {
  const [showPw,    setShowPw]    = useState(false);
  const [errors,    setErrors]    = useState({});
  const [genOpen,   setGenOpen]   = useState(false);
  const [genLen,    setGenLen]    = useState(16);
  const [genOpts,   setGenOpts]   = useState({ upper: true, lower: true, nums: true, syms: true });
  const [preview,   setPreview]   = useState("");
  const [breach,    setBreach]    = useState(null); // null | "checking" | { count }
  const [breachErr, setBreachErr] = useState("");

  // BUG FIX: username is optional (backend model has it as non-required)
  const validate = () => {
    const e = {};
    if (!form.site.trim())     e.site     = "Site is required";
    if (!form.password.trim()) e.password = "Password is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleBreach = async () => {
    if (!form.password) return;
    setBreach("checking"); setBreachErr("");
    try {
      setBreach({ count: await checkBreach(form.password) });
    } catch {
      setBreach(null);
      setBreachErr("Could not reach HIBP — check connection");
    }
  };

  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1e1208", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Key size={15} color="#f97316" />
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 15, fontWeight: 600 }}>
              {mode === "add" ? "Carve New Secret" : "Reshape Secret"}
            </span>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#7a6050", padding: 4, display: "flex", borderRadius: 6, transition: "color 0.2s" }}>
            <X size={16} />
          </button>
        </div>

        {/* Site */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Website / App</label>
          <input
            value={form.site}
            onChange={e => setForm(f => ({ ...f, site: e.target.value }))}
            placeholder="github.com"
            className={`cave-input${errors.site ? " error" : ""}`}
          />
          {errors.site && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{errors.site}</div>}
        </div>

        {/* Username (optional) */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Username / Email <span style={{ color: "#3a2d20", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            placeholder="caveman@tribe.net"
            className="cave-input"
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
            <button onClick={() => setGenOpen(g => !g)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f97316", fontSize: 11, fontFamily: "'Syne', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
              <Zap size={11} /> {genOpen ? "Hide Forge" : "Forge Password"}
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Enter or forge a password"
              className={`cave-input${errors.password ? " error" : ""}`}
              style={{ paddingRight: 44, fontFamily: "'JetBrains Mono', monospace" }}
            />
            <button onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a6050", display: "flex", padding: 4 }}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{errors.password}</div>}
          <StrengthBar password={form.password} />
        </div>

        {/* Password Generator */}
        {genOpen && (
          <div style={{ background: "#0a0807", border: "1px solid #2a1f17", borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Zap size={12} color="#f97316" />
              <span style={{ fontSize: 12, fontFamily: "'Syne', sans-serif", color: "#f97316", fontWeight: 600 }}>Password Forge</span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#7a6050" }}>Length</span>
                <span style={{ fontSize: 11, color: "#f97316", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{genLen}</span>
              </div>
              <input type="range" min={8} max={32} value={genLen} onChange={e => setGenLen(+e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              {[["upper","A–Z"],["lower","a–z"],["nums","0–9"],["syms","!@#"]].map(([k, l]) => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 11, color: genOpts[k] ? "#f5ede4" : "#7a6050", transition: "color 0.2s" }}>
                  <input type="checkbox" checked={genOpts[k]} onChange={e => setGenOpts(o => ({ ...o, [k]: e.target.checked }))} /> {l}
                </label>
              ))}
            </div>
            {preview && (
              <div style={{ background: "#130f0c", border: "1px solid #2e2010", borderRadius: 8, padding: "10px 12px", marginBottom: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#f5ede4", wordBreak: "break-all", letterSpacing: "0.05em" }}>
                {preview}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPreview(generatePassword(genLen, genOpts))} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                <RefreshCw size={12} /> Roll Dice
              </button>
              {preview && (
                <button onClick={() => { setForm(f => ({ ...f, password: preview })); setGenOpen(false); setPreview(""); }} className="btn-ember" style={{ flex: 1, justifyContent: "center" }}>
                  <Check size={12} /> Use This
                </button>
              )}
            </div>
          </div>
        )}

        {/* Breach check */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={handleBreach}
            disabled={!form.password || breach === "checking"}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: "none", border: "1px solid #2a1f17", borderRadius: 8, padding: "8px 14px", cursor: form.password ? "pointer" : "not-allowed", color: "#7a6050", fontSize: 12, fontFamily: "'Syne', sans-serif", opacity: form.password ? 1 : 0.4, transition: "all 0.2s" }}>
            {breach === "checking"
              ? <><RefreshCw size={12} className="spin" /> Checking breaches…</>
              : <><AlertTriangle size={12} /> Check Data Breaches</>
            }
          </button>
          {breach && breach !== "checking" && (
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: breach.count > 0 ? "#2a0f0f" : "#0f1f14", border: `1px solid ${breach.count > 0 ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: breach.count > 0 ? "#ef4444" : "#22c55e" }}>
              {breach.count > 0 ? <AlertTriangle size={13} /> : <CheckCircle size={13} />}
              {breach.count > 0 ? `Seen ${breach.count.toLocaleString()}× in known breaches!` : "Not found in known breaches ✓"}
            </div>
          )}
          {breachErr && (
            <div style={{ marginTop: 6, fontSize: 11, color: "#f97316", display: "flex", alignItems: "center", gap: 5 }}>
              <WifiOff size={11} /> {breachErr}
            </div>
          )}
        </div>

        {/* Category */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Category</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Social","Work","Finance","Other"].map(cat => {
              const active = form.category === cat;
              const col = CAT_COLOR[cat];
              return (
                <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))} style={{ flex: 1, padding: "7px 4px", borderRadius: 8, border: `1px solid ${active ? col + "55" : "#2a1f17"}`, background: active ? col + "12" : "#0a0807", color: active ? col : "#7a6050", cursor: "pointer", fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: active ? 600 : 400, transition: "all 0.2s" }}>
                  {CAT_ICON[cat]} {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          <button onClick={() => validate() && onSave()} className="btn-ember" style={{ flex: 2, justifyContent: "center" }}>
            {mode === "add" ? "Carve Into Stone" : "Update Tablet"}
          </button>
        </div>
      </div>
    </div>
  );
}

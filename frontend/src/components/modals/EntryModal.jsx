import { useState } from "react";
import { Key, X, Eye, EyeOff, Zap, RefreshCw, Check, AlertTriangle, CheckCircle, WifiOff, BookOpen } from "lucide-react";
import StrengthBar from "../ui/StrengthBar";
import { generatePassword }   from "../../utils/generator";
import { generatePassphrase } from "../../utils/passphrase";
import { checkBreach }        from "../../utils/breach";

const CAT_COLOR = { Social: "#818cf8", Work: "#38bdf8", Finance: "#34d399", Other: "#a78bfa" };
const CAT_ICON  = { Social: "👥", Work: "💼", Finance: "💰", Other: "🌐" };
const SEPS = ["-", " ", ".", "_"];

export default function EntryModal({ mode, form, setForm, onSave, onCancel }) {
  const [showPw,    setShowPw]    = useState(false);
  const [errors,    setErrors]    = useState({});
  const [genOpen,   setGenOpen]   = useState(false);
  const [forgeTab,  setForgeTab]  = useState("password"); // "password" | "passphrase"

  // Password forge
  const [genLen,  setGenLen]  = useState(16);
  const [genOpts, setGenOpts] = useState({ upper: true, lower: true, nums: true, syms: true });

  // Passphrase forge
  const [wordCount, setWordCount] = useState(5);
  const [separator, setSeparator] = useState("-");

  const [preview,   setPreview]   = useState("");
  const [breach,    setBreach]    = useState(null);
  const [breachErr, setBreachErr] = useState("");

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
    try { setBreach({ count: await checkBreach(form.password) }); }
    catch { setBreach(null); setBreachErr("Could not reach HIBP — check connection"); }
  };

  const roll = () => {
    if (forgeTab === "password") {
      setPreview(generatePassword(genLen, genOpts));
    } else {
      setPreview(generatePassphrase(wordCount, separator));
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
          <button onClick={onCancel} className="icon-btn"><X size={16} /></button>
        </div>

        {/* Site */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Website / App</label>
          <input value={form.site} onChange={e => setForm(f => ({ ...f, site: e.target.value }))} placeholder="github.com" className={`cave-input${errors.site ? " error" : ""}`} />
          {errors.site && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{errors.site}</div>}
        </div>

        {/* Username (optional) */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Username / Email <span style={{ color: "#3a2d20", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="caveman@tribe.net" className="cave-input" />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
            <button onClick={() => { setGenOpen(g => !g); setPreview(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#f97316", fontSize: 11, fontFamily: "'Syne', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
              <Zap size={11} /> {genOpen ? "Hide Forge" : "Forge"}
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Enter or forge a password" className={`cave-input${errors.password ? " error" : ""}`} style={{ paddingRight: 44, fontFamily: "'JetBrains Mono', monospace" }} />
            <button onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a6050", display: "flex", padding: 4 }}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{errors.password}</div>}
          <StrengthBar password={form.password} />
        </div>

        {/* ── Password Forge ─────────────────────────────── */}
        {genOpen && (
          <div style={{ background: "#0a0807", border: "1px solid #2a1f17", borderRadius: 10, padding: 14, marginBottom: 14 }}>

            {/* Tabs: Password / Passphrase */}
            <div style={{ display: "flex", background: "#060504", borderRadius: 8, padding: 3, marginBottom: 14 }}>
              {[["password", <Zap size={11}/>, "Password"], ["passphrase", <BookOpen size={11}/>, "Passphrase"]].map(([id, icon, lbl]) => (
                <button key={id} onClick={() => { setForgeTab(id); setPreview(""); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 0", borderRadius: 6, border: "none", cursor: "pointer", background: forgeTab === id ? "#1e1208" : "transparent", color: forgeTab === id ? "#f97316" : "#7a6050", fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: forgeTab === id ? 600 : 400, transition: "all 0.2s" }}>
                  {icon} {lbl}
                </button>
              ))}
            </div>

            {forgeTab === "password" ? (
              <>
                {/* Length slider */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "#7a6050" }}>Length</span>
                    <span style={{ fontSize: 11, color: "#f97316", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{genLen}</span>
                  </div>
                  <input type="range" min={8} max={32} value={genLen} onChange={e => setGenLen(+e.target.value)} />
                </div>
                {/* Charset */}
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
                  {[["upper","A–Z"],["lower","a–z"],["nums","0–9"],["syms","!@#"]].map(([k, l]) => (
                    <label key={k} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 11, color: genOpts[k] ? "#f5ede4" : "#7a6050" }}>
                      <input type="checkbox" checked={genOpts[k]} onChange={e => setGenOpts(o => ({ ...o, [k]: e.target.checked }))} /> {l}
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Word count */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "#7a6050" }}>Words</span>
                    <span style={{ fontSize: 11, color: "#f97316", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{wordCount}</span>
                  </div>
                  <input type="range" min={3} max={8} value={wordCount} onChange={e => setWordCount(+e.target.value)} />
                </div>
                {/* Separator */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#7a6050" }}>Separator</span>
                  {SEPS.map(s => (
                    <button key={s} onClick={() => setSeparator(s)} style={{ width: 32, height: 28, borderRadius: 6, border: `1px solid ${separator === s ? "rgba(249,115,22,0.5)" : "#2a1f17"}`, background: separator === s ? "rgba(249,115,22,0.12)" : "#130f0c", color: separator === s ? "#f97316" : "#7a6050", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s === " " ? "·" : s}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#4a3f35", marginBottom: 8 }}>
                  Entropy: ~{Math.floor(wordCount * Math.log2(256))} bits
                </div>
              </>
            )}

            {/* Preview */}
            {preview && (
              <div style={{ background: "#130f0c", border: "1px solid #2e2010", borderRadius: 8, padding: "10px 12px", marginBottom: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#f5ede4", wordBreak: "break-all", letterSpacing: "0.04em" }}>
                {preview}
              </div>
            )}

            {/* Roll / Use buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={roll} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
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
          <button onClick={handleBreach} disabled={!form.password || breach === "checking"} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: "none", border: "1px solid #2a1f17", borderRadius: 8, padding: "8px 14px", cursor: form.password ? "pointer" : "not-allowed", color: "#7a6050", fontSize: 12, fontFamily: "'Syne', sans-serif", opacity: form.password ? 1 : 0.4, transition: "all 0.2s" }}>
            {breach === "checking" ? <><RefreshCw size={12} className="spin" /> Checking…</> : <><AlertTriangle size={12} /> Check Data Breaches</>}
          </button>
          {breach && breach !== "checking" && (
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: breach.count > 0 ? "#2a0f0f" : "#0f1f14", border: `1px solid ${breach.count > 0 ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: breach.count > 0 ? "#ef4444" : "#22c55e" }}>
              {breach.count > 0 ? <AlertTriangle size={13} /> : <CheckCircle size={13} />}
              {breach.count > 0 ? `Seen ${breach.count.toLocaleString()}× in breaches!` : "Not found in known breaches ✓"}
            </div>
          )}
          {breachErr && <div style={{ marginTop: 6, fontSize: 11, color: "#f97316", display: "flex", alignItems: "center", gap: 5 }}><WifiOff size={11} /> {breachErr}</div>}
        </div>

        {/* Category */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: "block", fontSize: 11, color: "#7a6050", fontFamily: "'Syne', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Category</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Social","Work","Finance","Other"].map(cat => {
              const active = form.category === cat;
              const col    = CAT_COLOR[cat];
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

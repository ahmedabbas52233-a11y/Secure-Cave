import { useRef } from "react";
import { Download, Upload, Shield, CheckCircle, AlertTriangle, Lock, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const SECURITY_ITEMS = [
  ["AES-256-GCM Encryption",  "Passwords encrypted in-browser with a unique IV before any data leaves your device."],
  ["PBKDF2 Key Derivation",   "Your password is strengthened via PBKDF2-SHA256 with 120,000 iterations before it's used to encrypt anything."],
  ["Zero-Knowledge Backend",  "Server stores only ciphertext + IVs — mathematically cannot read your passwords."],
  ["HIBP k-Anonymity",        "Breach checks send only the first 5 hex chars of your SHA-1 hash — full hash never leaves the browser."],
  ["JWT Authentication",      "Every API call requires a signed, expiry-bounded JWT. No session cookies."],
  ["Rate Limiting",           "Auth endpoints: 20 req/15 min. API: 100 req/min."],
];

const LOCK_OPTIONS = [
  { label: "Disabled",  ms: 0             },
  { label: "1 minute",  ms: 1  * 60_000   },
  { label: "5 minutes", ms: 5  * 60_000   },
  { label: "15 minutes",ms: 15 * 60_000   },
  { label: "30 minutes",ms: 30 * 60_000   },
];

export default function SettingsView({ onExport, onImport, importError, vaultCount, autoLockMs, onAutoLockChange }) {
  const fileRef = useRef();
  const { C }   = useTheme();

  const card = { background: C.bgRaised, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 };

  return (
    <div style={{ padding: "0 28px 28px" }}>

      {/* ── Auto-lock ─────────────────────────────────────────── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={15} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", color: C.textBone, fontSize: 14, fontWeight: 600 }}>Auto-Lock</div>
            <div style={{ fontSize: 11, color: C.textDust, marginTop: 2 }}>Lock vault after idle period or tab is hidden</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {LOCK_OPTIONS.map(({ label, ms }) => (
            <button key={ms} onClick={() => onAutoLockChange(ms)} style={{
              padding: "7px 14px", borderRadius: 8, border: `1px solid ${autoLockMs === ms ? "rgba(129,140,248,0.5)" : C.border}`,
              background: autoLockMs === ms ? "rgba(129,140,248,0.12)" : "transparent",
              color: autoLockMs === ms ? "#818cf8" : C.textDust, cursor: "pointer",
              fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: autoLockMs === ms ? 600 : 400, transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>
        {autoLockMs > 0 && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#818cf8" }}>
            <Lock size={10} /> Vault also locks immediately when the tab is hidden
          </div>
        )}
      </div>

      {/* ── Import / Export ───────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Export */}
        <div style={{ ...card, marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Download size={15} color="#f97316" />
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", color: C.textBone, fontSize: 14, fontWeight: 600 }}>Export Vault</span>
          </div>
          <div style={{ background: C.bgElevated, border: `1px solid rgba(249,115,22,0.18)`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
            <p style={{ color: "#f97316", fontSize: 11, fontFamily: "'Syne', sans-serif", display: "flex", alignItems: "flex-start", gap: 6, margin: 0, lineHeight: 1.5 }}>
              <AlertTriangle size={11} style={{ flexShrink: 0, marginTop: 2 }} />
              CSV contains plain-text passwords. Delete after use.
            </p>
          </div>
          <p style={{ color: C.textDust, fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
            Exports all {vaultCount} entries. Compatible with most password managers.
          </p>
          <button onClick={onExport} disabled={vaultCount === 0} className="btn-ember" style={{ width: "100%", justifyContent: "center", opacity: vaultCount === 0 ? 0.4 : 1 }}>
            <Download size={13} /> Export {vaultCount} Entries
          </button>
        </div>

        {/* Import */}
        <div style={{ ...card, marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={15} color="#818cf8" />
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", color: C.textBone, fontSize: 14, fontWeight: 600 }}>Import CSV</span>
          </div>
          <p style={{ color: C.textDust, fontSize: 12, marginBottom: 8, lineHeight: 1.6 }}>
            Required:&nbsp;
            <code style={{ background: C.bgElevated, padding: "1px 5px", borderRadius: 3, fontSize: 11, color: C.textStone }}>site</code>,&nbsp;
            <code style={{ background: C.bgElevated, padding: "1px 5px", borderRadius: 3, fontSize: 11, color: C.textStone }}>password</code>.
          </p>
          <p style={{ color: C.textDust, fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
            Passwords are encrypted in-browser before upload.
          </p>
          <button onClick={() => fileRef.current?.click()} style={{ width: "100%", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.3)", color: "#818cf8", borderRadius: 8, padding: "10px 0", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}>
            <Upload size={13} /> Choose CSV File
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={onImport} style={{ display: "none" }} />
          {importError && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}><AlertTriangle size={11} /> {importError}</div>}
        </div>
      </div>

      {/* ── Security architecture ─────────────────────────────── */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={15} color="#10b981" />
          </div>
          <span style={{ fontFamily: "'Cinzel', serif", color: C.textBone, fontSize: 14, fontWeight: 600 }}>Security Architecture</span>
        </div>
        {SECURITY_ITEMS.map(([title, desc], i) => (
          <div key={title} style={{ display: "flex", gap: 12, paddingBottom: 14, marginBottom: i < SECURITY_ITEMS.length - 1 ? 14 : 0, borderBottom: i < SECURITY_ITEMS.length - 1 ? `1px solid ${C.borderDim}` : "none" }}>
            <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: C.textBone, fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 12, color: C.textDust, marginTop: 3, lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

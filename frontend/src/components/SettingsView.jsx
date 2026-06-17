import { useRef } from "react";
import { Download, Upload, Shield, CheckCircle, AlertTriangle } from "lucide-react";

const SECURITY_ITEMS = [
  ["AES-256-GCM Encryption",  "Passwords are encrypted in your browser with a unique IV before any data leaves your device."],
  ["PBKDF2 Key Derivation",   "Your master key is strengthened via PBKDF2-SHA256 with 120,000 iterations before use."],
  ["Zero-Knowledge Backend",  "The server stores only ciphertext and IVs — it can never read or recover your passwords."],
  ["HIBP k-Anonymity",        "Breach checks send only the first 5 hex chars of your SHA-1 hash — the full hash never leaves your browser."],
  ["JWT Authentication",      "Every API call requires a signed, expiry-bounded JWT. No session cookies, no server-side sessions."],
  ["Rate Limiting",           "Auth endpoints are limited to 20 requests per 15 min to prevent brute-force attacks."],
];

export default function SettingsView({ onExport, onImport, importError, vaultCount }) {
  const fileRef = useRef();

  return (
    <div style={{ padding: "0 28px 28px" }}>
      {/* Import / Export */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Export */}
        <div style={{ background: "#130f0c", border: "1px solid #2a1f17", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Download size={15} color="#f97316" />
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 14, fontWeight: 600 }}>Export Vault</span>
          </div>
          <div style={{ background: "#0a0807", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
            <p style={{ color: "#f97316", fontSize: 11, fontFamily: "'Syne', sans-serif", display: "flex", alignItems: "flex-start", gap: 6, margin: 0, lineHeight: 1.5 }}>
              <AlertTriangle size={11} style={{ flexShrink: 0, marginTop: 2 }} />
              CSV contains plain-text passwords. Store securely and delete after use.
            </p>
          </div>
          <p style={{ color: "#7a6050", fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
            Exports all {vaultCount} entries. Compatible with most password managers.
          </p>
          <button onClick={onExport} disabled={vaultCount === 0} className="btn-ember" style={{ width: "100%", justifyContent: "center", opacity: vaultCount === 0 ? 0.4 : 1 }}>
            <Download size={13} /> Export {vaultCount} Entries
          </button>
        </div>

        {/* Import */}
        <div style={{ background: "#130f0c", border: "1px solid #2a1f17", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={15} color="#818cf8" />
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 14, fontWeight: 600 }}>Import CSV</span>
          </div>
          <p style={{ color: "#7a6050", fontSize: 12, marginBottom: 8, lineHeight: 1.6 }}>
            Required:&nbsp;
            <code style={{ background: "#1e1610", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: "#c8b8a8" }}>site</code>,&nbsp;
            <code style={{ background: "#1e1610", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: "#c8b8a8" }}>password</code>.&nbsp;
            Optional:&nbsp;
            <code style={{ background: "#1e1610", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: "#c8b8a8" }}>username</code>,&nbsp;
            <code style={{ background: "#1e1610", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: "#c8b8a8" }}>category</code>.
          </p>
          <p style={{ color: "#7a6050", fontSize: 12, marginBottom: 14, lineHeight: 1.6 }}>
            Passwords will be encrypted in-browser before being stored.
          </p>
          <button onClick={() => fileRef.current?.click()} style={{ width: "100%", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.3)", color: "#818cf8", borderRadius: 8, padding: "10px 0", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}>
            <Upload size={13} /> Choose CSV File
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={onImport} style={{ display: "none" }} />
          {importError && (
            <div style={{ color: "#ef4444", fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
              <AlertTriangle size={11} /> {importError}
            </div>
          )}
        </div>
      </div>

      {/* Security architecture */}
      <div style={{ background: "#130f0c", border: "1px solid #2a1f17", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={15} color="#10b981" />
          </div>
          <span style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 14, fontWeight: 600 }}>Security Architecture</span>
        </div>
        {SECURITY_ITEMS.map(([title, desc], i) => (
          <div key={title} style={{ display: "flex", gap: 12, paddingBottom: 14, marginBottom: i < SECURITY_ITEMS.length - 1 ? 14 : 0, borderBottom: i < SECURITY_ITEMS.length - 1 ? "1px solid #1e1610" : "none" }}>
            <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#f5ede4", fontWeight: 600 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#7a6050", marginTop: 3, lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

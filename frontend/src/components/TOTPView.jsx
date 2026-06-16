import { useState } from "react";
import { Plus, Trash2, Hash, Copy, Check } from "lucide-react";

// Circular SVG progress ring for TOTP countdown
function RingTimer({ timeLeft, period = 30 }) {
  const pct  = timeLeft / period;
  const r    = 18;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const color = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f97316" : "#22c55e";
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* track */}
      <circle cx="24" cy="24" r={r} fill="none" stroke="#1e1610" strokeWidth="3" />
      {/* progress */}
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 24 24)" style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
      />
      <text x="24" y="28" textAnchor="middle" fill={color} fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
        {timeLeft}
      </text>
    </svg>
  );
}

function TOTPCard({ entry, code, timeLeft, onDelete }) {
  const [copied, setCopied] = useState(false);
  const color = (timeLeft ?? 30) <= 5 ? "#ef4444" : (timeLeft ?? 30) <= 10 ? "#f97316" : "#22c55e";
  const fmt   = code ? `${code.slice(0,3)} ${code.slice(3)}` : "--- ---";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code || "").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="pw-card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {/* Ring */}
      <div style={{ flexShrink: 0 }}>
        <RingTimer timeLeft={timeLeft ?? 30} />
      </div>

      {/* Name + Code */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#f5ede4", fontSize: 13, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.name}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700, color, letterSpacing: "0.2em", lineHeight: 1 }}>{fmt}</div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={handleCopy} className="icon-btn" style={{ color: copied ? "#22c55e" : undefined }}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
        <button onClick={onDelete} className="icon-btn danger">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function TOTPView({ entries, codes, times, onAdd, onDelete }) {
  const [name,   setName]   = useState("");
  const [secret, setSecret] = useState("");
  const [open,   setOpen]   = useState(false);
  const [error,  setError]  = useState("");

  const handleAdd = () => {
    if (!name.trim())   { setError("Service name is required"); return; }
    if (!secret.trim()) { setError("TOTP secret is required"); return; }
    onAdd(name.trim(), secret.trim().toUpperCase().replace(/\s/g, ""));
    setName(""); setSecret(""); setOpen(false); setError("");
  };

  return (
    <div style={{ padding: "0 28px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ color: "#4a3f35", fontSize: 13, margin: 0, fontFamily: "'Syne', sans-serif" }}>
          {entries.length > 0 ? `${entries.length} active code${entries.length !== 1 ? "s" : ""}` : "Time-based one-time codes"}
        </p>
        <button onClick={() => { setOpen(o => !o); setError(""); }} className="btn-ember" style={{ padding: "8px 16px", fontSize: 12 }}>
          <Plus size={13} /> Add 2FA
        </button>
      </div>

      {/* Add form */}
      {open && (
        <div style={{ background: "#0d0b09", border: "1px solid #2a1f17", borderRadius: 12, padding: 18, marginBottom: 20, animation: "slideUp 0.2s ease" }}>
          <div style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Add TOTP Account</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Service name (e.g. GitHub)"
              className="cave-input"
              style={{ flex: "1 1 160px" }}
            />
            <input
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Base32 TOTP secret"
              className="cave-input"
              style={{ flex: "2 1 220px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}
            />
          </div>
          {error && <div style={{ color: "#ef4444", fontSize: 11, marginBottom: 10 }}>{error}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setOpen(false); setError(""); }} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button onClick={handleAdd} className="btn-ember" style={{ flex: 2, justifyContent: "center" }}>Activate Double Lock</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && !open ? (
        <div style={{ textAlign: "center", padding: "56px 20px", color: "#7a6050" }}>
          <Hash size={36} style={{ margin: "0 auto 16px", opacity: 0.25, display: "block" }} />
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, lineHeight: 1.8, color: "#4a3f35" }}>
            No 2FA entries yet.<br />Add a TOTP secret to generate codes.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {entries.map(e => {
            const id = e._id || e.id;
            return (
              <TOTPCard
                key={id}
                entry={e}
                code={codes[id]}
                timeLeft={times[id]}
                onDelete={() => onDelete(id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { AlertTriangle, RefreshCw, Clock, Layers, CheckCircle, Lock } from "lucide-react";
import { analyzeStrength } from "../utils/strength";

const ISSUE_COLOR = { weak: "#ef4444", reused: "#f97316", old: "#eab308" };
const ISSUE_ICON  = { weak: AlertTriangle, reused: RefreshCw, old: Clock };

export default function HealthView({ vault, decryptedPws, onEditById }) {
  const [scanning, setScanning] = useState(false);

  const pwCount = {};
  Object.values(decryptedPws).forEach(p => { if (p) pwCount[p] = (pwCount[p] || 0) + 1; });

  const AGE_MS = 90 * 24 * 60 * 60 * 1000;
  let weak = 0, reused = 0, old = 0;
  const issues = [];

  vault.forEach(e => {
    const id  = e._id || e.id;
    const pw  = decryptedPws[id] || "";
    const str = analyzeStrength(pw);
    const isWeak   = pw && str.score <= 2;
    const isReused = pw && pwCount[pw] > 1;
    // Use updatedAt for age check if available
    const ageDate  = e.updatedAt || e.createdAt;
    const isOld    = ageDate && (Date.now() - new Date(ageDate)) > AGE_MS;

    if (isWeak)   { weak++;   issues.push({ id, site: e.site, type: "weak",   msg: `Weak password (${str.label})` }); }
    if (isReused) { reused++; issues.push({ id, site: e.site, type: "reused", msg: "Password reused across sites" }); }
    if (isOld)    { old++;    issues.push({ id, site: e.site, type: "old",    msg: "Not updated in 90+ days" }); }
  });

  const total       = vault.length;
  const decrypted   = Object.keys(decryptedPws).length;
  const issueCount  = issues.length;
  const score       = total === 0 ? 100 : Math.max(0, Math.round(100 - (issueCount / Math.max(total * 3, 1)) * 100));
  const scoreColor  = score >= 80 ? "#10b981" : score >= 50 ? "#eab308" : "#ef4444";
  const scoreMsg    = score >= 80 ? "Your cave is fortified. Mammoth-level security." : score >= 50 ? "Some weak spots in your cave walls." : "Your defenses are crumbling — fix issues below!";
  const hasUnscanned = total > 0 && decrypted < total;

  return (
    <div style={{ padding: "0 28px 28px" }}>
      {/* Score circle + summary */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="46" fill="none" stroke="#1e1610" strokeWidth="8"/>
            <circle cx="55" cy="55" r="46" fill="none" stroke={scoreColor} strokeWidth="8"
              strokeDasharray={`${(score / 100) * 289} 289`} strokeLinecap="round"
              transform="rotate(-90 55 55)" style={{ transition: "stroke-dasharray 1s ease, stroke 0.3s" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 10, color: "#7a6050", marginTop: 2 }}>/ 100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>Vault Health</h3>
          <p style={{ color: "#7a6050", fontSize: 13, lineHeight: 1.6, margin: "0 0 10px" }}>{scoreMsg}</p>
          {hasUnscanned && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#f97316", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 8, padding: "6px 12px" }}>
              <Lock size={11} />
              {total - decrypted} of {total} entries not yet revealed — reveal passwords to scan them
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Weak",     val: weak,     color: "#ef4444", Icon: AlertTriangle },
          { label: "Reused",   val: reused,   color: "#f97316", Icon: RefreshCw    },
          { label: "Aged 90d+",val: old,      color: "#eab308", Icon: Clock        },
          { label: "Total",    val: total,    color: "#818cf8", Icon: Layers       },
        ].map(({ label, val, color, Icon }) => (
          <div key={label} style={{ background: "#130f0c", border: `1px solid ${color}22`, borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
            <Icon size={16} color={color} style={{ margin: "0 auto 8px", display: "block" }} />
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 11, color: "#7a6050", marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Issues list */}
      {issues.length > 0 ? (
        <>
          <div style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color="#f97316" /> {issueCount} Issue{issueCount !== 1 ? "s" : ""} Found
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {issues.map((iss, i) => {
              const col  = ISSUE_COLOR[iss.type];
              const Icon = ISSUE_ICON[iss.type];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: "#130f0c", border: `1px solid ${col}22`, borderRadius: 10, padding: "10px 16px" }}>
                  <Icon size={14} color={col} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#f5ede4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{iss.site}</div>
                    <div style={{ fontSize: 11, color: "#7a6050", marginTop: 2 }}>{iss.msg}</div>
                  </div>
                  <button onClick={() => onEditById(iss.id)} style={{ background: "#1e1610", border: "1px solid #2a1f17", borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: "#f97316", fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 600, transition: "all 0.2s", flexShrink: 0, whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#2a1f17"}>
                    Fix →
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : total > 0 ? (
        <div style={{ textAlign: "center", padding: "28px 0", color: "#22c55e", fontFamily: "'Cinzel', serif", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <CheckCircle size={18} /> {hasUnscanned ? "No issues in revealed entries" : "No issues detected — cave stands strong!"}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "28px 0", color: "#7a6050", fontFamily: "'Cinzel', serif", fontSize: 13 }}>
          Add passwords to begin health analysis
        </div>
      )}
    </div>
  );
}

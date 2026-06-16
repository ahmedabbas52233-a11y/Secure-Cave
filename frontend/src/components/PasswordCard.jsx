import { useState } from "react";
import { Eye, EyeOff, Copy, Edit2, Trash2, Check } from "lucide-react";
import Favicon from "./ui/Favicon";
import { analyzeStrength } from "../utils/strength";

const CAT_COLOR = { Social: "#818cf8", Work: "#38bdf8", Finance: "#34d399", Other: "#a78bfa" };

export default function PasswordCard({ entry, decryptedPw, visible, onToggle, onCopy, onEdit, onDelete }) {
  const [flash, setFlash] = useState(false);
  const str = analyzeStrength(decryptedPw || "");
  // Use updatedAt if available, otherwise createdAt (for age display)
  const refDate = entry.updatedAt || entry.createdAt;
  const daysOld = refDate ? Math.floor((Date.now() - new Date(refDate)) / 86_400_000) : null;
  const catColor = CAT_COLOR[entry.category] || "#a78bfa";

  const handleCopy = async () => {
    await onCopy();
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  };

  return (
    <div className="pw-card">
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Favicon site={entry.site} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#f5ede4", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {entry.site}
          </div>
          {entry.username ? (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7a6050", fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {entry.username}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: "#3a2d20", marginTop: 2, fontStyle: "italic" }}>no username</div>
          )}
        </div>
        <span style={{ fontSize: 10, color: catColor, background: catColor + "18", borderRadius: 4, padding: "2px 8px", fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap", border: `1px solid ${catColor}22` }}>
          {entry.category}
        </span>
      </div>

      {/* Password row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, background: "#0d0b09", borderRadius: 8, padding: "8px 12px", border: "1px solid #1e1610" }}>
        <span style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#c8b8a8", letterSpacing: visible ? "0.06em" : "0.22em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", userSelect: visible ? "text" : "none" }}>
          {visible ? (decryptedPw || "…") : "●●●●●●●●●●●"}
        </span>
        <button onClick={onToggle} className="icon-btn" title={visible ? "Hide" : "Reveal"}>
          {visible ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button onClick={handleCopy} className="icon-btn" style={{ color: flash ? "#22c55e" : undefined }} title="Copy password">
          {flash ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {decryptedPw ? (
            <>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: str.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#7a6050" }}>{str.label}</span>
            </>
          ) : (
            <span style={{ fontSize: 11, color: "#3a2d20" }}>locked</span>
          )}
          {daysOld !== null && daysOld > 90 && (
            <span style={{ fontSize: 10, color: "#f97316", background: "rgba(249,115,22,0.1)", borderRadius: 4, padding: "1px 6px", border: "1px solid rgba(249,115,22,0.2)" }}>
              ⚠ {daysOld}d old
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={onEdit}   className="icon-btn" title="Edit"><Edit2  size={13} /></button>
          <button onClick={onDelete} className="icon-btn danger" title="Delete"><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  );
}

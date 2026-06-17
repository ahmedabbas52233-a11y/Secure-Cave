export default function EmptyState({ onAdd }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", gap: 16 }}>
      <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
        <ellipse cx="60" cy="80" rx="50" ry="8" fill="#1a1208" />
        <path d="M20 70 Q20 10 60 10 Q100 10 100 70 L90 70 Q90 25 60 25 Q30 25 30 70Z" fill="#1e1610" stroke="#2e2218" strokeWidth="1.5"/>
        <path d="M38 70 L38 35 Q38 28 60 28 Q82 28 82 35 L82 70" fill="#130f0c" stroke="#2e2218" strokeWidth="1"/>
        <rect x="50" y="48" width="20" height="28" rx="4" fill="#1e1610" stroke="#3d2d1f" strokeWidth="1.5"/>
        <circle cx="60" cy="58" r="4" fill="#3d2d1f"/>
        <line x1="60" y1="58" x2="60" y2="65" stroke="#2a1f17" strokeWidth="1.5"/>
        <circle cx="60" cy="20" r="6" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.5"/>
        <path d="M55 17 Q60 12 65 17" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <circle cx="60" cy="20" r="2" fill="#f97316" opacity="0.7"/>
      </svg>
      <p style={{ fontFamily: "'Cinzel', serif", color: "#7a6050", fontSize: 14, textAlign: "center", lineHeight: 1.7 }}>
        The cave is empty.<br />Carve your first secret.
      </p>
      <button onClick={onAdd} className="btn-ember">+ Add First Entry</button>
    </div>
  );
}

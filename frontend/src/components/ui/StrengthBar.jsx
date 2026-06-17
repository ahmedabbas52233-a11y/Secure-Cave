import { analyzeStrength } from "../../utils/strength";

export default function StrengthBar({ password }) {
  const { score, label, color } = analyzeStrength(password);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= score ? color : "#2a211a",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      {password && (
        <div style={{ fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace" }}>
          {label}
        </div>
      )}
    </div>
  );
}

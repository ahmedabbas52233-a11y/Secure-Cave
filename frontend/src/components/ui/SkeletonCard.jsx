export default function SkeletonCard() {
  return (
    <div style={{ background: "#130f0c", border: "1px solid #2a1f17", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
      <div className="skel" style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skel" style={{ width: "42%", height: 12, borderRadius: 4, marginBottom: 8 }} />
        <div className="skel" style={{ width: "62%", height: 10, borderRadius: 4 }} />
      </div>
      <div className="skel" style={{ width: 64, height: 20, borderRadius: 10 }} />
    </div>
  );
}

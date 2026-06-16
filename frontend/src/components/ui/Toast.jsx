import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

export default function Toast({ notif }) {
  if (!notif) return null;
  const map = {
    success: { icon: <CheckCircle size={14} />, color: "#22c55e" },
    warning: { icon: <AlertTriangle size={14} />, color: "#f97316" },
    error:   { icon: <AlertCircle  size={14} />, color: "#ef4444" },
  };
  const { icon, color } = map[notif.type] || map.success;
  return (
    <div className="toast-in" style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 10,
      background: "#1e1610", border: `1px solid ${color}33`,
      borderLeft: `3px solid ${color}`, borderRadius: 10,
      padding: "12px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      color, fontFamily: "'Syne', sans-serif", fontSize: 13, maxWidth: 340,
    }}>
      {icon}
      <span style={{ color: "#f5ede4" }}>{notif.msg}</span>
    </div>
  );
}

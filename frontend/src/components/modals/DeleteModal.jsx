import { Trash2, X, AlertTriangle } from "lucide-react";

export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2a0f0f", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Trash2 size={17} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 15, fontWeight: 700 }}>Delete Entry</div>
              <div style={{ color: "#7a6050", fontSize: 12, marginTop: 2 }}>Permanent — cannot be undone</div>
            </div>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#7a6050", display: "flex", padding: 4, borderRadius: 6, transition: "color 0.2s" }}>
            <X size={15} />
          </button>
        </div>

        {/* Warning */}
        <div style={{ background: "#1a0a0a", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: "#a89880", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            This secret will be permanently chiselled out of your cave. The encrypted data will be deleted from the server immediately.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
            Keep It
          </button>
          <button onClick={onConfirm} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "linear-gradient(135deg, #991b1b, #dc2626)", border: "none", color: "#fff", borderRadius: 8, padding: "10px 0", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, transition: "all 0.2s", boxShadow: "0 4px 14px rgba(220,38,38,0.3)" }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

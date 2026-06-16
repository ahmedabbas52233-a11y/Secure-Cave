import { Shield, Activity, Hash, Settings, Flame, LogOut } from "lucide-react";

const VIEWS = [
  { id: "vault",    label: "Vault",     icon: Shield   },
  { id: "health",   label: "Health",    icon: Activity },
  { id: "totp",     label: "2FA Codes", icon: Hash     },
  { id: "settings", label: "Settings",  icon: Settings },
];

export default function Sidebar({ activeView, setActiveView, vaultCount, onLock, userEmail }) {
  return (
    <div style={{ width: 220, flexShrink: 0, background: "#08070600", borderRight: "1px solid #1a1208", display: "flex", flexDirection: "column", padding: "18px 10px" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", marginBottom: 24 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "radial-gradient(circle, #1e1208 0%, #130f0c 100%)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Flame size={14} color="#f97316" />
        </div>
        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: "#f5ede4", fontSize: 13, letterSpacing: "0.06em" }}>SECURE CAVE</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveView(id)} className={`nav-item${activeView === id ? " active" : ""}`}>
            <Icon size={14} />
            {label}
            {id === "vault" && (
              <span style={{ marginLeft: "auto", background: activeView === id ? "rgba(249,115,22,0.12)" : "#130f0c", borderRadius: 10, padding: "1px 8px", fontSize: 10, color: activeView === id ? "#f97316" : "#4a3f35", border: "1px solid " + (activeView === id ? "rgba(249,115,22,0.2)" : "#1e1610") }}>
                {vaultCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User info + lock */}
      <div style={{ borderTop: "1px solid #1a1208", paddingTop: 12, marginTop: 8 }}>
        {userEmail && (
          <div style={{ padding: "6px 10px", marginBottom: 6 }}>
            <p style={{ fontSize: 10, color: "#4a3f35", fontFamily: "'JetBrains Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</p>
          </div>
        )}
        <button onClick={onLock} className="nav-item" style={{ color: "#ef4444", width: "100%" }}>
          <LogOut size={14} /> Lock & Sign Out
        </button>
      </div>
    </div>
  );
}

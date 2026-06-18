import { Shield, Activity, Hash, Settings, Flame, LogOut, Sun, Moon, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const VIEWS = [
  { id: "vault",    label: "Vault",     icon: Shield   },
  { id: "health",   label: "Health",    icon: Activity },
  { id: "totp",     label: "2FA Codes", icon: Hash     },
  { id: "settings", label: "Settings",  icon: Settings },
];

export default function Sidebar({ activeView, setActiveView, vaultCount, onLock, userEmail, isOpen, onClose }) {
  const { theme, toggle, C } = useTheme();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <div className={`sidebar${isOpen ? " open" : ""}`}>
        {/* Header row: logo + mobile close */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "radial-gradient(circle,#1e1208,#130f0c)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Flame size={14} color="#f97316" />
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: C.textBone, fontSize: 13, letterSpacing: "0.06em" }}>SECURE CAVE</span>
          </div>
          {/* Mobile close button */}
          <button onClick={onClose} className="icon-btn hamburger-btn" style={{ marginLeft: 4 }}>
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveView(id); onClose(); }}
              className={`nav-item${activeView === id ? " active" : ""}`}>
              <Icon size={14} />
              {label}
              {id === "vault" && (
                <span style={{ marginLeft: "auto", background: activeView === id ? "rgba(249,115,22,0.12)" : C.bgElevated, borderRadius: 10, padding: "1px 8px", fontSize: 10, color: activeView === id ? C.ember : C.textDark, border: `1px solid ${activeView === id ? "rgba(249,115,22,0.2)" : C.borderDim}` }}>
                  {vaultCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${C.borderDim}`, paddingTop: 12, marginTop: 8 }}>
          {/* Theme toggle */}
          <button onClick={toggle} className="nav-item" style={{ marginBottom: 4 }}>
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {/* User email */}
          {userEmail && (
            <div style={{ padding: "4px 14px", marginBottom: 4 }}>
              <p style={{ fontSize: 10, color: C.textDark, fontFamily: "'JetBrains Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userEmail}
              </p>
            </div>
          )}

          {/* Lock */}
          <button onClick={onLock} className="nav-item" style={{ color: "#ef4444", width: "100%" }}>
            <LogOut size={14} /> Lock & Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

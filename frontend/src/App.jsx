import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { deriveKey, decryptText } from "./utils/crypto";
import { useVault } from "./hooks/useVault";
import { useTOTP }  from "./hooks/useTOTP";

import AuthScreen   from "./components/AuthScreen";
import LockScreen   from "./components/LockScreen";
import Sidebar      from "./components/Sidebar";
import VaultView    from "./components/VaultView";
import HealthView   from "./components/HealthView";
import TOTPView     from "./components/TOTPView";
import SettingsView from "./components/SettingsView";

import EntryModal   from "./components/modals/EntryModal";
import DeleteModal  from "./components/modals/DeleteModal";
import Toast        from "./components/ui/Toast";

// ─── Loading Spinner ──────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#060504", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "2px solid #1e1610", borderTop: "2px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#4a3f35", fontFamily: "'Syne', sans-serif", fontSize: 12, letterSpacing: "0.1em" }}>ENTERING CAVE…</p>
    </div>
  );
}

// ─── Inner app (has access to AuthContext) ────────────────────────────
function InnerApp() {
  const { user, loading: authLoading, logout } = useAuth();

  // Master key + lock state
  const [masterKey,  setMasterKey]  = useState(null);
  const [unlocked,   setUnlocked]   = useState(false);
  const [activeView, setActiveView] = useState("vault");

  // Vault + TOTP hooks
  const vault = useVault(masterKey);
  const totp  = useTOTP(masterKey);

  // Modal state
  const [modal,     setModal]     = useState(null); // 'add'|'edit'|'delete'
  const [editEntry, setEditEntry] = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);
  const [form,      setForm]      = useState({ site: "", username: "", password: "", category: "Other" });

  // Import/export
  const [importError, setImportError] = useState("");

  // Toast
  const [notif,    setNotif]    = useState(null);
  const notifTimer = useRef(null);
  const showNotif = useCallback((msg, type = "success") => {
    if (notifTimer.current) clearTimeout(notifTimer.current);
    setNotif({ msg, type });
    notifTimer.current = setTimeout(() => setNotif(null), 3000);
  }, []);

  // ── Auth loading ─────────────────────────────────────────────
  if (authLoading) return <LoadingScreen />;

  // ── Not logged in → show auth screen ─────────────────────────
  if (!user) return <AuthScreen />;

  // ── Logged in but vault locked → show lock screen ─────────────
  if (!unlocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  // ── Unlock ────────────────────────────────────────────────────
  async function handleUnlock(masterPassword) {
    const key = await deriveKey(masterPassword);
    setMasterKey(key);
    setUnlocked(true);
    // loadVault/loadEntries don't use masterKey — they fetch raw ciphertext.
    // Key is used for decryption on demand. No setTimeout needed.
    await vault.loadVault();
    await totp.loadEntries();
  }

  const handleLock = () => {
    setUnlocked(false);
    setMasterKey(null);
    setActiveView("vault");
    setModal(null);
    logout();
  };

  // ── Vault CRUD ────────────────────────────────────────────────
  const openAdd = () => {
    setForm({ site: "", username: "", password: "", category: "Other" });
    setEditEntry(null);
    setModal("add");
  };

  const openEdit = async (entry) => {
    const pw = await vault.getDecrypted(entry);
    setForm({ site: entry.site, username: entry.username || "", password: pw, category: entry.category });
    setEditEntry(entry);
    setModal("edit");
  };

  const openEditById = async (id) => {
    const entry = vault.vault.find(e => (e._id || e.id) === id);
    if (entry) { await openEdit(entry); setActiveView("vault"); }
  };

  const openDelete = (id) => { setDeleteId(id); setModal("delete"); };

  const handleSave = async () => {
    try {
      if (modal === "add") {
        await vault.addEntry(form);
        showNotif("Secret carved into stone 🪨");
      } else {
        await vault.updateEntry(editEntry._id || editEntry.id, form);
        showNotif("Tablet updated 🗿");
      }
      setModal(null);
      setEditEntry(null);
    } catch (e) {
      showNotif(e.message, "error");
    }
  };

  const handleDelete = async () => {
    try {
      await vault.deleteEntry(deleteId);
      showNotif("Entry removed from cave", "warning");
    } catch (e) {
      showNotif(e.message, "error");
    }
    setModal(null);
    setDeleteId(null);
  };

  // ── CSV ───────────────────────────────────────────────────────
  const exportCSV = async () => {
    const rows = [];
    for (const e of vault.vault) {
      const id = e._id || e.id;
      const pw = vault.decryptedPws[id] || await decryptText(e.ciphertext, e.iv, masterKey);
      rows.push({ site: e.site, username: e.username, password: pw, category: e.category });
    }
    const csv = Papa.unparse(rows);
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: "secure-cave-vault.csv",
    });
    a.click();
    URL.revokeObjectURL(a.href);
    showNotif(`Exported ${rows.length} entries 📦`);
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError("");
    Papa.parse(file, {
      header: true,
      complete: async ({ data }) => {
        let count = 0;
        for (const row of data) {
          if (!row.site || !row.password) continue;
          try {
            await vault.addEntry({ site: row.site, username: row.username || "", password: row.password, category: row.category || "Other" });
            count++;
          } catch {}
        }
        showNotif(`Imported ${count} entries 📥`);
      },
      error: () => setImportError("Failed to parse CSV file"),
    });
  };

  // ── View metadata ─────────────────────────────────────────────
  const VIEW_TITLE = { vault: "Vault", health: "Health Map", totp: "2FA Codes", settings: "Settings" };
  const VIEW_SUB   = {
    vault:    `${vault.vault.length} secret${vault.vault.length !== 1 ? "s" : ""} stored`,
    health:   "Password safety analysis",
    totp:     "Time-based one-time codes",
    settings: "Import, export & security",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#060504" }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} vaultCount={vault.vault.length} onLock={handleLock} userEmail={user?.email} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "18px 28px 14px", borderBottom: "1px solid #1a1208", background: "#060504", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#f5ede4", fontSize: 17, fontWeight: 700, margin: 0 }}>{VIEW_TITLE[activeView]}</h2>
          <p style={{ color: "#4a3f35", fontSize: 11, marginTop: 3, fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em" }}>{VIEW_SUB[activeView]}</p>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 20 }}>
          {activeView === "vault" && (
            <VaultView
              vault={vault.vault}
              decryptedPws={vault.decryptedPws}
              visiblePws={vault.visiblePws}
              loading={vault.loading}
              onToggle={vault.toggleVisible}
              onCopy={async (entry) => {
                const pw = await vault.getDecrypted(entry);
                await navigator.clipboard.writeText(pw).catch(() => {});
                showNotif("Password copied 🔑");
              }}
              onEdit={openEdit}
              onDelete={openDelete}
              onAdd={openAdd}
            />
          )}
          {activeView === "health" && (
            <HealthView vault={vault.vault} decryptedPws={vault.decryptedPws} onEditById={openEditById} />
          )}
          {activeView === "totp" && (
            <TOTPView
              entries={totp.entries}
              codes={totp.codes}
              times={totp.times}
              onAdd={totp.addEntry}
              onDelete={async (id) => { await totp.deleteEntry(id); showNotif("2FA entry removed", "warning"); }}
            />
          )}
          {activeView === "settings" && (
            <SettingsView onExport={exportCSV} onImport={importCSV} importError={importError} vaultCount={vault.vault.length} />
          )}
        </div>
      </div>

      {(modal === "add" || modal === "edit") && (
        <EntryModal mode={modal} form={form} setForm={setForm} onSave={handleSave} onCancel={() => { setModal(null); setEditEntry(null); }} />
      )}
      {modal === "delete" && (
        <DeleteModal onConfirm={handleDelete} onCancel={() => { setModal(null); setDeleteId(null); }} />
      )}
      <Toast notif={notif} />
    </div>
  );
}

// ─── Root App wraps with AuthProvider ────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

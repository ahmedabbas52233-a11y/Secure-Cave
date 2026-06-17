import { useState, useCallback } from "react";
import { encryptText, decryptText } from "../utils/crypto";
import { useAuth } from "../context/AuthContext";

/**
 * Manages vault CRUD — fetches/creates/updates/deletes entries
 * via the backend API, with client-side encryption.
 */
export function useVault(masterKey) {
  const { apiFetch } = useAuth();
  const [vault, setVault]             = useState([]);
  const [decryptedPws, setDecryptedPws] = useState({}); // id → plaintext
  const [visiblePws, setVisiblePws]   = useState({});
  const [loading, setLoading]         = useState(false);

    // BUG FIX: paths had vault prefix which double-prefixed since apiFetch
  // already prepends the API base ("/api"). Corrected to "/vault".
  const loadVault = useCallback(async () => {
    setLoading(true);
    try {
      const { entries } = await apiFetch("/vault");
      setVault(entries);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  const getDecrypted = useCallback(async (entry) => {
    const id = entry._id || entry.id;
    if (decryptedPws[id]) return decryptedPws[id];
    const pw = await decryptText(entry.ciphertext, entry.iv, masterKey);
    setDecryptedPws(d => ({ ...d, [id]: pw }));
    return pw;
  }, [decryptedPws, masterKey]);

  const addEntry = useCallback(async ({ site, username, password, category }) => {
    const { ciphertext, iv } = await encryptText(password, masterKey);
    const { entry } = await apiFetch("/vault", {
      method: "POST",
      body: JSON.stringify({ site, username, ciphertext, iv, category }),
    });
    setVault(v => [entry, ...v]);
    setDecryptedPws(d => ({ ...d, [entry._id]: password }));
    return entry;
  }, [masterKey, apiFetch]);

  const updateEntry = useCallback(async (id, { site, username, password, category }) => {
    const { ciphertext, iv } = await encryptText(password, masterKey);
    const { entry } = await apiFetch(`/vault/${id}`, {
      method: "PUT",
      body: JSON.stringify({ site, username, ciphertext, iv, category }),
    });
    setVault(v => v.map(e => e._id === id ? entry : e));
    setDecryptedPws(d => ({ ...d, [id]: password }));
    return entry;
  }, [masterKey, apiFetch]);

  const deleteEntry = useCallback(async (id) => {
    await apiFetch(`/vault/${id}`, { method: "DELETE" });
    setVault(v => v.filter(e => e._id !== id));
    setDecryptedPws(d => { const n = { ...d }; delete n[id]; return n; });
    setVisiblePws(vis => { const n = { ...vis }; delete n[id]; return n; });
  }, [apiFetch]);

  const toggleVisible = useCallback(async (entry) => {
    const id = entry._id || entry.id;
    if (!visiblePws[id]) await getDecrypted(entry);
    setVisiblePws(v => ({ ...v, [id]: !v[id] }));
  }, [visiblePws, getDecrypted]);

  return {
    vault, decryptedPws, visiblePws, loading,
    loadVault, getDecrypted, addEntry, updateEntry, deleteEntry, toggleVisible,
  };
}

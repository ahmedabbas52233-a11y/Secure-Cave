import { useState, useEffect, useCallback } from "react";
import { getTOTP, timeLeft } from "../utils/totp";
import { encryptText, decryptText } from "../utils/crypto";
import { useAuth } from "../context/AuthContext";

/**
 * Manages TOTP entries with live code generation.
 */
export function useTOTP(masterKey) {
  const { apiFetch } = useAuth();
  const [entries, setEntries]   = useState([]);
  const [codes, setCodes]       = useState({});
  const [times, setTimes]       = useState({});
  const [decSecrets, setDecSecrets] = useState({}); // id → plaintext secret

  const loadEntries = useCallback(async () => {
    const { entries: e } = await apiFetch("/totp");
    setEntries(e);
  }, [apiFetch]);

  // Decrypt secret for a TOTP entry
  const getSecret = useCallback(async (entry) => {
    if (decSecrets[entry._id]) return decSecrets[entry._id];
    const secret = await decryptText(entry.encryptedSecret, entry.secretIv, masterKey);
    setDecSecrets(d => ({ ...d, [entry._id]: secret }));
    return secret;
  }, [decSecrets, masterKey]);

  // Refresh all TOTP codes every second
  useEffect(() => {
    if (entries.length === 0) return;
    const update = async () => {
      const c = {}, t = {};
      for (const entry of entries) {
        try {
          const secret = await getSecret(entry);
          c[entry._id] = await getTOTP(secret);
          t[entry._id] = timeLeft();
        } catch {
          c[entry._id] = "------";
          t[entry._id] = 0;
        }
      }
      setCodes(c); setTimes(t);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [entries, getSecret]);

  const addEntry = useCallback(async (name, secret) => {
    const { ciphertext: encryptedSecret, iv: secretIv } = await encryptText(secret, masterKey);
    // rename iv to secretIv
    const { entry } = await apiFetch("/totp", {
      method: "POST",
      body: JSON.stringify({ name, encryptedSecret, secretIv, issuer }),
    });
    setEntries(e => [entry, ...e]);
    setDecSecrets(d => ({ ...d, [entry._id]: secret }));
  }, [masterKey, apiFetch]);

  const deleteEntry = useCallback(async (id) => {
    await apiFetch(`/totp/${id}`, { method: "DELETE" });
    setEntries(e => e.filter(t => t._id !== id));
    setDecSecrets(d => { const n = { ...d }; delete n[id]; return n; });
  }, [apiFetch]);

  return { entries, codes, times, loadEntries, addEntry, deleteEntry };
}

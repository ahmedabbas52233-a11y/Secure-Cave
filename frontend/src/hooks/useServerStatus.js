import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Pings /api/health on mount to detect the most common setup failure:
 * the backend isn't reachable at all (wrong port, not started, wrong
 * VITE_API_URL, broken proxy). Surfacing this BEFORE the user attempts
 * to log in turns a cryptic post-submit error into an immediate,
 * actionable message.
 *
 * Returns: "checking" | "online" | "offline"
 */
export function useServerStatus() {
  const { apiBase } = useAuth();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch(`${apiBase}/health`, { signal: controller.signal })
      .then(res => {
        if (cancelled) return;
        setStatus(res.ok ? "online" : "offline");
      })
      .catch(() => {
        if (!cancelled) setStatus("offline");
      })
      .finally(() => clearTimeout(timeout));

    return () => { cancelled = true; controller.abort(); };
  }, [apiBase]);

  return status;
}

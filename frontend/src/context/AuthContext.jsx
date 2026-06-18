import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const AuthContext = createContext(null);

// FIX: strip any trailing slash from the configured base URL. Without
// this, a frontend/.env value like "https://host/api/" (trailing slash —
// an extremely common copy-paste mistake from a deployed backend URL)
// combined with a path like "/auth/login" produces "https://host/api//auth/login".
// That double slash does not match any Express route and silently 404s
// with "Route not found", which is exactly what was being reported.
const RAW_API = import.meta.env.VITE_API_URL || "/api";
const API = RAW_API.replace(/\/+$/, "");

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem("sc_token"));
  const [user,  setUser]      = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef(token);
  useEffect(() => { tokenRef.current = token; }, [token]);

  const apiFetch = useCallback(async (path, options = {}) => {
    // FIX: ensure exactly one slash between base and path regardless of
    // whether the caller's path starts with "/" or not.
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${API}${cleanPath}`;

    let res;
    try {
      res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}),
          ...options.headers,
        },
      });
    } catch (networkErr) {
      // FIX: a thrown fetch (TypeError: Failed to fetch) means the request
      // never reached any server — distinguish this from a 404/401 response
      // so the UI can show "can't reach the server" instead of a generic
      // "Request failed" that looks identical to a credentials error.
      throw new Error(
        `Could not reach the server at ${API}. Is the backend running and is VITE_API_URL set correctly?`
      );
    }

    let data;
    try {
      data = await res.json();
    } catch {
      // Response wasn't JSON at all (e.g. an HTML error page from a
      // misconfigured proxy/host) — still surface something useful.
      throw new Error(`Server returned a non-JSON response (status ${res.status}) for ${url}`);
    }

    if (!res.ok) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        throw new Error(data.errors[0].msg || "Validation failed");
      }
      // FIX: the hardened backend 404 handler now includes method/path/hint —
      // surface that extra detail when present instead of the bare message.
      if (data.error === "Route not found" && data.path) {
        throw new Error(`Route not found: ${data.method} ${data.path}. ${data.hint || ""}`.trim());
      }
      throw new Error(data.error || "Request failed");
    }
    return data;
  }, []);

  // ── Validate stored token on initial load ─────────────────────────
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch("/auth/me")
      .then(({ user: u }) => setUser(u))
      .catch(() => {
        localStorage.removeItem("sc_token");
        tokenRef.current = null;
        setToken(null);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { token: t, user: u } = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("sc_token", t);
    tokenRef.current = t;
    setToken(t);
    setUser(u);
  };

  const register = async (email, password) => {
    const { token: t, user: u } = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("sc_token", t);
    tokenRef.current = t;
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("sc_token");
    tokenRef.current = null;
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, apiFetch, apiBase: API }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

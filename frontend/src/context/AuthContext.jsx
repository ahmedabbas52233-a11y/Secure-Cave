import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "/api";

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem("sc_token"));
  const [user,  setUser]      = useState(null);
  const [loading, setLoading] = useState(true);
  // Keep a ref so apiFetch always uses the freshest token without re-creating
  // the function every time token changes (prevents hook-dep infinite loops).
  const tokenRef = useRef(token);
  useEffect(() => { tokenRef.current = token; }, [token]);

  const apiFetch = useCallback(async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}),
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      // BUG FIX: express-validator returns { errors: [{msg, path, ...}] }
      // not { error: "string" }. Handle both shapes.
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        throw new Error(data.errors[0].msg || "Validation failed");
      }
      throw new Error(data.error || "Request failed");
    }
    return data;
  }, []); // stable ref — never needs to change

  // ── Validate stored token on initial load ─────────────────────────
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch("/auth/me")
      .then(({ user: u }) => setUser(u))
      .catch(() => {
        // Token invalid/expired — clear it
        localStorage.removeItem("sc_token");
        tokenRef.current = null;
        setToken(null);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount only

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
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

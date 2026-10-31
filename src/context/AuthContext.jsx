import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, TOKEN_KEY } from "../api.js";

// Context = a shared box. Any component can ask "who is logged in?"
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check an existing token

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // When the app opens: if a token is saved, ask the backend who it belongs to
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  // api.js fires this event when the backend says 401 (expired/invalid token)
  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const saveSession = (res) => {
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
  };

  const login = async (email, password) =>
    saveSession(await api.post("/auth/login", { email, password }));

  const register = async (name, email, password) =>
    saveSession(await api.post("/auth/register", { name, email, password }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

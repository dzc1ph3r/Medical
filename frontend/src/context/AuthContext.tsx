import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { me as apiMe } from "../api/auth.api";

export type Role = "DOCTOR" | "PATIENT" | "ADMIN";

export type User = {
  _id: string; // Mongo returns _id
  name: string;
  email: string;
  role: Role;
  specialty?: string;
  consultationFee?: number;
  gender?: "MALE" | "FEMALE";
  city?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loadingMe: boolean;

  setToken: (t: string | null) => void;
  refreshMe: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [loadingMe, setLoadingMe] = useState<boolean>(true);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setLoadingMe(false);
  };

  const refreshMe = async () => {
    if (!token) {
      setUser(null);
      setLoadingMe(false);
      return;
    }

    setLoadingMe(true);
    try {
      const res = await apiMe(token);
      setUser(res.data);
    } catch (e) {
      // token invalide/expiré => on clean
      setToken(null);
      setUser(null);
    } finally {
      setLoadingMe(false);
    }
  };

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, loadingMe, setToken, refreshMe, logout }),
    [token, user, loadingMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

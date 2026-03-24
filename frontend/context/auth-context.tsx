"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken as storeToken, clearToken, isTokenValid } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (isTokenValid()) {
      setToken(getToken());
    } else {
      clearToken();
      setToken(null);
    }
  }, []);

  const login = useCallback((newToken: string) => {
    storeToken(newToken);
    setToken(newToken);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    router.replace("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

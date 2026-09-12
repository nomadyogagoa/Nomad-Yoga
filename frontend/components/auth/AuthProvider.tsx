"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadCurrentUser, login as loginRequest, logout as logoutRequest, type LoginInput, type MemberUser } from "@/lib/auth-api";
import { refreshAccessToken, setAccessToken } from "@/lib/api-client";

type AuthContextValue = {
  user: MemberUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  loadCurrentUser: () => Promise<MemberUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (): Promise<MemberUser | null> => {
    try {
      const currentUser = await loadCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const token = await refreshAccessToken();
    if (!token) {
      setUser(null);
      return false;
    }
    return Boolean(await loadUser());
  }, [loadUser]);

  useEffect(() => {
    void refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  const login = useCallback(async (input: LoginInput) => {
    await loginRequest(input);
    const currentUser = await loadUser();
    if (!currentUser) throw new Error("We could not load your member profile.");
  }, [loadUser]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isLoading, login, logout, refreshSession, loadCurrentUser: loadUser }), [isLoading, loadUser, login, logout, refreshSession, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}

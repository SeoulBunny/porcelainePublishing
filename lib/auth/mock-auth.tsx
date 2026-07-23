"use client";

// Mock authentication only — brief.md is explicit that signup/login are UI
// mockups with no persistent account creation or real session. This context
// exists so the nav's authenticated-state affordances (avatar dropdown, the
// admin link) are genuinely demonstrable from the sign-up/log-in forms,
// without pretending there's a backend behind them. State lives in
// localStorage purely so a refresh doesn't silently reset the demo.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MockUser = {
  name: string;
  email: string;
  role: "reader" | "admin";
};

interface MockAuthValue {
  user: MockUser | null;
  // False only for the one tick before localStorage is read on mount — lets
  // gated routes (e.g. /admin) wait for real state instead of redirecting
  // signed-in users off a refresh.
  isHydrated: boolean;
  signIn: (email: string, opts?: { asAdmin?: boolean }) => void;
  signOut: () => void;
}

const STORAGE_KEY = "porcelain.mock-auth";

const MockAuthContext = createContext<MockAuthValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage — falls back to guest state
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const signIn = useCallback((email: string, opts?: { asAdmin?: boolean }) => {
    const name = email.split("@")[0]?.replace(/[._-]/g, " ") || "Reader";
    const next: MockUser = {
      name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: opts?.asAdmin ? "admin" : "reader",
    };
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — session still works for this tab's lifetime
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }, []);

  const value = useMemo(
    () => ({ user, isHydrated, signIn, signOut }),
    [user, isHydrated, signIn, signOut]
  );

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth(): MockAuthValue {
  const ctx = useContext(MockAuthContext);
  if (!ctx) throw new Error("useMockAuth must be used within MockAuthProvider");
  return ctx;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  recover as apiRecover,
  getCustomer,
  type Customer,
  type CustomerToken,
  type UserError,
} from "@/lib/commerce/customer";

const STORAGE_KEY = "sori-customer-v1";

type AuthResult = { ok: boolean; errors?: UserError[] };

type AuthContextValue = {
  customer: Customer | null;
  token: string | null;
  ready: boolean; // hydratation terminée
  loading: boolean; // requête en cours
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptsMarketing?: boolean;
  }) => Promise<AuthResult>;
  recover: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): CustomerToken | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const t = JSON.parse(raw) as CustomerToken;
    if (t.expiresAt && new Date(t.expiresAt).getTime() < Date.now()) return null;
    return t;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const persist = useCallback((t: CustomerToken | null) => {
    try {
      if (t) localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const loadCustomer = useCallback(async (accessToken: string) => {
    try {
      const c = await getCustomer(accessToken);
      setCustomer(c);
      if (!c) {
        /* token invalide/expiré côté Shopify */
        setToken(null);
        persist(null);
      }
    } catch {
      setCustomer(null);
    }
  }, [persist]);

  /* Hydratation au montage. */
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setToken(stored.accessToken);
      loadCustomer(stored.accessToken).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [loadCustomer]);

  const login = useCallback<AuthContextValue["login"]>(
    async (email, password) => {
      setLoading(true);
      try {
        const { token: t, errors } = await apiLogin(email, password);
        if (t) {
          setToken(t.accessToken);
          persist(t);
          await loadCustomer(t.accessToken);
          return { ok: true };
        }
        return { ok: false, errors };
      } finally {
        setLoading(false);
      }
    },
    [persist, loadCustomer],
  );

  const register = useCallback<AuthContextValue["register"]>(
    async (input) => {
      setLoading(true);
      try {
        const { token: t, errors } = await apiRegister(input);
        if (t) {
          setToken(t.accessToken);
          persist(t);
          await loadCustomer(t.accessToken);
          return { ok: true };
        }
        return { ok: false, errors };
      } finally {
        setLoading(false);
      }
    },
    [persist, loadCustomer],
  );

  const recover = useCallback<AuthContextValue["recover"]>(async (email) => {
    setLoading(true);
    try {
      const { errors } = await apiRecover(email);
      return { ok: errors.length === 0, errors };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const current = token;
    setToken(null);
    setCustomer(null);
    persist(null);
    if (current) await apiLogout(current);
  }, [token, persist]);

  const refresh = useCallback(async () => {
    if (token) await loadCustomer(token);
  }, [token, loadCustomer]);

  const value = useMemo<AuthContextValue>(
    () => ({ customer, token, ready, loading, login, register, recover, logout, refresh }),
    [customer, token, ready, loading, login, register, recover, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé sous <AuthProvider>");
  return ctx;
}

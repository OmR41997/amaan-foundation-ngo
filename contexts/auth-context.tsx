"use client";

import { fetchProfile, loginAdmin } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import {
  clearAuth,
  getStoredUser,
  getToken,
  setAuth,
} from "@/lib/auth/storage";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser<AuthUser>());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const token = getToken();
    if (!token) {
      queueMicrotask(() => {
        if (!ignore) {
          setUser(null);
          setIsLoading(false);
        }
      });
      return;
    }

    fetchProfile()
      .then((res) => {
        if (!ignore && res.data) {
          setUser(res.data);
        }
      })
      .catch(() => {
        if (!ignore) {
          clearAuth();
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await loginAdmin(email, password);
        if (!res.data?.accessToken) {
          throw new Error("Invalid login response");
        }
        setAuth(res.data.accessToken, res.data.user);
        setUser(res.data.user);
        router.push("/admin/member-requests");
      } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new Error("Login failed");
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && !!getToken(),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

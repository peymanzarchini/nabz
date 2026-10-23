/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import api from "../api";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/modules/auth/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    let authenticated = false;

    try {
      const { data } = await api.get("/auth/profile");
      if (data.success && data.body) {
        setUser(data.body);
        authenticated = true;
      }
    } catch (error) {
      console.log(error);
      try {
        await api.post("/auth/refresh");
        const { data: retryData } = await api.get("/auth/profile");
        if (retryData.success && retryData.body) {
          setUser(retryData.body);
          authenticated = true;
        }
      } catch (retryError) {
        console.log(retryError);
        setUser(null);
      }
    } finally {
      setLoading(false);

      if (!authenticated && typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/dashboard")) {
          router.replace("/login");
        }
      }
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/dashboard")) {
          router.replace("/login");
        }
      }
    };

    window.addEventListener("app-logout", handleForceLogout);
    return () => window.removeEventListener("app-logout", handleForceLogout);
  }, [router]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        document.cookie =
          "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
      }
    }
  };

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

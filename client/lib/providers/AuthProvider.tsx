"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../api";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/modules/auth/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        if (data.success && data.body) {
          setUser(data.body);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);

      if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
        router.push("/login");
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
        window.location.href = "/";
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

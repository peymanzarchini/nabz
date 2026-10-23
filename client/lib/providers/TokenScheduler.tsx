"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import api from "../api";

const TokenScheduler = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    const checkAndRefreshToken = async () => {
      try {
        await api.get("/auth/profile");
      } catch (error) {
        console.log(error);
      }
    };

    const interval = setInterval(checkAndRefreshToken, 60000);

    return () => clearInterval(interval);
  }, [user, loading]);

  return null;
};

export default TokenScheduler;

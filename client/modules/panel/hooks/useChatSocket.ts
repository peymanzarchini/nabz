/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/lib/providers/AuthProvider";

export const useChatSocket = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("🟢 Connected to chat server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("🔴 Disconnected from chat server");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return { socket, isConnected };
};

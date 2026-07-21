"use client";

import { useChatSocket } from "@/modules/panel/hooks/useChat";
import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useChatSocket();

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);

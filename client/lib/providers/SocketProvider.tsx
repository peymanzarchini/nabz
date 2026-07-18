"use client";

import { createContext, useContext } from "react";
import { useChatSocket } from "@/modules/panel/hooks/useChatSocket";
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useChatSocket();

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);

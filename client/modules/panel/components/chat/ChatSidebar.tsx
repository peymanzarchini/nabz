"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { ChatSidebarProps } from "@/modules/panel/types";

const ChatSidebar = ({
  conversations,
  loadingConvs,
  activeConvId,
  setActiveConvId,
  userId,
}: ChatSidebarProps) => {
  return (
    <div
      className={`${activeConvId ? "hidden md:flex" : "flex"} w-full md:w-80 border-l border-zinc-100 dark:border-zinc-800 flex-col`}
    >
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-white">پیام‌ها</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loadingConvs ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : conversations && conversations.length > 0 ? (
          conversations.map((conv) => {
            const convOtherUser = conv.buyer.id === userId ? conv.seller : conv.buyer;
            const isOnline = !convOtherUser.lastSeen;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${activeConvId === conv.id ? "bg-violet-50 dark:bg-violet-500/10" : ""}`}
              >
                <div className="flex items-center gap-3 relative">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold overflow-hidden">
                      {convOtherUser.avatar ? (
                        <Image
                          src={`http://localhost:5000${convOtherUser.avatar}`}
                          alt="avatar"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        convOtherUser.firstName.charAt(0)
                      )}
                    </div>
                    <span
                      className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${isOnline ? "bg-blue-500" : "bg-zinc-400"}`}
                    ></span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm text-zinc-800 dark:text-zinc-100 truncate">
                      {convOtherUser.firstName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{conv.listing.title}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-sm text-zinc-500">هنوز مکالمه‌ای ندارید.</div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

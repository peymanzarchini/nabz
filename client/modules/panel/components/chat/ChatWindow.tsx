"use client";

import Image from "next/image";
import { Loader2, Send, MessageSquare, CheckCheck, Smile, ArrowRight } from "lucide-react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatWindowProps } from "@/modules/panel/types";
import { formatLastSeen } from "../../utils";

const ChatWindow = ({
  activeConvId,
  otherUser,
  loadingMsgs,
  liveMessages,
  isTyping,
  showEmoji,
  setShowEmoji,
  messageText,
  handleInputChange,
  handleEmojiClick,
  handleSend,
  sendMessageMutation,
  setActiveConvId,
  userId,
  messagesEndRef,
}: ChatWindowProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className={`${activeConvId ? "flex" : "hidden md:flex"} flex-1 flex-col bg-background`}>
      {!activeConvId || !otherUser ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-bold text-foreground">یک مکالمه را انتخاب کنید</p>
          <p className="text-sm text-muted-foreground">
            برای شروع گفتگو، روی یکی از مکالمات سمت راست کلیک کنید.
          </p>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
            <button
              onClick={() => setActiveConvId(null)}
              className="md:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold overflow-hidden">
                {otherUser.avatar ? (
                  <Image
                    src={`http://localhost:5000${otherUser.avatar}`}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  otherUser.firstName.charAt(0)
                )}
              </div>
              <span
                className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-card ${!otherUser.lastSeen ? "bg-emerald-500" : "bg-muted-foreground"}`}
              ></span>
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">
                {otherUser.firstName} {otherUser.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {!otherUser.lastSeen ? (
                  <span className="text-emerald-500">آنلاین</span>
                ) : (
                  `آخرین بازدید: ${formatLastSeen(otherUser.lastSeen)}`
                )}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {loadingMsgs ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              liveMessages.map((msg) => (
                <div
                  key={msg.id || msg.createdAt}
                  className={`flex ${msg.senderId === userId ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === userId ? "bg-primary text-primary-foreground rounded-bl-none" : "bg-card border border-border text-foreground rounded-br-none"}`}
                  >
                    <p className="text-sm leading-6 break-all whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p
                        className={`text-[10px] ${msg.senderId === userId ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {msg.senderId === userId && (
                        <CheckCheck
                          className={`h-3.5 w-3.5 ${msg.isRead ? "text-primary-foreground/80" : "text-primary-foreground/50"}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-end">
                <div className="bg-card border border-border text-muted-foreground text-sm p-3 rounded-lg rounded-br-none">
                  در حال نوشتن...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="p-4 border-t border-border flex items-center gap-2 relative bg-card"
          >
            {showEmoji && (
              <div className="absolute bottom-16 right-4 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={resolvedTheme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                />
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Smile className="h-6 w-6" />
            </Button>
            <Input
              value={messageText}
              onChange={handleInputChange}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 bg-muted/40 border-input rounded-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={sendMessageMutation.isPending}
              className="bg-primary text-primary-foreground h-11 w-11 rounded-sm cursor-pointer"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow;

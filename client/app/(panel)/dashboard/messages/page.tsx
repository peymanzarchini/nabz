"use client";

import ChatSidebar from "@/modules/panel/components/chat/ChatSidebar";
import ChatWindow from "@/modules/panel/components/chat/ChatWindow";
import { useChatRoom } from "@/modules/panel/hooks/useChat";

const MessagesPage = () => {
  const chat = useChatRoom();

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
      <ChatSidebar
        conversations={chat.conversations}
        loadingConvs={chat.loadingConvs || false}
        activeConvId={chat.activeConvId}
        setActiveConvId={chat.setActiveConvId}
        userId={chat.user?.id}
      />
      <ChatWindow
        activeConvId={chat.activeConvId}
        otherUser={chat.otherUser}
        loadingMsgs={chat.loadingMsgs || false}
        liveMessages={chat.liveMessages}
        isTyping={chat.isTyping}
        showEmoji={chat.showEmoji}
        setShowEmoji={chat.setShowEmoji}
        messageText={chat.messageText}
        handleInputChange={chat.handleInputChange}
        handleEmojiClick={chat.handleEmojiClick}
        handleSend={chat.handleSend}
        sendMessageMutation={chat.sendMessageMutation}
        setActiveConvId={chat.setActiveConvId}
        userId={chat.user?.id}
        messagesEndRef={chat.messagesEndRef}
      />
    </div>
  );
};

export default MessagesPage;

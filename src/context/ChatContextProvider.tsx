"use client";
import { ReactNode, useState, useEffect, useCallback } from "react";
import ChatContext, { Chat } from "./Chatcontext";

interface ChatContextProviderProps {
  children: ReactNode;
}

function ChatContextProvider({ children }: ChatContextProviderProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to load conversations from API
  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/conversation');
      const { conversations } = await response.json();
      setChats(conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to add or update a chat in the list
  const addOrUpdateChat = useCallback((newChat: Chat) => {
    setChats((prevChats) => {
      const existingIndex = prevChats.findIndex(
        (chat) => chat.sessionId === newChat.sessionId
      );

      if (existingIndex !== -1) {
        // Update existing chat (move to top and update title/date)
        const updatedChats = [...prevChats];
        updatedChats[existingIndex] = newChat;
        // Move to top
        const [updated] = updatedChats.splice(existingIndex, 1);
        return [updated, ...updatedChats];
      } else {
        // Add new chat at the top
        return [newChat, ...prevChats];
      }
    });
  }, []);

  // Function to refresh chats manually
  const refreshChats = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  // Load conversations once when provider mounts
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <ChatContext.Provider 
      value={{ 
        chats, 
        setChats, 
        loading, 
        addOrUpdateChat,
        refreshChats 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContextProvider;
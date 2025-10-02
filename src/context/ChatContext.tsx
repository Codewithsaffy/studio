'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { Conversation, Message } from '@/types';

const HISTORY_KEY = 'grok_chat_history';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isSending: boolean;
  loadConversation: (id: string) => void;
  startNewConversation: () => void;
  addMessage: (message: Message) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType>({
  conversations: [],
  activeConversation: null,
  isSending: false,
  loadConversation: () => {},
  startNewConversation: () => {},
  addMessage: async () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        const parsedHistory: Conversation[] = JSON.parse(storedHistory);
        // Sort by date to ensure newest is first
        parsedHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setConversations(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    }
  }, []);

  const saveConversations = (updatedConversations: Conversation[]) => {
    try {
      // Ensure newest is always first
      updatedConversations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setConversations(updatedConversations);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedConversations));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  };

  const addMessage = async (message: Message) => {
    setIsSending(message.role === 'user');
    let updatedConversations = [...conversations];
    let targetConversationId = activeConversationId;

    if (!targetConversationId) {
      // Create a new conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: message.content.split(' ').slice(0, 5).join(' '),
        createdAt: new Date().toISOString(),
        messages: [message],
      };
      updatedConversations.unshift(newConversation); // Add to the beginning
      targetConversationId = newConversation.id;
      setActiveConversationId(targetConversationId);
    } else {
      // Find the existing conversation and add the message
      const conversationIndex = updatedConversations.findIndex(c => c.id === targetConversationId);
      if (conversationIndex !== -1) {
        const updatedConversation = {
          ...updatedConversations[conversationIndex],
          messages: [...updatedConversations[conversationIndex].messages, message],
        };
        // Move the updated conversation to the top
        updatedConversations.splice(conversationIndex, 1);
        updatedConversations.unshift(updatedConversation);
      }
    }
    
    saveConversations(updatedConversations);
    if (message.role === 'user') {
      setIsSending(false);
    }
  };

  const loadConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        isSending,
        loadConversation,
        startNewConversation,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

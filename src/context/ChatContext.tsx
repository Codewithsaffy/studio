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
  addMessage: (message: Message | Message[]) => Promise<void>;
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
        parsedHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setConversations(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    }
  }, []);

  const saveConversations = (updatedConversations: Conversation[]) => {
    try {
      updatedConversations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setConversations(updatedConversations);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedConversations));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  };

  const addMessage = async (messagesToAdd: Message | Message[]) => {
    const messages = Array.isArray(messagesToAdd) ? messagesToAdd : [messagesToAdd];
    if (messages.length === 0) return;
  
    setConversations(currentConversations => {
      let conversationIndex = -1;
      if (activeConversationId) {
        conversationIndex = currentConversations.findIndex(c => c.id === activeConversationId);
      }
  
      let updatedConversations = [...currentConversations];
  
      if (conversationIndex !== -1) {
        const updatedConversation = {
          ...updatedConversations[conversationIndex],
          messages: [...updatedConversations[conversationIndex].messages, ...messages],
        };
        updatedConversations.splice(conversationIndex, 1);
        updatedConversations.unshift(updatedConversation);
      } else {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: messages[0].content.split(' ').slice(0, 5).join(' '),
          createdAt: new Date().toISOString(),
          messages: messages,
        };
        updatedConversations.unshift(newConversation);
        // This was the missing piece: set the new conversation as active immediately.
        setActiveConversationId(newConversation.id);
      }
  
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedConversations));
      } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
      }
  
      return updatedConversations;
    });
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

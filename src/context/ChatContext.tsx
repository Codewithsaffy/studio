
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

  const saveToLocalStorage = (data: Conversation[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  };

  const addMessage = useCallback(async (messagesToAdd: Message | Message[]) => {
    const messages = Array.isArray(messagesToAdd) ? messagesToAdd : [messagesToAdd];
    if (messages.length === 0) return;

    if (activeConversationId) {
      // Update existing conversation
      const updatedConversations = conversations.map(convo => {
        if (convo.id === activeConversationId) {
          return {
            ...convo,
            messages: [...convo.messages, ...messages],
          };
        }
        return convo;
      });
      // Move updated conversation to the top
      const currentConvoIndex = updatedConversations.findIndex(c => c.id === activeConversationId);
      if (currentConvoIndex > -1) {
        const [currentConvo] = updatedConversations.splice(currentConvoIndex, 1);
        updatedConversations.unshift(currentConvo);
      }
      setConversations(updatedConversations);
      saveToLocalStorage(updatedConversations);
    } else {
      // Create a new conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: messages[0].content.split(' ').slice(0, 5).join(' '),
        createdAt: new Date().toISOString(),
        messages: messages,
      };
      
      const updatedConversations = [newConversation, ...conversations];
      setConversations(updatedConversations);
      setActiveConversationId(newConversation.id); // This is the key change
      saveToLocalStorage(updatedConversations);
    }
  }, [activeConversationId, conversations]);


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

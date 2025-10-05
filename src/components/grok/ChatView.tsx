"use client";

import { useContext, useState, useEffect, useRef } from "react";
import type { Message } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ChatContext } from "@/context/ChatContext";

import { PromptInput } from "@/components/grok/PromptInput";
import { ChatLog } from "@/components/grok/ChatLog";
import { Button } from "@/components/ui/button";
import { Share2, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatView() {
  const { activeConversation, addMessage, isSending, startNewConversation } =
    useContext(ChatContext);
  const { toast } = useToast();
  const [isThinking, setIsThinking] = useState(false);
  const isChatActive = activeConversation !== null;

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsThinking(true);

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: prompt,
      };

      // This is a mock response, replace with actual AI call
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a simulated response to: "${prompt}"`,
      };

      // Add messages immediately to create conversation if needed
      await addMessage([userMessage, aiMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your message.",
      });
    } finally {
      setIsThinking(false);
    }
  };

  const quickActions = [
    { text: "Find Venues", icon: "🏢" },
    { text: "Compare Photographers", icon: "📸" },
    { text: "Get Catering Quotes", icon: "🍽️" },
    { text: "Create a Moodboard", icon: "🎨" },
  ];

  return (
    <div className="relative flex flex-col h-screen w-full">
      {/* Header Actions - Only show when chat is active */}
      {isChatActive && (
        <header className="flex items-center justify-end gap-2 px-4 py-3 border-b bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={startNewConversation}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isChatActive && activeConversation ? (
          // Active Chat View
          <div className="w-full h-full">
            <div className="max-w-3xl mx-auto px-4 py-6">
              <ChatLog
                messages={activeConversation.messages}
                isSending={isSending}
              />
            </div>
          </div>
        ) : (
          // Welcome Screen - Centered
          <div className="flex items-center justify-center min-h-full p-4">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-8 py-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Your Dream Event Assistant
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                  I'm here to help you plan the perfect event. Ask me anything
                  about venues, vendors, or planning tips.
                </p>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors"
                    onClick={() => handleSubmit(action.text)}
                    disabled={isSending}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm font-medium">{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="border-t bg-background">
        <div className="w-full max-w-3xl mx-auto px-4 py-4">
          <PromptInput
            onSubmit={handleSubmit}
            isSending={isSending}
            isChatActive={isChatActive}
          />
          {isThinking && !isSending && (
            <div className="text-xs text-center text-muted-foreground mt-2">
              Thinking...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

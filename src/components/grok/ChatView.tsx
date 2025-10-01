'use client';

import { useState } from 'react';
import type { Message } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { interpretUserPrompt } from '@/ai/flows/interpret-user-prompt';
import { generateAiResponse } from '@/ai/flows/generate-ai-response';

import { PromptInput } from '@/components/grok/PromptInput';
import { ChatLog } from '@/components/grok/ChatLog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Share2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const isChatActive = messages.length > 0;

  const handleSubmit = async (prompt: string) => {
    setIsSending(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const { interpretedPrompt } = await interpretUserPrompt({ prompt });

      const conversationHistory = messages.map(msg => ({ role: msg.role as ('user' | 'assistant'), content: msg.content }));

      const { response } = await generateAiResponse({
        prompt: interpretedPrompt,
        conversationHistory,
      });

      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the AI.",
      });
      // Optionally remove the user message if AI fails
      setMessages(prev => prev.slice(0, prev.length -1));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-background text-foreground">
      <header className="absolute top-0 right-0 z-10 p-4 flex items-center gap-4">
        {isChatActive && (
          <>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Share
              <Share2 className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Switch id="private-mode" />
              <Label htmlFor="private-mode">Private</Label>
            </div>
          </>
        )}
      </header>

      <main className={`flex-1 overflow-y-auto transition-all duration-500 ${isChatActive ? 'pb-40 pt-16' : ''}`}>
        {isChatActive ? (
          <ChatLog messages={messages} isSending={isSending}/>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
          </div>
        )}
      </main>

      <div
        className={`absolute left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 transition-all duration-500 ease-in-out ${
          isChatActive ? 'bottom-8' : 'top-1/2'
        }`}
      >
        <PromptInput onSubmit={handleSubmit} isSending={isSending} isChatActive={isChatActive} />
        {!isChatActive && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent">DeepSearch</Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent">Create Images</Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent">Latest News</Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent">Personas</Button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { Message } from '@/types';
import { useToast } from '@/hooks/use-toast';

import { PromptInput } from '@/components/grok/PromptInput';
import { ChatLog } from '@/components/grok/ChatLog';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const isChatActive = messages.length > 0;
  const [isUrdu, setIsUrdu] = useState(false);


  const handleSubmit = async (prompt: string) => {
    setIsSending(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate a response without calling AI
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `you input is ${prompt}`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsSending(false);
    }, 500);
  };

  return (
    <div className={cn(
        "relative flex flex-col h-screen",
        !isChatActive ? 'welcome-screen-bg' : 'bg-background'
      )}
    >
      <header className="absolute top-0 right-0 z-10 p-4 flex items-center gap-4">
        {isChatActive ? (
          <>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Share
              <Share2 className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
           <div className="flex items-center space-x-2">
            <Label htmlFor="language-toggle" className={cn("font-medium", !isUrdu ? "text-primary" : "text-muted-foreground")}>English</Label>
            <Switch id="language-toggle" checked={isUrdu} onCheckedChange={setIsUrdu} />
            <Label htmlFor="language-toggle" className={cn("font-medium", isUrdu ? "text-primary" : "text-muted-foreground")}>اردو</Label>
          </div>
        )}
      </header>

      <main className={`flex-1 overflow-y-auto transition-all duration-500 ${isChatActive ? 'pb-40 pt-16' : ''}`}>
        {isChatActive ? (
          <ChatLog messages={messages} isSending={isSending}/>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl heading-gradient">
                  Your Dream Wedding, Perfectly Planned.
                </h1>
                <p className="mt-4 text-xl text-primary">Apki Shadi, Humare Saath</p>
                <div className="mt-4 w-48 h-px mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
              <PromptInput onSubmit={handleSubmit} isSending={isSending} isChatActive={isChatActive} />
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover">Find Venues</Button>
                <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover">Compare Photographers</Button>
                <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover">Get Catering Quotes</Button>
                <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover">Create a Moodboard</Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {isChatActive && (
        <div className="absolute w-full max-w-4xl px-4 bottom-8 left-1/2 -translate-x-1/2">
          <PromptInput onSubmit={handleSubmit} isSending={isSending} isChatActive={isChatActive} />
        </div>
      )}
    </div>
  );
}

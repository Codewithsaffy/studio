'use client';

import { useContext } from 'react';
import type { Message } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ChatContext } from '@/context/ChatContext';

import { PromptInput } from '@/components/grok/PromptInput';
import { ChatLog } from '@/components/grok/ChatLog';
import { Button } from '@/components/ui/button';
import { Share2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ChatView() {
  const {
    activeConversation,
    addMessage,
    isSending,
    startNewConversation,
  } = useContext(ChatContext);
  const { toast } = useToast();
  const isChatActive = activeConversation !== null;

  const handleSubmit = async (prompt: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: prompt };
    
    // This is a mock response, replace with actual AI call
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `This is a simulated response to: "${prompt}"`,
    };

    try {
      // In a real scenario, you'd add the AI message after getting a response
      setTimeout(async () => {
        await addMessage([userMessage, aiMessage]);
      }, 500);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving your message.',
      });
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen',
        !isChatActive ? 'welcome-screen-bg' : 'bg-background'
      )}
    >
      <header className="absolute top-0 right-0 z-10 p-4 flex items-center gap-4">
        {isChatActive && (
          <>
            <Button
              variant="outline"
              onClick={startNewConversation}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Share
              <Share2 className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </header>

      <main
        className={`flex-1 overflow-y-auto transition-all duration-500 ${
          isChatActive ? 'pb-40 pt-16' : 'pb-40'
        }`}
      >
        {isChatActive && activeConversation ? (
          <ChatLog
            messages={activeConversation.messages}
            isSending={isSending}
          />
        ) : (
          <div className="flex flex-col items-center text-center px-4 pt-[30vh]">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-8">
              <div className="text-center">
                <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-6xl max-w-2xl mx-auto heading-gradient">
                  Your Dream Wedding, Perfectly Planned.
                </h1>
              </div>
              <div className="hidden sm:block w-full">
                <PromptInput
                  onSubmit={handleSubmit}
                  isSending={isSending}
                  isChatActive={isChatActive}
                />
              </div>
              <div className="flex  flex-wrap justify-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                >
                  Find Venues
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                >
                  Compare Photographers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                >
                  Get Catering Quotes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                >
                  Create a Moodboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <div
        className={cn(
          'absolute w-full max-w-4xl px-4 bottom-8 left-1/2 -translate-x-1/2',
          isChatActive ? '' : 'sm:hidden'
        )}
      >
        <PromptInput
          onSubmit={handleSubmit}
          isSending={isSending}
          isChatActive={isChatActive}
        />
      </div>
    </div>
  );
}

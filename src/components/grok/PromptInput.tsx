'use client';

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Mic, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isSending: boolean;
  isChatActive: boolean;
}

export function PromptInput({ onSubmit, isSending, isChatActive }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setPrompt(currentPrompt => currentPrompt + transcript);
    };

    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    }
    
    recognitionRef.current = recognition;
  }, []);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isSending) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <div className="relative flex items-center w-full">
        <Textarea
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isChatActive ? 'How can Grok help?' : 'Mujhe 400 guests ke liye venue chahiye...'}
          className={cn(
            "min-h-[3.5rem] w-full rounded-full pl-5 pr-28 text-base focus-visible:ring-1 focus-visible:ring-ring resize-none overflow-hidden py-3.5",
            isChatActive
              ? "bg-card border-border"
              : "bg-background/80 dark:bg-transparent border-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          )}
          autoFocus
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={toggleListening} disabled={isSending}>
            <Mic className={`h-5 w-5 transition-colors ${isListening ? 'text-blue-500' : 'text-primary'}`} />
          </Button>
          {(prompt.trim() || isSending) && (
            <Button type="submit" size="icon" disabled={isSending} className="rounded-full">
              {isSending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

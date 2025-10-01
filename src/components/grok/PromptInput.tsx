'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, Mic, LoaderCircle } from 'lucide-react';

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
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={isChatActive ? 'How can Grok help?' : 'What do you want to know?'}
          className="h-14 w-full rounded-full bg-card pl-5 pr-40 text-base border-border focus-visible:ring-1 focus-visible:ring-ring"
          autoFocus
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
          {!isChatActive && (
            <Select defaultValue="grok-4-fast">
              <SelectTrigger className="w-auto bg-transparent border-none focus:ring-0 shadow-none text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grok-4-fast">Grok 4 Fast</SelectItem>
                <SelectItem value="grok-4">Grok 4</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button type="button" variant="ghost" size="icon" onClick={toggleListening} disabled={isSending}>
            <Mic className={`h-5 w-5 transition-colors ${isListening ? 'text-blue-500' : 'text-muted-foreground'}`} />
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

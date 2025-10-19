"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, LoaderCircle, Mic } from "lucide-react";
import { cn } from "@/lib/utils";



export function PromptInput({ onSubmit, loading }: { onSubmit: (prompt: string) => void, loading?:boolean }) {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: SpeechRecognitionResult) => result[0].transcript)
        .join("");
      setPrompt((currentPrompt) => currentPrompt + transcript);
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <div className="relative flex items-center w-full">
        <Textarea
          rows={1}
          value={prompt}
          onChange={(e)=> setPrompt(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={
               "Mujhe 400 guests ke liye venue chahiye..."
          }
          className={cn(
            "min-h-[3.5rem] placeholder:text-[12px] w-full rounded-full pl-5 pr-28 focus-visible:ring-1 focus-visible:ring-ring resize-none overflow-hidden py-4",
               "bg-card border-border"
          )}
          autoFocus
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            // disabled={isSending}
          >
            <Mic
              className={`h-5 w-5 transition-colors ${
                isListening ? "text-blue-500" : "text-primary"
              }`}
            />
          </Button>
          {(prompt.trim()) && (
            <Button
              type="submit"
              size="icon"
              onSubmit={handleFormSubmit}
              // disabled={isSending}
              className="rounded-full"
            >
              {/* {isSending ? ( */}
                {/* <LoaderCircle className="h-5 w-5 animate-spin" /> */}
              {/* ) : ( */}
              {
                loading ? <LoaderCircle className="animate-spin"/> : 
                <ArrowUp className="h-5 w-5" />

              }
              {/* )} */}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

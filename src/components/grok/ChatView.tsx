"use client";

import { PromptInput } from "@/components/grok/PromptInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import crypto from "crypto";

export function ChatView() {
  function generateSessionId() {
    return crypto.randomBytes(16).toString("hex") + Date.now().toString(16);
  }

  // Example usage

  const handleSubmit = (prompt: string) => {
    if (typeof prompt === "string" && prompt.trim() !== "") {
      localStorage.setItem("initialMessage", prompt);
      const sessionId = generateSessionId();
      redirect(`/chat/${sessionId}`);
    }
    // setIsSending(false);
  };

  return (
    <div className={cn("relative flex flex-col h-screen bg-background")}>
      <main
        className={`flex-1 overflow-y-auto transition-all duration-500 pb-40`}
      >
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
                // isSending={isSending}
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
      </main>

      <div
        className={cn(
          "absolute w-full max-w-4xl px-4 bottom-8 left-1/2 -translate-x-1/2 block sm:hidden"
        )}
      >
        <PromptInput
          onSubmit={handleSubmit}
          // isSending={isSending}
        />
      </div>
    </div>
  );
}


"use client";

import { PromptInput } from "@/components/grok/PromptInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { nanoid } from 'nanoid';

export function ChatView() {
  const router = useRouter();

  const handleSubmit = (prompt: string) => {
    if (typeof prompt === "string" && prompt.trim() !== "") {
      localStorage.setItem("initialMessage", prompt);
      const sessionId = nanoid();
      router.push(`/chat/${sessionId}`);
    }
  };

  return (
    <div className={cn("relative flex flex-col h-full bg-background")}>
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
              />
            </div>
            <div className="flex  flex-wrap justify-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                onClick={() => handleSubmit("Find me venues in Karachi for 500 guests")}
              >
                Find Venues
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                onClick={() => handleSubmit("Compare photographers in Lahore under 1.5 lakh")}
              >
                Compare Photographers
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                onClick={() => handleSubmit("Get catering quotes for 300 people")}
              >
                Get Catering Quotes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-transparent border-border hover:bg-accent quick-action-hover"
                onClick={() => handleSubmit("Create a moodboard for a rustic themed wedding")}
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
        />
      </div>
    </div>
  );
}

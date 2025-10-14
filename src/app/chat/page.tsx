"use client";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { useChat } from "ai/react";
import { PromptInput } from "@/components/grok/PromptInput";
import { Copy, Plus, RefreshCw, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { useIsMobile } from '@/hooks/use-mobile';

const GeminiReasoningChat = () => {
  const { messages, append, status } = useChat();
  const isMobile = useIsMobile();

  const handleSubmit = (prompt: string) => {
    if (typeof prompt === "string" && prompt.trim() !== "") {
      append({ role: 'user', content: prompt });
    }
  };
  console.log(status)

  return (
    <main className="flex flex-col h-full w-full overflow-hidden relative  custom-scrollbar-overlay with-scroll-padding">
      {/* Messages Container - Takes remaining space */}
       {!isMobile && (
        <header className="sticky w-full border-b top-0 right-0 z-10 px-4 py-2 flex items-center gap-2 justify-end bg-background">
          <Button variant="ghost" className=" hover:text-foreground">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          <Button variant="ghost" className=" hover:text-foreground">
            Share
            <Share2 className="ml-2 h-4 w-4" />
          </Button>
        </header>
      )}

      <div className="w-full overflow-auto flex-1">
        <Conversation className="bg-transparent h-full ">
          <ConversationContent className="bg-transparent max-w-4xl w-full mx-auto">
            {messages.map((message) => (
              <div key={message.id}>

              <Message
                className="bg-transparent"
                from={message.role}
                key={message.id}
              >
                <MessageContent className="bg-transparent">
                  {typeof message.content === 'string' ? (
                      <Response
                        className="bg-transparent"
                      >
                        {message.content}
                      </Response>
                  ) : (
                    message.content.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response
                            className="bg-transparent"
                            key={`${message.id}-${i}`}
                          >
                            {part.text}
                          </Response>
                        );
                      case "tool-call":
                        if(part.toolName === 'getWeather'){
                        return (
                          <Tool key={part.toolCallId} defaultOpen={false}  className="max-w-[325px]">
                            <ToolHeader
                              type="tool-call"
                              state={'input-available'}

                            />
                            <ToolContent>
                              <ToolInput input={part.args} />
                            </ToolContent>
                          </Tool>
                        );
                        } else if(part.toolName === 'getLocation'){
                           return (
                          <Tool key={part.toolCallId} defaultOpen={false}  className="max-w-[325px]">
                            <ToolHeader
                              type="tool-call"
                              state={'input-available'}

                            />
                            <ToolContent>
                              <ToolInput input={part.args} />
                            </ToolContent>
                          </Tool>
                        );
                        }
                      default:
                        return null;
                    }
                  })
                  )}

                </MessageContent>
              </Message>
              {(message.role === 'assistant' && status !== "in_progress")  && (
              <div className="flex items-center text-muted-foreground ml-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
              </div>


            ))}
            {status === "in_progress" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      {/* Input Container - Fixed at bottom */}
      <div className="absolute w-full max-w-4xl px-4 bottom-0 py-4 bg-background left-1/2 -translate-x-1/2">
        <PromptInput onSubmit={handleSubmit} />
      </div>
    </main>
  );
};

export default GeminiReasoningChat;
// import React from 'react'

// const Chat = () => {
//   return (
//     <div>Chat</div>
//   )
// }

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
import { useChat } from "@ai-sdk/react";
import { PromptInput } from "@/components/grok/PromptInput";
import {
  Copy,
  Plus,
  RefreshCw,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { use, useEffect, useState } from "react";
import { dummyVendors, Vendor } from "@/lib/data";
import VendorCard from "@/components/vendors/VendorCard";
import VendorDetailModal from "@/components/vendors/VendorDetailModal";

type Params = Promise<{ sessionId: string }>;

const GeminiReasoningChat = (props: { params: Params }) => {
  const { messages, sendMessage, status } = useChat();
  const [initialMessageProcessed, setInitialMessageProcessed] = useState(false);
  const sessionId = use(props.params).sessionId;
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  function extractProductIds(text: string): string[] {
    if (!text) return [];
    const re = /\[PRODUCTS\]\s*:?\s*\[([^\]]+)\]/i;
    const m = text.match(re);
    if (!m) return [];
    return m[1]
      .split(/[,\s]+/) // split by comma or spaces
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const handleSubmit = (prompt: string) => {
    if (typeof prompt === "string" && prompt.trim() !== "") {
      sendMessage({ text: prompt });
    }
  };
  console.log(status);
  useEffect(() => {
    if (!initialMessageProcessed) {
      const storedMessage = localStorage.getItem("initialMessage");
      if (storedMessage) {
        try {
          // Process the initial message using the centralized function
          sendMessage({ text: storedMessage });

          // Clear the stored message after processing
          localStorage.removeItem("initialMessage");
        } catch (error) {
          console.error("Error parsing stored message:", error);
        }
      }
      setInitialMessageProcessed(true);
    }
  }, [initialMessageProcessed, sessionId]);

  return (
    <main className="flex flex-col h-screen w-full overflow-hidden relative  custom-scrollbar-overlay with-scroll-padding">
      {/* Messages Container - Takes remaining space */}
      <header className="sticky w-full border-b top-0 right-0 z-10 px-4 py-2 flex items-center gap-2 justify-end">
        <Button variant="ghost" className=" hover:text-foreground">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        <Button variant="ghost" className=" hover:text-foreground">
          Share
          <Share2 className="ml-2 h-4 w-4" />
        </Button>
      </header>

      <div className="w-full overflow-auto h-[calc(100vh-8rem)] ">
        <Conversation className=" h-full ">
          <ConversationContent className=" max-w-4xl w-full mx-auto">
            {messages.map((message) => (
              <div key={message.id}>
                <Message from={message.role} key={message.id}>
                  <MessageContent
                    className={`${
                      message.role === "user" ? "max-w-xl" : "max-w-full"
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          const ids = extractProductIds(part.text || "");
                          const vendors = dummyVendors.filter((v) =>
                            ids.includes(v.id)
                          );
                          console.log(vendors);
                          const cleanedText = (part.text || "")
                            .replace(/\[PRODUCTS\]\s*:?\s*\[[^\]]+\]/i, "")
                            .trim();

                          console.log(ids);
                          return (
                            <div key={`${message.id}-${i}`}>
                              {cleanedText ? (
                                <Response
                                  className=""
                                  key={`${message.id}-${i}`}
                                >
                                  {cleanedText}
                                </Response>
                              ) : null}

                              {vendors.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                                  {vendors.map((vendor) => (
                                    <VendorCard
                                      vendor={vendor}
                                      onViewDetails={() =>
                                        setSelectedVendor(vendor)
                                      }
                                    />
                                  ))}
                                  {selectedVendor && (
                                    <VendorDetailModal
                                      vendor={selectedVendor}
                                      isOpen={!!selectedVendor}
                                      onClose={() => setSelectedVendor(null)}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        case "reasoning":
                          const plainText = part.text
                            .replace(/^#{1,6}\s+/gm, "")
                            .replace(/\*\*(.+?)\*\*/g, "$1")
                            .replace(/\*(.+?)\*/g, "$1")
                            .replace(/`(.+?)`/g, "$1")
                            .replace(/~~(.+?)~~/g, "$1")
                            .replace(/\[(.+?)\]\(.+?\)/g, "$1");

                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300"
                              isStreaming={status === "streaming"}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{plainText}</ReasoningContent>
                            </Reasoning>
                          );
                        case "tool-getAvailableHalls":
                        case "tool-getAvailablePhotography":
                        case "tool-getAvailableCars":
                        case "tool-getAvailableBuses":
                        case "tool-checkVendorAvailability":
                        case "tool-calculateWeddingBudget":
                        case "tool-createBooking":

                        // return (
                        //   <Tool key={part.toolCallId} defaultOpen={false}  className="max-w-[325px]">
                        //     <ToolHeader
                        //       type="tool-getAvailableHalls"
                        //       state={part.state}

                        //     />
                        //     <ToolContent>
                        //       <ToolInput input={part.input} />
                        //       {part.state === "output-available" && (
                        //         <ToolOutput
                        //           errorText={part.errorText}
                        //           output={
                        //             <CodeBlock
                        //               code={JSON.stringify(part.output)}
                        //               language="json"
                        //             />
                        //           }
                        //         />
                        //       )}
                        //     </ToolContent>
                        //   </Tool>
                        // );
                        case "tool-getAvailableCatering":
                          return (
                            <Tool
                              key={part.toolCallId}
                              defaultOpen={false}
                              className="max-w-[325px]"
                            >
                              <ToolHeader type={part.type} state={part.state} />
                              <ToolContent>
                                <ToolInput input={part.input} />
                                {part.state === "output-available" && (
                                  <ToolOutput
                                    errorText={part.errorText}
                                    output={
                                      <CodeBlock
                                        code={JSON.stringify(part.output)}
                                        language="json"
                                      />
                                    }
                                  />
                                )}
                              </ToolContent>
                            </Tool>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
                {message.role === "assistant" &&
                  !(
                    message.id === messages[messages.length - 1].id &&
                    status === "streaming"
                  ) && (
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
            {status === "submitted" && <Loader />}
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

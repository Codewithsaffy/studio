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
import { use, useContext, useEffect, useState } from "react";
import { dummyVendors, Vendor } from "@/lib/data";
import VendorCard from "@/components/vendors/VendorCard";
import VendorDetailModal from "@/components/vendors/VendorDetailModal";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MessageWithParts } from "@/lib/database/chatHistory";
import ChatContext from "@/context/Chatcontext";

type Params = Promise<{ sessionId: string }>;

const GeminiReasoningChat = (props: { params: Params }) => {
  const session = useSession()
  const sessionId = use(props.params).sessionId;
const { addOrUpdateChat, chats } = useContext(ChatContext);

  const { messages, sendMessage, status, setMessages } = useChat({
  onFinish: async (message) => {
    const result = await appendMessageToConversation(sessionId, message.message);
    
    // Update sidebar after AI response
    if (result.data) {
      addOrUpdateChat({
        sessionId: result.data.sessionId as string,
        title: result.data.title as string,
        updatedAt: new Date(result.data.updatedAt)
      });
    }
  }
});
  const [initialMessageProcessed, setInitialMessageProcessed] = useState(false);
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

   const appendMessageToConversation = async (sessionId: string, message: MessageWithParts) => {
    const result = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, message: message }),
      });
      const data = await result.json();
      return data
  }
 
    
  const getConversationHistory = async (sessionId:string)=>{
    const result = await fetch(`/api/conversation/${sessionId}`)
    const data = await result.json()
    return data
  }
const handleSubmit = async (prompt: string) => {
  if (typeof prompt === "string" && prompt.trim() !== "") {
    sendMessage({ text: prompt });
    
    const result = await appendMessageToConversation(sessionId, { 
      id: crypto.randomUUID(), 
      role: "user", 
      parts: [{ type: "text", text: prompt }] 
    });
    
    // Update the chat in sidebar after each message
    if (result.data) {
      addOrUpdateChat({
        sessionId: result.data.sessionId as string,
        title: result.data.title as string,
        updatedAt: new Date(result.data.updatedAt)
      });
    }
  }
}

  useEffect(() => {
    if (session.status === "unauthenticated" ) {
      redirect('/login');
    } 

    const loadHistory = async () => {
      try {
        const data = await getConversationHistory(sessionId);
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error loading conversation history:", error);
      }
    };
    
    loadHistory();
  }, [session]);

useEffect(() => {
  if (!initialMessageProcessed) {
    const storedMessage = localStorage.getItem("initialMessage");
    if (storedMessage) {
      try {
        sendMessage({ text: storedMessage });
        
        appendMessageToConversation(sessionId, { 
          id: crypto.randomUUID(), 
          role: "user", 
          parts: [{ type: "text", text: storedMessage }] 
        }).then((payload) => {
          const data = payload.data;
          
          // Use the addOrUpdateChat function from context
          addOrUpdateChat({
            sessionId: data.sessionId as string,
            title: data.title as string,
            updatedAt: new Date(data.updatedAt)
          });
        });

        localStorage.removeItem("initialMessage");
      } catch (error) {
        console.error("Error parsing stored message:", error);
      }
    }
    setInitialMessageProcessed(true);
  }
}, [initialMessageProcessed, sessionId, sendMessage]);


  return (
    <main className="flex flex-col h-full w-full overflow-hidden relative  custom-scrollbar-overlay with-scroll-padding">
      <div className="w-full overflow-auto flex-1">
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
                          const cleanedText = (part.text || "")
                            .replace(/\[PRODUCTS\]\s*:?\s*\[[^\]]+\]/i, "")
                            .trim();

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
                                    key={vendor.id}
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
      <div className="w-full max-w-4xl px-4 py-4 bg-background mx-auto">
        <PromptInput onSubmit={handleSubmit} />
      </div>
    </main>
  );
};

export default GeminiReasoningChat;

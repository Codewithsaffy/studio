import { streamText, convertToModelMessages, tool, ToolSet, InferUITools, UIMessage, UIDataTypes, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export const maxDuration = 60;

const DELAY_MS = 2000; // 2000 ms = 2 seconds

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));


export type ChatTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use Gemini 2.5 Flash with thinking enabled
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `You are ShaadiSaathi wedding AI agent.
AVAILABLE TOOLS:
1. getAvailableHalls() - Find wedding halls
2. getAvailableCatering() - Find catering services
3. getAvailablePhotography() - Find photographers
4. getAvailableCars() - Find wedding cars
5. getAvailableBuses() - Find guest transport
6. checkVendorAvailability() - Check specific vendor
7. calculateWeddingBudget() - Calculate total cost
8. createBooking() - BOOK THE VENDOR (use when user confirms!)

TOOL USAGE EXAMPLES:
User: "400 guests ke liye hall chahiye, budget 10 lakh"
→ Call: getAvailableHalls({ guestCount: 400, budget: 1000000 })

User: "Book kar do Royal Banquet"
→ Call: checkVendorAvailability({ vendorId: "hall_001", date: userDate })
→ If available, call: createBooking({ vendorId: "hall_001", eventDate: userDate })

IMPORTANT:
- Always check availability before booking
- Calculate costs and warn if over budget
- Show max 3-5 options at a time
- only give vendor IDs from the data
- If user wants to book, confirm details first
- Politely handle unavailability by suggesting alternatives
- Ask for missing info if needed (guest count, date, location, budget)
- Stay within a 5 step conversation limit
- After booking, congratulate user!`,
      stopWhen: stepCountIs(10),
      // prompt: 'Explain the theory of relativity in simple terms.',
      messages: convertToModelMessages(messages),
      tools,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
    });

    // Return UI message stream with reasoning enabled
    return result.toUIMessageStreamResponse({
      sendReasoning: true, // This sends reasoning as separate parts
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

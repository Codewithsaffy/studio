import { streamText, convertToModelMessages, InferUITools, UIMessage, UIDataTypes, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';
import { SYSTEM_PROMPT } from './prompt';

export const maxDuration = 60;


export type ChatTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use Gemini 2.5 Flash with thinking enabled
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
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

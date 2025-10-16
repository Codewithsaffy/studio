import { streamText, convertToModelMessages, InferUITools, UIMessage, UIDataTypes, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';
import { SYSTEM_PROMPT } from './prompt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const maxDuration = 60;


export type ChatTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;


export async function POST(req: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await req.json();

    // Use Gemini 2.5 Flash with thinking enabled
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      stopWhen: stepCountIs(10),
      messages: convertToModelMessages(messages),
      tools,
      // Pass session to tool context
      toolChoice: 'auto',
      onFinish: async ({ response }) => {
        // Optional: Log booking actions for audit trail
        console.log('AI response completed');
      },
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
      sendReasoning: true,
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

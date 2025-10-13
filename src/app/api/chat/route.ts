import { streamText, convertToModelMessages, tool, ToolSet, InferUITools, UIMessage, UIDataTypes, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const maxDuration = 60;

const DELAY_MS = 10000; // 10000 ms = 10 seconds

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const tools = {
  getLocation: tool({
    description: 'Get the location of the user',
    inputSchema: z.object({}),
    execute: async () => {
      // simulate network delay
      await sleep(DELAY_MS);

      const location = { lat: 37.7749, lon: -122.4194 };
      return `Your location is at latitude ${location.lat} and longitude ${location.lon}`;
    },
  }),

  getWeather: tool({
    description: 'Get the weather for a location',
    inputSchema: z.object({
      city: z.string().describe('The city to get the weather for'),
      unit: z
        .enum(['C', 'F'])
        .describe('The unit to display the temperature in'),
    }),
    execute: async ({ city, unit }) => {
      // simulate network delay
      await sleep(DELAY_MS);

      const weather = {
        value: 24,
        description: 'Sunny',
      };

      return {
        output:`It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`
      };
    },
  }),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use Gemini 2.5 Flash with thinking enabled
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: 'You are a helpful assistant.',
      stopWhen: stepCountIs(5),
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

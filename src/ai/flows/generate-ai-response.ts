'use server';

/**
 * @fileOverview A flow for generating AI responses based on user prompts and conversation history.
 *
 * - generateAiResponse - A function that generates AI responses.
 * - GenerateAiResponseInput - The input type for the generateAiResponse function.
 * - GenerateAiResponseOutput - The return type for the generateAiResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiResponseInputSchema = z.object({
  prompt: z.string().describe('The user prompt to generate a response for.'),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional().describe('The conversation history to provide context for the response.'),
});

export type GenerateAiResponseInput = z.infer<typeof GenerateAiResponseInputSchema>;

const GenerateAiResponseOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});

export type GenerateAiResponseOutput = z.infer<typeof GenerateAiResponseOutputSchema>;

export async function generateAiResponse(input: GenerateAiResponseInput): Promise<GenerateAiResponseOutput> {
  return generateAiResponseFlow(input);
}

const generateAiResponsePrompt = ai.definePrompt({
  name: 'generateAiResponsePrompt',
  input: {
    schema: GenerateAiResponseInputSchema,
  },
  output: {
    schema: GenerateAiResponseOutputSchema,
  },
  prompt: `You are Grok, a helpful AI assistant. Respond to the user prompt based on the conversation history, if provided.\n\nConversation History:\n{{#each conversationHistory}}
  {{#if (eq this.role \"user\")}}User:{{else}}Grok:{{/if}} {{this.content}}\n{{/each}}
\nUser Prompt: {{{prompt}}}`,
});

const generateAiResponseFlow = ai.defineFlow(
  {
    name: 'generateAiResponseFlow',
    inputSchema: GenerateAiResponseInputSchema,
    outputSchema: GenerateAiResponseOutputSchema,
  },
  async input => {
    const {output} = await generateAiResponsePrompt(input);
    return output!;
  }
);

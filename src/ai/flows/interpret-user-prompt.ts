'use server';

/**
 * @fileOverview A flow to interpret the user's prompt using an LLM.
 *
 * - interpretUserPrompt - A function that interprets the user's prompt.
 * - InterpretUserPromptInput - The input type for the interpretUserPrompt function.
 * - InterpretUserPromptOutput - The return type for the interpretUserPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretUserPromptInputSchema = z.object({
  prompt: z.string().describe('The user prompt to interpret.'),
});
export type InterpretUserPromptInput = z.infer<typeof InterpretUserPromptInputSchema>;

const InterpretUserPromptOutputSchema = z.object({
  interpretedPrompt: z.string().describe('The interpreted user prompt.'),
});
export type InterpretUserPromptOutput = z.infer<typeof InterpretUserPromptOutputSchema>;

export async function interpretUserPrompt(input: InterpretUserPromptInput): Promise<InterpretUserPromptOutput> {
  return interpretUserPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretUserPromptPrompt',
  input: {schema: InterpretUserPromptInputSchema},
  output: {schema: InterpretUserPromptOutputSchema},
  prompt: `You are an AI assistant that interprets user prompts to make them clear and actionable for AI models.

  User Prompt: {{{prompt}}}

  Please provide a re-phrased and interpreted version of the prompt that is clear, concise, and directly addresses the user's intent.  The goal is to optimize the prompt for effective processing by AI models.
  Make sure the output is not conversational.
  Interpreted Prompt:`, 
});

const interpretUserPromptFlow = ai.defineFlow(
  {
    name: 'interpretUserPromptFlow',
    inputSchema: InterpretUserPromptInputSchema,
    outputSchema: InterpretUserPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview Suggests a job description based on a job title.
 *
 * - suggestJobDescription - A function that suggests a job description.
 * - SuggestJobDescriptionInput - The input type for the suggestJobDescription function.
 * - SuggestJobDescriptionOutput - The return type for the suggestJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestJobDescriptionInputSchema = z.object({
  jobTitle: z
    .string()
    .describe('The title of the job for which to suggest a description.'),
});
export type SuggestJobDescriptionInput = z.infer<
  typeof SuggestJobDescriptionInputSchema
>;

const SuggestJobDescriptionOutputSchema = z.object({
  jobDescription: z.string().describe('The suggested job description.'),
});
export type SuggestJobDescriptionOutput = z.infer<
  typeof SuggestJobDescriptionOutputSchema
>;

export async function suggestJobDescription(
  input: SuggestJobDescriptionInput
): Promise<SuggestJobDescriptionOutput> {
  return suggestJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestJobDescriptionPrompt',
  input: {schema: SuggestJobDescriptionInputSchema},
  output: {schema: SuggestJobDescriptionOutputSchema},
  prompt: `You are an expert hiring manager. Write a compelling and professional job description for the following job title: {{{jobTitle}}}. 
  
  The description should be comprehensive, including typical responsibilities, required skills, and qualifications. Do not include a "What We Offer" or salary section.`,
});

const suggestJobDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestJobDescriptionFlow',
    inputSchema: SuggestJobDescriptionInputSchema,
    outputSchema: SuggestJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI flow to parse a resume file and extract structured data.
 *
 * - parseResumeFromFile - A function that reads a resume and extracts its content.
 * - ParseResumeInput - The input type for the parseResumeFromFile function.
 * - ParseResumeOutput - The return type for the parseResumeFromFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperienceSchema = z.object({
  title: z.string().describe('The job title.'),
  company: z.string().describe('The company name.'),
  startDate: z.string().describe('The start date of the employment.'),
  endDate: z.string().describe('The end date of the employment.'),
  description: z
    .string()
    .describe(
      'A description of the role and responsibilities, formatted with newlines.'
    ),
});

const EducationSchema = z.object({
    degree: z.string().describe("The degree or qualification obtained."),
    school: z.string().describe("The name of the school or university."),
    startDate: z.string().describe("The start date of the education."),
    endDate: z.string().describe("The end date of the education."),
});

export const ParseResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

export const ParseResumeOutputSchema = z.object({
  fullName: z.string().describe("The full name of the person."),
  email: z.string().describe("The email address."),
  phone: z.string().describe("The phone number."),
  linkedin: z.string().describe("The LinkedIn profile URL, if available.").optional(),
  summary: z.string().describe("The professional summary or objective."),
  experience: z.array(ExperienceSchema).describe("The work experience sections."),
  education: z.array(EducationSchema).describe("The education sections."),
  skills: z
    .string()
    .describe("A comma-separated string of skills."),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;


export async function parseResumeFromFile(
  input: ParseResumeInput
): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an expert resume parser. Analyze the following resume file and extract the structured data from it.

If a LinkedIn profile is not present, do not include the field. Pay close attention to formatting descriptions with newlines to preserve bullet points.

Resume File: {{media url=resumeDataUri}}

Produce the output in the specified JSON format.
`,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

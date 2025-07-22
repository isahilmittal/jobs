'use server';
/**
 * @fileOverview An AI flow to enhance a user's resume.
 *
 * - enhanceResume - A function that analyzes and improves resume content.
 * - EnhanceResumeInput - The input type for the enhanceResume function.
 * - EnhanceResumeOutput - The return type for the enhanceResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Matches the Experience type in the frontend, but without ID
const ExperienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const EnhanceResumeInputSchema = z.object({
  summary: z.string().describe("The user's current professional summary."),
  experience: z.array(ExperienceSchema).describe("The user's work experience."),
  skills: z.string().describe("The user's current list of skills."),
});
export type EnhanceResumeInput = z.infer<typeof EnhanceResumeInputSchema>;

const EnhanceResumeOutputSchema = z.object({
  enhancedSummary: z
    .string()
    .describe('An improved, ATS-friendly version of the professional summary.'),
  enhancedExperience: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        enhancedDescription: z
          .string()
          .describe(
            'An improved, ATS-friendly version of the job description, rewritten with action verbs and quantifiable achievements.'
          ),
      })
    )
    .describe('The work experience with enhanced descriptions.'),
  suggestedSkills: z
    .array(z.string())
    .describe(
      'A list of 3-5 relevant skills to add, based on the experience provided.'
    ),
  feedback: z
    .string()
    .describe(
      'Constructive, overall feedback on the resume (2-3 sentences).'
    ),
  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'An overall score out of 100 for the resume, based on ATS-friendliness, clarity, and impact.'
    ),
});
export type EnhanceResumeOutput = z.infer<typeof EnhanceResumeOutputSchema>;

export async function enhanceResume(
  input: EnhanceResumeInput
): Promise<EnhanceResumeOutput> {
  return enhanceResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceResumePrompt',
  input: {schema: EnhanceResumeInputSchema},
  output: {schema: EnhanceResumeOutputSchema},
  prompt: `You are an expert career coach and resume writer specializing in creating ATS-friendly resumes that land interviews.

Analyze the following resume sections and enhance them.

**Current Resume:**
- Summary: {{{summary}}}
- Experience:
{{#each experience}}
  - Title: {{title}} at {{company}}
    Description: {{description}}
{{/each}}
- Skills: {{{skills}}}

**Your Task:**
1.  **Rewrite the Summary:** Make it more impactful and concise.
2.  **Rewrite Experience Descriptions:** For each job, rewrite the description to use strong action verbs and quantify achievements where possible. Focus on results, not just duties.
3.  **Suggest Skills:** Based on the job titles and descriptions, suggest 3-5 additional relevant skills the user might have but hasn't listed. Do not include skills already listed.
4.  **Provide Feedback:** Give 2-3 sentences of constructive, high-level feedback.
5.  **Score the Resume:** Provide an overall score from 0-100 based on its quality.

Produce the output in the specified JSON format.
`,
});

const enhanceResumeFlow = ai.defineFlow(
  {
    name: 'enhanceResumeFlow',
    inputSchema: EnhanceResumeInputSchema,
    outputSchema: EnhanceResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

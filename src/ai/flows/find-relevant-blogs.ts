'use server';

/**
 * @fileOverview Finds relevant blog posts for a given job.
 * 
 * - findRelevantBlogs - A function that handles finding relevant blogs.
 * - FindRelevantBlogsInput - The input type for the findRelevantBlogs function.
 * - FindRelevantBlogsOutput - The return type for the findRelevantBlogs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Blog } from '@/lib/types';

const BlogSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    author: z.string(),
    slug: z.string(),
    imageUrl: z.string(),
    createdAt: z.number(),
});

const FindRelevantBlogsInputSchema = z.object({
  jobTitle: z.string().describe("The title of the job."),
  jobSkills: z.array(z.string()).describe("A list of skills for the job."),
  blogs: z.array(BlogSchema).describe("A list of all available blog posts."),
});

export type FindRelevantBlogsInput = z.infer<typeof FindRelevantBlogsInputSchema>;

const FindRelevantBlogsOutputSchema = z.object({
  blogs: z
    .array(z.string())
    .describe('An array of IDs of the most relevant blog posts. Return up to 3.'),
});
export type FindRelevantBlogsOutput = z.infer<typeof FindRelevantBlogsOutputSchema>;

export async function findRelevantBlogs(input: FindRelevantBlogsInput): Promise<Blog[]> {
    if (!input.blogs.length) {
        return [];
    }
    const result = await findRelevantBlogsFlow(input);
    const relevantBlogIds = new Set(result.blogs);
    return input.blogs.filter(blog => relevantBlogIds.has(blog.id));
}

const findRelevantBlogsPrompt = ai.definePrompt({
  name: 'findRelevantBlogsPrompt',
  input: { schema: FindRelevantBlogsInputSchema },
  output: { schema: FindRelevantBlogsOutputSchema },
  prompt: `You are an expert at recommending content.
    Given a job title, a list of skills, and a list of blog posts, identify the most relevant blog posts (up to 3) for someone interested in this job.
    Consider the technologies mentioned, the role seniority, and general career advice.

    Job Title: {{{jobTitle}}}
    Job Skills: {{#each jobSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

    Available Blog Posts (id, title, and content):
    {{#each blogs}}
    - ID: {{{id}}}, Title: {{{title}}}, Content: {{{content}}}
    {{/each}}

    Return the IDs of the most relevant blog posts.
  `,
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
});

const findRelevantBlogsFlow = ai.defineFlow(
  {
    name: 'findRelevantBlogsFlow',
    inputSchema: FindRelevantBlogsInputSchema,
    outputSchema: FindRelevantBlogsOutputSchema,
  },
  async input => {
    const { output } = await findRelevantBlogsPrompt(input);
    return output!;
  }
);

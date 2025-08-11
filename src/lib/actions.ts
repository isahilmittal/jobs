'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { extractSkills } from '@/ai/flows/extract-skills';
import type { Job } from './types';
import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';

// Schema for validating job form data
const jobSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  company: z.string().min(2, 'Company name must be at least 2 characters.'),
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  applyUrl: z.string().url('Please enter a valid URL.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

// Server action to add a new job
export async function addJobAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Authentication required to create a job.' };
  }

  const values = Object.fromEntries(formData.entries());
  const validatedFields = jobSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { skills } = await extractSkills({ jobDescription: validatedFields.data.description });
    
    const newJobPayload = {
      ...validatedFields.data,
      skills,
    };
    
    const { error } = await supabase.from('jobs').insert(newJobPayload);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Failed to create job. Reason: ${errorMessage}` };
  }
}

// Server action to update an existing job
export async function updateJobAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required to update a job." };
  }

  const values = Object.fromEntries(formData.entries());
  const validatedFields = jobSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { skills } = await extractSkills({ jobDescription: validatedFields.data.description });
    const updatedJobData: Partial<Job> = {
      ...validatedFields.data,
      skills,
    };
    const { error } = await supabase.from('jobs').update(updatedJobData).eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update job.' };
  }
}

// Server action to delete a job
export async function deleteJobAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required to delete a job." };
  }

  try {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete job.' };
  }
}

// Schema for validating login form data
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

// Server action for user login
export async function loginAction(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid email or password format.',
    };
  }
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    return {
        error: error.message,
    };
  }

  revalidatePath('/admin');
  redirect('/admin');
}

// Server action for user logout
export async function logoutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

// Function to fetch all jobs
export async function getJobs(): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error.message);
    return [];
  }

  return data.map(job => ({
    ...job,
    createdAt: new Date(job.createdAt).getTime(),
  }));
}

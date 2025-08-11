'use server';

import type { Job } from './types';
import { createClient } from '@/lib/supabase/server';

const handleSupabaseError = (error: Error, context: string) => {
  if (error.message.trim().startsWith('<!DOCTYPE html>')) {
    console.error(`Error in ${context}: Received an HTML response from Supabase. This usually means your NEXT_PUBLIC_SUPABASE_URL is not configured correctly in your .env file. Please ensure it points to your Supabase project's API URL, not the dashboard URL.`);
    return;
  }
  console.error(`Error in ${context}:`, error.message);
};

export async function getJobs(): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    handleSupabaseError(error, 'getJobs');
    return [];
  }

  // Supabase returns `createdAt` as an ISO string, convert it to a number (timestamp)
  return data.map(job => ({
    ...job,
    createdAt: new Date(job.createdAt).getTime(),
  }));
}

export async function getJobById(id: string): Promise<Job | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
  
    if (error) {
      handleSupabaseError(error, `getJobById (id: ${id})`);
      return undefined;
    }

    if (!data) {
        return undefined;
    }
  
    return {
        ...data,
        createdAt: new Date(data.createdAt).getTime(),
    };
}


export async function addJob(job: Omit<Job, 'id' | 'createdAt'>, skills: string[]): Promise<Job> {
  const supabase = await createClient();
  const newJobPayload = {
    ...job,
    skills,
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert(newJobPayload)
    .select()
    .single();

  if (error) {
    handleSupabaseError(error, 'addJob');
    throw new Error('Failed to add job.');
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt).getTime(),
  };
}

export async function updateJob(id: string, updatedJob: Partial<Job>): Promise<Job | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('jobs')
        .update(updatedJob)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        handleSupabaseError(error, `updateJob (id: ${id})`);
        return null;
    }
    
    return {
        ...data,
        createdAt: new Date(data.createdAt).getTime(),
    };
}

export async function deleteJob(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from('jobs').delete().eq('id', id);

    if (error) {
        handleSupabaseError(error, `deleteJob (id: ${id})`);
        return false;
    }

    return true;
}

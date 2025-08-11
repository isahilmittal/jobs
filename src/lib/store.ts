'use server';

import type { Job } from './types';
import { createClient } from '@/lib/supabase/server';

const handleSupabaseError = (error: Error, context: string) => {
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
    console.error('Supabase error details in addJob:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to add job. DB error: ${error.message}`);
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

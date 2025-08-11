'use server';

import type { Job } from './types';
import { createClient } from '@/lib/supabase/server';

export async function getJobs(): Promise<Job[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  // Supabase returns `createdAt` as an ISO string, convert it to a number (timestamp)
  return data.map(job => ({
    ...job,
    createdAt: new Date(job.createdAt).getTime(),
  }));
}

export async function getJobById(id: string): Promise<Job | undefined> {
    const supabase = createClient();
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
  
    if (error) {
      console.error(`Error fetching job with id ${id}:`, error);
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
  const supabase = createClient();
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
    console.error('Error adding job:', error);
    throw new Error('Failed to add job.');
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt).getTime(),
  };
}

export async function updateJob(id: string, updatedJob: Partial<Job>): Promise<Job | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('jobs')
        .update(updatedJob)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating job:', error);
        return null;
    }
    
    return {
        ...data,
        createdAt: new Date(data.createdAt).getTime(),
    };
}

export async function deleteJob(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('jobs').delete().eq('id', id);

    if (error) {
        console.error('Error deleting job:', error);
        return false;
    }

    return true;
}

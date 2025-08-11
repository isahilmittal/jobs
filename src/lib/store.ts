'use server';

import type { Job } from './types';

let jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'Innovate Inc.',
    location: 'San Francisco, CA',
    description: 'We are looking for a senior frontend engineer to build beautiful and performant user interfaces. You will be working with React, TypeScript, and Next.js.',
    applyUrl: '#',
    skills: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'CSS'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: '2',
    title: 'Backend Developer (Python)',
    company: 'DataSolutions',
    location: 'New York, NY',
    description: 'Join our backend team to work on our data processing pipeline. Experience with Python, Django, and PostgreSQL is required.',
    applyUrl: '#',
    skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'Docker'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: '3',
    title: 'Full-Stack Developer',
    company: 'CloudNet',
    location: 'Remote',
    description: 'A versatile full-stack developer needed to work on all parts of our system. Our stack is MERN (MongoDB, Express, React, Node.js).',
    applyUrl: '#',
    skills: ['Node.js', 'Express', 'MongoDB', 'React', 'JavaScript'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'SecureCloud',
    location: 'Austin, TX',
    description: 'We are seeking a DevOps engineer to manage our cloud infrastructure on AWS. Strong experience with CI/CD, Kubernetes, and Terraform is essential.',
    applyUrl: '#',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getJobs(): Promise<Job[]> {
  await delay(50);
  return jobs.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  await delay(50);
  return jobs.find(job => job.id === id);
}

export async function addJob(job: Omit<Job, 'id' | 'createdAt'>, skills: string[]): Promise<Job> {
  await delay(100);
  const newJob: Job = {
    ...job,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    skills,
  };
  jobs.push(newJob);
  return newJob;
}

export async function updateJob(id: string, updatedJob: Partial<Job>): Promise<Job | null> {
  await delay(100);
  const jobIndex = jobs.findIndex(job => job.id === id);
  if (jobIndex === -1) {
    return null;
  }
  jobs[jobIndex] = { ...jobs[jobIndex], ...updatedJob };
  return jobs[jobIndex];
}

export async function deleteJob(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = jobs.length;
  jobs = jobs.filter(job => job.id !== id);
  return jobs.length < initialLength;
}

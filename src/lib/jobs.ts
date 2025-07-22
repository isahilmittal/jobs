
'use server';

import { Job } from '@/lib/types';
// Firestore imports are removed.

// In-memory array to store jobs since Firestore is disconnected.
let memoryJobs: Job[] = [];
let initialized = false;

// Helper to create a deep copy and handle dates
const deepCopy = <T,>(obj: T): T => {
    const data = JSON.parse(JSON.stringify(obj));
    // Manually convert date strings back to Date objects
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item.createdAt) item.createdAt = new Date(item.createdAt);
            if (item.appliedAt) item.appliedAt = new Date(item.appliedAt);
        });
    } else if (data && data.createdAt) {
        data.createdAt = new Date(data.createdAt);
    } else if (data && data.appliedAt) {
        data.appliedAt = new Date(data.appliedAt);
    }
    return data;
};


function initializeMemoryJobs() {
    if (initialized) return;
    const initialJobs: Omit<Job, 'id'>[] = [
      {
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the 'client-side' of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
        tags: ["React", "TypeScript", "Next.js", "TailwindCSS"],
        applicationType: 'link',
        applyLink: "#",
        createdBy: 'admin@example.com',
        createdAt: new Date()
      },
      {
        title: "UX/UI Designer",
        description: "We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.",
        tags: ["Figma", "UX", "UI", "Prototyping"],
        applicationType: 'form',
        createdBy: 'manager@example.com',
        createdAt: new Date()
      },
       {
        title: "Cloud Solutions Architect",
        description: "Join our team as a Cloud Solutions Architect to design and implement robust, scalable, and secure cloud infrastructures. You'll work with cutting-edge cloud technologies and help our clients to migrate their workloads to the cloud.",
        tags: ["AWS", "Azure", "GCP", "DevOps", "Security"],
        applicationType: 'link',
        applyLink: "#",
        createdBy: 'admin@example.com',
        createdAt: new Date()
      },
      {
        title: "Product Manager - AI/ML",
        description: "Lead the development of our next-generation AI-powered products. You will own the product roadmap, work with engineering to define features, and be the voice of the customer within the company.",
        tags: ["Product Management", "AI", "Machine Learning", "Agile"],
        applicationType: 'form',
        createdBy: 'manager@example.com',
        createdAt: new Date()
      },
    ];

    memoryJobs = initialJobs.map((job, index) => ({
      ...job,
      id: `job-${index + 1}-${Date.now()}`,
      createdAt: new Date(new Date().setDate(new Date().getDate() - index)) // Spread out creation dates
    }));
    initialized = true;
}


export async function getJobs(includeExpired = false): Promise<Job[]> {
    initializeMemoryJobs();
    console.log("Using in-memory jobs data. Firestore is disconnected.");
    
    // Create a fresh copy to avoid mutation issues
    const jobsCopy = deepCopy(memoryJobs);

    const sortedJobs = jobsCopy.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (includeExpired) {
        return sortedJobs;
    }
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return sortedJobs.filter(job => new Date(job.createdAt) >= sevenDaysAgo);
}

export async function getJob(id: string): Promise<Job | null> {
    initializeMemoryJobs();
    const job = memoryJobs.find(j => j.id === id);
    return job ? deepCopy(job) : null;
}


export async function addJob(jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    initializeMemoryJobs();
    const newJob: Job = {
        ...jobData,
        id: `job-${memoryJobs.length + 1}-${Date.now()}`,
        createdAt: new Date(),
    };
    memoryJobs.push(newJob);
    return deepCopy(newJob);
}

export async function updateJob(jobId: string, jobData: Partial<Omit<Job, 'id' | 'createdAt' | 'createdBy'>>): Promise<void> {
    initializeMemoryJobs();
    const jobIndex = memoryJobs.findIndex(j => j.id === jobId);
    if (jobIndex > -1) {
        memoryJobs[jobIndex] = { ...memoryJobs[jobIndex], ...jobData };
    }
}

export async function deleteJob(jobId: string): Promise<void> {
    initializeMemoryJobs();
    memoryJobs = memoryJobs.filter(j => j.id !== jobId);
}

export async function addInitialJobs() {
    // This function is now just an alias for the initialization.
    initializeMemoryJobs();
}

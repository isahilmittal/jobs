
'use server';

// Firestore imports are removed.
import { Applicant, EnrichedApplicant, Job } from '@/lib/types';
import { getJobs } from './jobs';

// In-memory array to store applicants
let memoryApplicants: Applicant[] = [];

export async function addApplicant(applicantData: Omit<Applicant, 'id' | 'appliedAt'>): Promise<Applicant> {
    console.log("Using in-memory applicants data. Firestore is disconnected.");
    const newApplicant: Applicant = {
        ...applicantData,
        id: `applicant-${memoryApplicants.length + 1}-${Date.now()}`,
        appliedAt: new Date(),
    };
    memoryApplicants.push(newApplicant);
    return JSON.parse(JSON.stringify(newApplicant));
}


export async function getApplicants(): Promise<Applicant[]> {
    console.log("Using in-memory applicants data. Firestore is disconnected.");
    return JSON.parse(JSON.stringify(memoryApplicants.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())));
}

export async function getEnrichedApplicants(jobs?: Job[]): Promise<EnrichedApplicant[]> {
    const [applicants, allJobs] = await Promise.all([
        getApplicants(),
        jobs ? Promise.resolve(jobs) : getJobs(true) // Fetch all jobs for enrichment
    ]);

    const jobsMap = new Map(allJobs.map(job => [job.id, job.title]));
      
    const enrichedApplicants = applicants.map(applicant => ({
      ...applicant,
      jobTitle: jobsMap.get(applicant.jobId) || "Unknown Job (Expired)",
    }));

    return enrichedApplicants;
}

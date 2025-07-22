
'use server';

// Firestore imports are removed.
import { Applicant, EnrichedApplicant, Job } from '@/lib/types';
import { getJobs } from './jobs';

// In-memory array to store applicants
let memoryApplicants: Applicant[] = [];

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

export async function addApplicant(applicantData: Omit<Applicant, 'id' | 'appliedAt'>): Promise<Applicant> {
    console.log("Using in-memory applicants data. Firestore is disconnected.");
    const newApplicant: Applicant = {
        ...applicantData,
        id: `applicant-${memoryApplicants.length + 1}-${Date.now()}`,
        appliedAt: new Date(),
    };
    memoryApplicants.push(newApplicant);
    return deepCopy(newApplicant);
}


export async function getApplicants(): Promise<Applicant[]> {
    console.log("Using in-memory applicants data. Firestore is disconnected.");
    const applicantsCopy = deepCopy(memoryApplicants);
    return applicantsCopy.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
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

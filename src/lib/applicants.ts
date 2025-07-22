
'use server';

import { Applicant, EnrichedApplicant, Job } from '@/lib/types';
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    addDoc, 
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { getJobs } from './jobs';

const applicantsCollection = collection(db, 'applicants');

const applicantFromDoc = (doc: any): Applicant => {
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        appliedAt: (data.appliedAt as Timestamp).toDate(),
    } as Applicant;
};

export async function addApplicant(applicantData: Omit<Applicant, 'id' | 'appliedAt'>): Promise<Applicant> {
    const docRef = await addDoc(applicantsCollection, {
        ...applicantData,
        appliedAt: Timestamp.now(),
    });
    return { ...applicantData, id: docRef.id, appliedAt: new Date() };
}

export async function getApplicants(): Promise<Applicant[]> {
    const q = query(applicantsCollection, orderBy('appliedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(applicantFromDoc);
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

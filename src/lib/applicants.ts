
'use server';

import { db } from '@/lib/firebase';
import { Applicant, EnrichedApplicant, Job } from '@/lib/types';
import { collection, addDoc, getDocs, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { getJobs } from './jobs';

// Helper to convert Firestore Timestamps to Dates in an applicant object
function applicantFromDoc(docSnapshot: any): Applicant {
    const data = docSnapshot.data();
    return {
        ...data,
        id: docSnapshot.id,
        appliedAt: data.appliedAt instanceof Timestamp ? data.appliedAt.toDate() : new Date(data.appliedAt),
    };
}


export async function addApplicant(applicantData: Omit<Applicant, 'id' | 'appliedAt'>): Promise<Applicant> {
    const applicantsCol = collection(db, 'applicants');
    const docRef = await addDoc(applicantsCol, {
        ...applicantData,
        appliedAt: new Date(),
    });

    return {
        ...applicantData,
        id: docRef.id,
        appliedAt: new Date(),
    };
}


export async function getApplicants(): Promise<Applicant[]> {
    const applicantsCol = collection(db, 'applicants');
    const q = query(applicantsCol, orderBy('appliedAt', 'desc'));
    const applicantSnapshot = await getDocs(q);
    const applicantList = applicantSnapshot.docs.map(doc => applicantFromDoc(doc));
    return applicantList;
}

export async function getEnrichedApplicants(jobs?: Job[]): Promise<EnrichedApplicant[]> {
    const [applicants, allJobs] = await Promise.all([
        getApplicants(),
        jobs ? Promise.resolve(jobs) : getJobs() // Fetch jobs only if not provided
    ]);

    const jobsMap = new Map(allJobs.map(job => [job.id, job.title]));
      
    const enrichedApplicants = applicants.map(applicant => ({
      ...applicant,
      jobTitle: jobsMap.get(applicant.jobId) || "Unknown Job",
    }));

    return enrichedApplicants;
}

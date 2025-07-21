
'use server';

import { db } from '@/lib/firebase';
import { Applicant, EnrichedApplicant, Job } from '@/lib/types';
import { collection, addDoc, getDocs, doc, query, orderBy, Timestamp, serverTimestamp, getDoc } from 'firebase/firestore';
import { getJobs } from './jobs';

// Helper to convert Firestore Timestamps to Dates in an applicant object
function applicantFromDoc(docSnapshot: any): Applicant {
    const data = docSnapshot.data();
    const appliedAt = data.appliedAt;
    return {
        ...data,
        id: docSnapshot.id,
        appliedAt: appliedAt instanceof Timestamp ? appliedAt.toDate() : new Date(),
    };
}


export async function addApplicant(applicantData: Omit<Applicant, 'id' | 'appliedAt'>): Promise<Applicant> {
    const applicantsCol = collection(db, 'applicants');
    const docRef = await addDoc(applicantsCol, {
        ...applicantData,
        appliedAt: serverTimestamp(),
    });
    
    const newApplicantSnap = await getDoc(docRef);
    return applicantFromDoc(newApplicantSnap);
}


export async function getApplicants(): Promise<Applicant[]> {
    try {
        const applicantsCol = collection(db, 'applicants');
        const q = query(applicantsCol, orderBy('appliedAt', 'desc'));
        const applicantSnapshot = await getDocs(q);
        const applicantList = applicantSnapshot.docs.map(doc => applicantFromDoc(doc));
        return applicantList;
    } catch(e) {
        console.error("Error fetching applicants", e);
        return [];
    }
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

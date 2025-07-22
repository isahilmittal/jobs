
'use server';

import { Job } from '@/lib/types';
import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';

const jobsCollection = collection(db, 'jobs');

// Helper to convert Firestore Timestamps to Dates in a Job object
const jobFromDoc = (doc: any): Job => {
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        createdAt: (data.createdAt as Timestamp).toDate(),
    } as Job;
};

// Helper to convert Job object to a Firestore-compatible object
const jobToDoc = (jobData: Omit<Job, 'id' | 'createdAt'> | Partial<Omit<Job, 'id' | 'createdBy'>>) => {
    const data: any = { ...jobData };
    // No need to convert createdAt to Timestamp here as we will use serverTimestamp()
    // or it's already a Date object which Firestore handles.
    return data;
};

export async function getJobs(includeExpired = false): Promise<Job[]> {
    let jobsQuery = query(jobsCollection, orderBy('createdAt', 'desc'));
    
    if (!includeExpired) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        jobsQuery = query(jobsQuery, where('createdAt', '>=', Timestamp.fromDate(sevenDaysAgo)));
    }
    
    const querySnapshot = await getDocs(jobsQuery);
    return querySnapshot.docs.map(jobFromDoc);
}

export async function getJob(id: string): Promise<Job | null> {
    const docRef = doc(db, 'jobs', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? jobFromDoc(docSnap) : null;
}

export async function addJob(jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    const docData = jobToDoc(jobData);
    const docRef = await addDoc(jobsCollection, {
        ...docData,
        createdAt: Timestamp.now(),
    });
    const newDocSnap = await getDoc(docRef);
    return jobFromDoc(newDocSnap);
}

export async function updateJob(jobId: string, jobData: Partial<Omit<Job, 'id' | 'createdAt' | 'createdBy'>>): Promise<void> {
    const docRef = doc(db, 'jobs', jobId);
    await updateDoc(docRef, jobToDoc(jobData));
}

export async function deleteJob(jobId: string): Promise<void> {
    const docRef = doc(db, 'jobs', jobId);
    await deleteDoc(docRef);
}


// Function to seed initial jobs if the collection is empty.
export async function addInitialJobs() {
    const querySnapshot = await getDocs(jobsCollection);
    if (!querySnapshot.empty) {
        console.log("Jobs collection is not empty. Skipping initial data seed.");
        return;
    }
    
    console.log("Jobs collection is empty. Seeding initial data...");

    const initialJobs: Omit<Job, 'id' | 'createdAt'>[] = [
      {
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the 'client-side' of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
        responsibilities: [
            "Develop new user-facing features",
            "Build reusable code and libraries for future use",
            "Ensure the technical feasibility of UI/UX designs",
            "Optimize application for maximum speed and scalability"
        ],
        mustHaveSkills: ["React", "TypeScript", "Next.js"],
        industryType: "Technology, Information and Media",
        department: "Engineering",
        employmentType: "Full Time, Permanent",
        roleCategory: "Software Development",
        education: "UG: Any Graduate",
        tags: ["React", "TypeScript", "Next.js", "TailwindCSS"],
        applicationType: 'link',
        applyLink: "#",
        createdBy: 'admin@example.com',
      },
      {
        title: "UX/UI Designer",
        description: "We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.",
        responsibilities: [
            "Gather and evaluate user requirements in collaboration with product managers and engineers",
            "Illustrate design ideas using storyboards, process flows and sitemaps",
            "Design graphical user interface elements, like menus, tabs and widgets",
            "Develop UI mockups and prototypes that clearly illustrate how sites function and look like"
        ],
        mustHaveSkills: ["Figma", "Adobe XD"],
        industryType: "Technology, Information and Media",
        department: "Design",
        employmentType: "Full Time, Permanent",
        roleCategory: "UX & Design",
        education: "UG: Any Graduate in Design",
        tags: ["Figma", "UX", "UI", "Prototyping"],
        applicationType: 'form',
        createdBy: 'manager@example.com',
      },
    ];

    for (const jobData of initialJobs) {
        await addJob(jobData);
    }
    console.log("Initial jobs seeded successfully.");
}

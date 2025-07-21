
'use server';

import { db } from '@/lib/firebase';
import { Job } from '@/lib/types';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, getDoc, Timestamp } from 'firebase/firestore';

// Helper to convert Firestore Timestamps to Dates in a job object
function jobFromDoc(docSnapshot: any): Job {
    const data = docSnapshot.data();
    return {
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    };
}


export async function getJobs(): Promise<Job[]> {
    const jobsCol = collection(db, 'jobs');
    const q = query(jobsCol, orderBy('createdAt', 'desc'));
    const jobSnapshot = await getDocs(q);
    const jobList = jobSnapshot.docs.map(doc => jobFromDoc(doc));
    return jobList;
}

export async function getJob(id: string): Promise<Job | null> {
    const jobRef = doc(db, "jobs", id);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
        return jobFromDoc(jobSnap);
    } else {
        return null;
    }
}


export async function addJob(jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    const jobsCol = collection(db, 'jobs');
    const docRef = await addDoc(jobsCol, {
        ...jobData,
        createdAt: new Date(),
    });
    return {
        ...jobData,
        id: docRef.id,
        createdAt: new Date(),
    };
}

export async function updateJob(jobId: string, jobData: Partial<Omit<Job, 'id' | 'createdAt' | 'createdBy'>>): Promise<void> {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, jobData);
}

export async function deleteJob(jobId: string): Promise<void> {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
}

export async function addInitialJobs() {
    const initialJobs: Omit<Job, 'id'| 'createdAt'>[] = [
      {
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the 'client-side' of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
        tags: ["React", "TypeScript", "Next.js", "TailwindCSS"],
        applicationType: 'link',
        applyLink: "#",
        createdBy: 'admin@example.com',
      },
      {
        title: "UX/UI Designer",
        description: "We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.",
        tags: ["Figma", "UX", "UI", "Prototyping"],
        applicationType: 'form',
        createdBy: 'manager@example.com',
      },
       {
        title: "Cloud Solutions Architect",
        description: "Join our team as a Cloud Solutions Architect to design and implement robust, scalable, and secure cloud infrastructures. You'll work with cutting-edge cloud technologies and help our clients to migrate their workloads to the cloud.",
        tags: ["AWS", "Azure", "GCP", "DevOps", "Security"],
        applicationType: 'link',
        applyLink: "#",
        createdBy: 'admin@example.com',
      },
      {
        title: "Product Manager - AI/ML",
        description: "Lead the development of our next-generation AI-powered products. You will own the product roadmap, work with engineering to define features, and be the voice of the customer within the company.",
        tags: ["Product Management", "AI", "Machine Learning", "Agile"],
        applicationType: 'form',
        createdBy: 'manager@example.com',
      },
      {
        title: "Data Scientist",
        description: "We're looking for a Data Scientist to analyze large amounts of raw information to find patterns that will help improve our company. We will rely on you to build data products to extract valuable business insights.",
        tags: ["Python", "R", "SQL", "Big Data", "Statistics"],
        applicationType: 'link',
        applyLink: "#",
        createdBy: 'admin@example.com',
      },
      {
        title: "DevOps Engineer",
        description: "We are seeking a DevOps Engineer to help us build functional systems that improve customer experience. DevOps Engineer responsibilities include deploying product updates, identifying production issues and implementing integrations.",
        tags: ["Docker", "Kubernetes", "CI/CD", "Terraform", "Ansible"],
        applicationType: 'link',
        applyLink: "#",
        createdBy: 'manager@example.com',
      },
      {
        title: "Full-Stack Engineer",
        description: "We're hiring a Full-Stack Engineer to work on both our front-end and back-end services. You'll be building new features, fixing bugs, and improving the overall performance and reliability of our platform.",
        tags: ["Node.js", "React", "PostgreSQL", "GraphQL", "TypeScript"],
        applicationType: 'form',
        createdBy: 'admin@example.com',
      },
    ];

    for (const job of initialJobs) {
        await addJob(job);
    }
}

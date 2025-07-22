
import type { User as FirebaseUser } from 'firebase/auth';

export type Job = {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  mustHaveSkills: string[];
  industryType: string;
  department: string;
  employmentType: string;
  roleCategory: string;
  education: string;
  tags: string[];
  applicationType: 'link' | 'form';
  applyLink?: string;
  createdAt: Date;
  createdBy: string; // Admin user's email
};

export type Applicant = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  resume: string; // For simplicity, we'll store the file name or a placeholder
  coverLetter?: string;
  appliedAt: Date;
};

export type EnrichedApplicant = Applicant & {
  jobTitle: string;
};

export type Subscriber = {
    id: string;
    email: string;
    subscribedAt: Date;
};

// This is our internal User type, which might have more properties than Firebase's
export type User = {
    uid: string;
    email: string | null;
    password?: string; // Only used for mock auth, should not be stored
};

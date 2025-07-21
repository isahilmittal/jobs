
export type Job = {
  id: string;
  title: string;
  description: string;
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

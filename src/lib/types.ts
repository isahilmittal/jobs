export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  skills: string[];
  createdAt: number;
}

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

export interface JobFromDB {
  id: string;
  title: string;
  company: string;
  location:string;
  description: string;
  applyUrl: string;
  skills: string[];
  createdAt: string; // ISO 8601 string from Supabase
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    author: string;
    slug: string;
    imageUrl: string;
    createdAt: number;
}

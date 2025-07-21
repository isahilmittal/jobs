
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Job } from "@/lib/types";
import { JobCard } from "@/components/job-card";
import { JobForm } from "@/components/job-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Tag, X, Briefcase, Star } from "lucide-react";

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the 'client-side' of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications.",
    tags: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    applicationType: 'link',
    applyLink: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "2",
    title: "UX/UI Designer",
    description: "We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.",
    tags: ["Figma", "UX", "UI", "Prototyping"],
    applicationType: 'form',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: "3",
    title: "Cloud Solutions Architect",
    description: "Join our team as a Cloud Solutions Architect to design and implement robust, scalable, and secure cloud infrastructures. You'll work with cutting-edge cloud technologies and help our clients to migrate their workloads to the cloud.",
    tags: ["AWS", "Azure", "GCP", "DevOps", "Security"],
    applicationType: 'link',
    applyLink: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: "4",
    title: "Product Manager - AI/ML",
    description: "Lead the development of our next-generation AI-powered products. You will own the product roadmap, work with engineering to define features, and be the voice of the customer within the company.",
    tags: ["Product Management", "AI", "Machine Learning", "Agile"],
    applicationType: 'form',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
  },
  {
    id: "5",
    title: "Data Scientist",
    description: "We're looking for a Data Scientist to analyze large amounts of raw information to find patterns that will help improve our company. We will rely on you to build data products to extract valuable business insights.",
    tags: ["Python", "R", "SQL", "Big Data", "Statistics"],
    applicationType: 'link',
    applyLink: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
  {
    id: "6",
    title: "DevOps Engineer",
    description: "We are seeking a DevOps Engineer to help us build functional systems that improve customer experience. DevOps Engineer responsibilities include deploying product updates, identifying production issues and implementing integrations.",
    tags: ["Docker", "Kubernetes", "CI/CD", "Terraform", "Ansible"],
    applicationType: 'link',
    applyLink: "#",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: "7",
    title: "Full-Stack Engineer",
    description: "We're hiring a Full-Stack Engineer to work on both our front-end and back-end services. You'll be building new features, fixing bugs, and improving the overall performance and reliability of our platform.",
    tags: ["Node.js", "React", "PostgreSQL", "GraphQL", "TypeScript"],
    applicationType: 'form',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
  },
];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs && JSON.parse(storedJobs).length > 0) {
      setJobs(JSON.parse(storedJobs).map((j: Job) => ({...j, createdAt: new Date(j.createdAt)})));
    } else {
      setJobs(initialJobs);
      localStorage.setItem('jobs', JSON.stringify(initialJobs));
    }
  }, []);

  useEffect(() => {
    // Only update localStorage if jobs have been loaded
    if (jobs.length > 0) {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  }, [jobs]);

  const handleAddJob = (data: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setJobs((prevJobs) => [newJob, ...prevJobs]);
  };

  const handleEditJob = (data: Omit<Job, 'id' | 'createdAt'>) => {
    if (!jobToEdit) return;
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobToEdit.id ? { ...job, ...data, id: jobToEdit.id, createdAt: jobToEdit.createdAt } : job
      )
    );
    setJobToEdit(null);
  };
  
  const openEditForm = (job: Job) => {
    setJobToEdit(job);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setJobToEdit(null);
    setIsFormOpen(true);
  };
  
  const handleDeleteJob = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };
  
  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    jobs.forEach(job => job.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => job.tags.includes(tag));
      return searchMatch && tagsMatch;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [jobs, searchQuery, selectedTags]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="bg-card/80 border-b sticky top-0 z-20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Job Board Bonanza</h1>
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin</Link>
              </Button>
              <Button onClick={openAddForm} className="bg-primary/90 hover:bg-primary text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post a Job
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center mb-12 relative">
             <div className="absolute inset-0.5 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Find Your Next <span className="text-primary">Opportunity</span></h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Your one-stop shop for amazing career opportunities. Browse, search, and apply to your dream job today.</p>
          </div>
          
          <div className="mb-8 p-6 bg-card/50 border rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">Search Jobs</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by title, description, or tag..."
                    className="pl-10 h-11 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <Tag className="h-5 w-5 text-muted-foreground" />
                   <h3 className="text-sm font-medium text-foreground">Filter by Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 7).map(tag => (
                    <Badge 
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      onClick={() => toggleTagSelection(tag)}
                      className="cursor-pointer transition-all hover:scale-105"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {selectedTags.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="h-auto py-0.5 px-2">
                      <X className="mr-1 h-3 w-3" /> Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onEdit={openEditForm} onDelete={handleDeleteJob} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
              <Star className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No Jobs Found</h3>
              <p className="text-muted-foreground mt-2">No jobs found that match your criteria. Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
        
        <footer className="bg-card border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Job Board Bonanza. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <JobForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSubmit={jobToEdit ? handleEditJob : handleAddJob}
        jobToEdit={jobToEdit}
      />
    </>
  );
}

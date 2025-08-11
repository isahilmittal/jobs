'use client';

import { useState, useMemo } from 'react';
import type { Job } from '@/lib/types';
import JobCard from './JobCard';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface JobListingsProps {
  jobs: Job[];
}

export default function JobListings({ jobs }: JobListingsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = useMemo(() => {
    if (!searchTerm) {
      return jobs;
    }
    return jobs.filter(
      job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [jobs, searchTerm]);

  return (
    <div>
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search by title, company, or skill..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 py-6 text-base rounded-full shadow-sm"
            />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No jobs found</h2>
          <p className="text-muted-foreground">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
}

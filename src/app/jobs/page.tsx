import { getJobs } from '@/lib/actions';
import JobListings from '@/components/JobListings';

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="container mx-auto px-4 py-8">
      <JobListings jobs={jobs} />
    </div>
  );
}

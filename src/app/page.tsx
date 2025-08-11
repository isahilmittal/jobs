import { getJobs } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import JobCard from '@/components/JobCard';

export default async function Home() {
  const allJobs = await getJobs();
  const recentJobs = allJobs.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-green-400">
          Find Your Next Developer Job
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
          Analyzed.in uses the power of AI to curate and analyze the best tech jobs, so you can find the perfect fit, faster.
        </p>
        <Button size="lg" asChild className="bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20 hover:text-primary">
          <Link href="/jobs">
            Start Your Search <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Latest Job Openings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="mt-12 text-center">
            <Button asChild size="lg" variant="ghost">
                <Link href="/jobs">
                    View All Jobs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}

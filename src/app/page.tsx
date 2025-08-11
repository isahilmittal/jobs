import { getJobs } from '@/lib/actions';
import JobListings from '@/components/JobListings';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const jobs = await getJobs();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-green-400">
          Find Your Next Developer Job
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
          Analyzed.in uses the power of AI to curate and analyze the best tech jobs, so you can find the perfect fit, faster.
        </p>
        <Button size="lg" className="bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20 hover:text-primary">
          Start Your Search <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
      <JobListings jobs={jobs} />
    </div>
  );
}

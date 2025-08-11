import { getJobById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface JobDetailsPageProps {
  params: {
    id: string;
  };
}

const timeAgo = (date: number) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const job = await getJobById(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
            <Button asChild variant="ghost">
                <Link href="/jobs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Listings
                </Link>
            </Button>
        </div>
        <Card className="bg-secondary/30">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-3xl font-bold text-primary">{job.title}</CardTitle>
                    <Badge variant="outline" className="border-primary/50 text-primary/80 text-sm">{timeAgo(job.createdAt)}</Badge>
                </div>
                <CardDescription className="text-lg">
                    <div className="flex items-center gap-6 text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <span>{job.location}</span>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Job Description</h3>
                <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                    {job.description}
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">Required Skills</h3>
                <div className="flex flex-wrap gap-3">
                    {job.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-base py-1 px-4">
                        {skill}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
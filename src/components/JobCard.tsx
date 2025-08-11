import type { Job } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
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

  return (
    <Link href={`/jobs/${job.id}`} className="h-full">
      <Card className="flex flex-col h-full bg-secondary/30 hover:bg-secondary/50 transition-colors duration-300 group relative border-2 border-transparent hover:border-primary/50">
        <CardHeader>
          <div className='flex justify-between items-start'>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
            <Badge variant="outline" className="border-primary/50 text-primary/80">{timeAgo(job.createdAt)}</Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
              </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3 mb-4">{job.description}</p>
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map(skill => (
              <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 5 && <Badge variant="outline">+{job.skills.length - 5} more</Badge>}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
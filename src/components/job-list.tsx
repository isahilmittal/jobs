
"use client";

import Link from "next/link";
import { Job } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Link as LinkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface JobListProps {
  jobs: Job[];
  activeJobId?: string;
}

export function JobList({ jobs, activeJobId }: JobListProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card 
            key={job.id} 
            className={cn(
                "transition-all duration-200", 
                activeJobId === job.id ? "border-primary shadow-lg" : "hover:border-primary/50"
            )}
        >
          <CardHeader>
            <CardTitle className="text-md font-semibold">
                <Link href={job.applicationType === 'form' ? `/jobs/${job.id}` : '#'} className="hover:text-primary transition-colors">
                    {job.title}
                </Link>
            </CardTitle>
            <CardDescription className="flex items-center pt-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {job.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button asChild size="sm" className="w-full mt-4">
                {job.applicationType === 'link' ? (
                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                        Apply Externally <LinkIcon className="ml-2 h-4 w-4" />
                    </a>
                ) : (
                    <Link href={`/jobs/${job.id}`}>
                        View & Apply <FileText className="ml-2 h-4 w-4" />
                    </Link>
                )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

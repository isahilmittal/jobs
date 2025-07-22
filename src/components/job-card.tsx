
"use client";

import Link from "next/link";
import { Job } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Edit, Link as LinkIcon, MoreVertical, Trash2, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  showAdminActions: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, showAdminActions, onEdit, onDelete }: JobCardProps) {
  const ApplyButton = () => {
    if (job.applicationType === 'link') {
      return (
        <Button asChild className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
          <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
            Apply Now
            <LinkIcon className="ml-2 h-4 w-4" />
          </a>
        </Button>
      );
    }
    return (
      <Button asChild className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
        <Link href={`/jobs/${job.id}`}>
          Apply Now
          <FileText className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  };
  
  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card group border-border/60 hover:border-primary/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1 pr-2">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{job.title}</CardTitle>
            <CardDescription className="flex items-center pt-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
          {showAdminActions && onEdit && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(job)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this job posting.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(job.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, delete it
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">{job.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 4 && <Badge variant="outline">+{job.tags.length-4} more</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <ApplyButton />
      </CardFooter>
    </Card>
  );
}


"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Job } from '@/lib/types';
import { getJob, getJobs } from '@/lib/jobs';
import { addApplicant } from '@/lib/lib/applicants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Calendar, ChevronLeft, Loader2, Tag, FileText, Link as LinkIcon, Dot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { JobList } from '@/components/job-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  resume: z.any().refine(files => files?.length === 1, 'Resume is required.'),
  coverLetter: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

function ApplicationForm({ job, onFormSubmit }: { job: Job, onFormSubmit: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { name: '', email: '', coverLetter: '' },
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    await addApplicant({
      jobId: job.id,
      name: data.name,
      email: data.email,
      resume: data.resume[0].name,
      coverLetter: data.coverLetter,
    });
    setIsSubmitting(false);
    toast({
      title: 'Application Submitted!',
      description: 'Thank you for applying. We will be in touch.',
    });
    onFormSubmit();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="resume" render={({ field }) => (<FormItem><FormLabel>Resume (PDF, DOCX)</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="coverLetter" render={({ field }) => (<FormItem><FormLabel>Cover Letter (Optional)</FormLabel><FormControl><Textarea placeholder="Tell us why you're a great fit for this role..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Application</Button>
      </form>
    </Form>
  )
}


export default function JobApplicationPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function fetchJobData() {
      if (id) {
        setIsLoading(true);
        const [currentJob, jobsList] = await Promise.all([
            getJob(id),
            getJobs()
        ]);
        setJob(currentJob);
        setAllJobs(jobsList.filter(j => j.id !== id));
        setIsLoading(false);
      }
    }
    fetchJobData();
  }, [id]);

  const ApplyButton = () => {
    if (!job) return null;
    
    if (job.applicationType === 'link') {
        return (
            <Button asChild size="lg" className="w-full md:w-auto">
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                    Apply Now <LinkIcon className="ml-2 h-4 w-4"/>
                </a>
            </Button>
        )
    }

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">View & Apply <FileText className="ml-2 h-4 w-4"/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>Fill out the form below to submit your application.</DialogDescription>
                </DialogHeader>
                <ApplicationForm job={job} onFormSubmit={() => setIsFormOpen(false)} />
            </DialogContent>
        </Dialog>
    )
  }

  const MainContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    
    if (!job) {
      return (
          <div className="flex flex-col justify-center items-center h-full text-center p-8">
              <h1 className="text-2xl font-bold mb-4">Job not found</h1>
              <p className="text-muted-foreground mb-6">The job you are looking for does not exist or has been removed.</p>
              <Button asChild>
                  <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" />Back to Job Board</Link>
              </Button>
          </div>
      )
    }
    
    return (
        <ScrollArea className="h-full">
            <div className="p-6 md:p-8 space-y-8">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <CardTitle className="text-3xl font-bold text-primary">{job.title}</CardTitle>
                            <CardDescription className="flex items-center pt-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </CardDescription>
                        </div>
                        <div className="flex-shrink-0">
                           <ApplyButton />
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Separator className="my-6" />
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Job Description</h3>
                            <p className="text-muted-foreground">{job.description}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Job Responsibilities</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                {job.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Must-Have Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.mustHaveSkills.map(skill => (
                                    <Badge key={skill} variant="default">{skill}</Badge>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div>
                            <h3 className="text-xl font-semibold text-foreground mb-4">Role Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center"><Dot className="text-primary w-6 h-6 mr-2 flex-shrink-0" /><div><span className="font-semibold text-foreground">Industry: </span><span className="text-muted-foreground">{job.industryType}</span></div></div>
                                <div className="flex items-center"><Dot className="text-primary w-6 h-6 mr-2 flex-shrink-0" /><div><span className="font-semibold text-foreground">Department: </span><span className="text-muted-foreground">{job.department}</span></div></div>
                                <div className="flex items-center"><Dot className="text-primary w-6 h-6 mr-2 flex-shrink-0" /><div><span className="font-semibold text-foreground">Employment: </span><span className="text-muted-foreground">{job.employmentType}</span></div></div>
                                <div className="flex items-center"><Dot className="text-primary w-6 h-6 mr-2 flex-shrink-0" /><div><span className="font-semibold text-foreground">Category: </span><span className="text-muted-foreground">{job.roleCategory}</span></div></div>
                            </div>
                        </div>
                        
                         <div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Education</h3>
                            <p className="text-muted-foreground">{job.education}</p>
                        </div>

                         <div>
                            <div className="mt-6 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-md font-semibold text-foreground">Keywords</h3>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {job.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                  </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
  }

  return (
    <>
      <header className="bg-card/80 border-b sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Button variant="outline" size="sm" asChild>
                <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" />Back to Main</Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-bold text-foreground hidden sm:block">analyzed.in</h1>
            </Link>
        </div>
      </header>
      <div className="grid md:grid-cols-[1fr_350px] h-[calc(100vh-61px)]">
         <main className="border-r">
             <MainContent />
         </main>
         <aside className="hidden md:block">
             <ScrollArea className="h-full">
                 <div className="p-4">
                     <h2 className="text-xl font-bold mb-4">Other Jobs</h2>
                     <JobList jobs={allJobs} activeJobId={id} />
                 </div>
             </ScrollArea>
         </aside>
      </div>
    </>
  );
}

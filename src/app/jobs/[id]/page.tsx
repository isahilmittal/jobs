
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Job, Applicant } from '@/lib/types';
import { getJob } from '@/lib/jobs';
import { addApplicant } from '@/lib/applicants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Calendar, ChevronLeft, Loader2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  resume: z.any().refine(files => files?.length === 1, 'Resume is required.'),
  coverLetter: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function JobApplicationPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      email: '',
      coverLetter: '',
    },
  });

  useEffect(() => {
    async function fetchJob() {
      if (id) {
        const currentJob = await getJob(id);
        setJob(currentJob);
      }
      setIsLoading(false);
    }
    fetchJob();
  }, [id]);

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!job) return;

    setIsSubmitting(true);
    
    // In a real app, you would upload the resume to a file storage service (like Firebase Storage)
    // and store the URL. For simplicity, we are still just storing the name.
    
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
    router.push('/');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!job) {
    return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <h1 className="text-3xl font-bold mb-4">Job not found</h1>
            <p className="text-muted-foreground mb-6">The job you are looking for does not exist or has been removed.</p>
            <Button asChild>
                <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" />Back to Job Board</Link>
            </Button>
        </div>
    )
  }
  
  // If it's an external link job, redirect away or show a message.
  if (job.applicationType === 'link') {
    return (
       <div className="flex flex-col justify-center items-center h-screen text-center">
            <h1 className="text-3xl font-bold mb-4">External Application</h1>
            <p className="text-muted-foreground mb-6">This job requires you to apply on an external website.</p>
            <div className="flex gap-4">
                <Button variant="outline" asChild>
                    <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" />Back</Link>
                </Button>
                <Button asChild>
                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Proceed to Apply</a>
                </Button>
            </div>
        </div>
    )
  }

  return (
    <>
      <header className="bg-card/80 border-b sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Button variant="outline" size="sm" asChild>
                <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" />Back to Jobs</Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-bold text-foreground hidden sm:block">analyzed.in</h1>
            </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">{job.title}</CardTitle>
                <CardDescription className="flex items-center pt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                <div className="mt-6 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-md font-semibold text-foreground">Tags</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
                <CardDescription>Fill out the form below to submit your application.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="resume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume (PDF, DOCX)</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => field.onChange(e.target.files)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us why you're a great fit for this role..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Application
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

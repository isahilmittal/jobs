'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';
import type { Job } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
  applyUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
});

type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  job?: Job;
  action: (formData: FormData) => Promise<any>;
  onSuccess?: () => void;
}

export default function JobForm({ job, action, onSuccess }: JobFormProps) {
  const { toast } = useToast();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: job || {
      title: '',
      company: '',
      location: '',
      applyUrl: '',
      description: '',
    },
  });

  useEffect(() => {
    if (job) {
      form.reset(job);
    }
  }, [job, form]);

  const onSubmit = async (values: JobFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await action(formData);

    if (result?.success) {
      toast({
        title: job ? 'Job Updated' : 'Job Added',
        description: `The job "${values.title}" has been successfully ${job ? 'updated' : 'added'}.`,
      });
      form.reset();
      onSuccess?.();
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result?.error || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Frontend Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Innovate Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. San Francisco, CA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applyUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/apply" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the job responsibilities, requirements, etc." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {job ? 'Update Job' : 'Add Job'}
        </Button>
      </form>
    </Form>
  );
}

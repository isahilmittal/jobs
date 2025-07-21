"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateTags } from "@/ai/flows/generate-tags-from-job-description";
import { type Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const jobFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  tags: z.array(z.string()).min(1, "At least one tag is required."),
  applyLink: z.string().url("Please enter a valid URL."),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Job, "id" | "createdAt">) => void;
  jobToEdit?: Job | null;
}

export function JobForm({ isOpen, onOpenChange, onSubmit, jobToEdit }: JobFormProps) {
  const { toast } = useToast();
  const [isGeneratingTags, startTagGenerationTransition] = useTransition();
  const [tagInput, setTagInput] = useState("");

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      applyLink: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (jobToEdit) {
            form.reset({
                title: jobToEdit.title,
                description: jobToEdit.description,
                tags: jobToEdit.tags,
                applyLink: jobToEdit.applyLink,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                tags: [],
                applyLink: "",
            });
        }
    }
  }, [jobToEdit, form, isOpen]);

  const handleFormSubmit = (data: JobFormValues) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !form.getValues("tags").includes(newTag)) {
        form.setValue("tags", [...form.getValues("tags"), newTag], { shouldValidate: true });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue("tags", form.getValues("tags").filter(tag => tag !== tagToRemove), { shouldValidate: true });
  };
  
  const handleGenerateTags = async () => {
    const description = form.getValues("description");
    if (!description) {
      toast({
        variant: "destructive",
        title: "No description provided",
        description: "Please write a job description before generating tags.",
      });
      return;
    }

    startTagGenerationTransition(async () => {
      try {
        const result = await generateTags({ jobDescription: description });
        const existingTags = form.getValues("tags");
        const uniqueNewTags = result.tags.filter(tag => !existingTags.includes(tag));
        form.setValue("tags", [...existingTags, ...uniqueNewTags], { shouldValidate: true });
        toast({
          title: "Tags generated!",
          description: "AI-powered tags have been added.",
        });
      } catch (error) {
        console.error("Failed to generate tags:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate tags. Please try again.",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{jobToEdit ? 'Edit Job' : 'Add New Job'}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {jobToEdit ? 'update the' : 'post a new'} job.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
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
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>Job Description</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateTags} disabled={isGeneratingTags}>
                      {isGeneratingTags ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      )}
                      Generate Tags
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea rows={5} placeholder="Describe the role, responsibilities, and requirements..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Add tags and press Enter..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                       <div className="flex flex-wrap gap-2 p-2 rounded-md border min-h-[40px]">
                        {field.value.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button type="button" className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2" onClick={() => removeTag(tag)}>
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applyLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/apply" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{jobToEdit ? 'Save Changes' : 'Post Job'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

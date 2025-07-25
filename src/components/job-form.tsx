
"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateTags } from "@/ai/flows/generate-tags-from-job-description";
import { suggestJobDescription } from "@/ai/flows/suggest-job-description";
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
import { Loader2, Sparkles, Wand2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "./ui/scroll-area";

const jobFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  responsibilities: z.string().min(1, "Please list at least one responsibility."),
  mustHaveSkills: z.string().min(1, "Please list at least one skill."),
  industryType: z.string().min(1, "Industry is required."),
  department: z.string().min(1, "Department is required."),
  employmentType: z.string().min(1, "Employment type is required."),
  roleCategory: z.string().min(1, "Role category is required."),
  education: z.string().min(1, "Education is required."),
  tags: z.array(z.string()).min(1, "At least one tag is required."),
  applicationType: z.enum(['link', 'form']),
  applyLink: z.string().optional(),
}).refine(data => {
    if (data.applicationType === 'link') {
        return !!data.applyLink && z.string().url().safeParse(data.applyLink).success;
    }
    return true;
}, {
    message: "A valid URL is required for external link applications.",
    path: ["applyLink"],
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Job, "id" | "createdAt" | "createdBy">) => void;
  jobToEdit?: Job | null;
}

export function JobForm({ isOpen, onOpenChange, onSubmit, jobToEdit }: JobFormProps) {
  const { toast } = useToast();
  const [isGenerating, startGenerationTransition] = useTransition();
  const [tagInput, setTagInput] = useState("");

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      responsibilities: "",
      mustHaveSkills: "",
      industryType: "",
      department: "",
      employmentType: "",
      roleCategory: "",
      education: "",
      tags: [],
      applicationType: 'link',
      applyLink: "",
    },
  });

  const applicationType = form.watch("applicationType");

  useEffect(() => {
    if (isOpen) {
        if (jobToEdit) {
            form.reset({
                title: jobToEdit.title,
                description: jobToEdit.description,
                responsibilities: jobToEdit.responsibilities.join('\n'),
                mustHaveSkills: jobToEdit.mustHaveSkills.join(', '),
                industryType: jobToEdit.industryType,
                department: jobToEdit.department,
                employmentType: jobToEdit.employmentType,
                roleCategory: jobToEdit.roleCategory,
                education: jobToEdit.education,
                tags: jobToEdit.tags,
                applicationType: jobToEdit.applicationType,
                applyLink: jobToEdit.applicationType === 'link' ? jobToEdit.applyLink : "",
            });
        } else {
            form.reset({
                title: "",
                description: "",
                responsibilities: "",
                mustHaveSkills: "",
                industryType: "",
                department: "",
                employmentType: "",
                roleCategory: "",
                education: "",
                tags: [],
                applicationType: 'link',
                applyLink: "",
            });
        }
    }
  }, [isOpen, jobToEdit, form]);

  const handleFormSubmit = (data: JobFormValues) => {
    const finalData = {
      ...data,
      responsibilities: data.responsibilities.split('\n').filter(r => r.trim() !== ''),
      mustHaveSkills: data.mustHaveSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      applyLink: data.applicationType === 'link' ? data.applyLink : undefined,
    }
    onSubmit(finalData);
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
  
  const handleSuggestDescription = () => {
    const title = form.getValues("title");
    if (!title) {
      toast({
        variant: "destructive",
        title: "No title provided",
        description: "Please enter a job title before suggesting a description.",
      });
      return;
    }

    startGenerationTransition(async () => {
      try {
        const result = await suggestJobDescription({ jobTitle: title });
        form.setValue("description", result.jobDescription, { shouldValidate: true });
        toast({
          title: "Description suggested!",
          description: "An AI-powered description has been generated.",
        });
      } catch (error) {
        console.error("Failed to suggest description:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to suggest description. Please try again.",
        });
      }
    });
  };
  
  const handleGenerateTags = () => {
    const description = form.getValues("description");
    if (!description) {
      toast({
        variant: "destructive",
        title: "No description provided",
        description: "Please write a job description before generating tags.",
      });
      return;
    }

    startGenerationTransition(async () => {
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
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            form.reset();
        }
        onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{jobToEdit ? 'Edit Job' : 'Add New Job'}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {jobToEdit ? 'update the' : 'post a new'} job.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-4">
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
             <div className="flex justify-end items-center mb-2">
                <Button type="button" variant="outline" size="sm" onClick={handleSuggestDescription} disabled={isGenerating}>
                    {isGenerating ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : ( <Wand2 className="mr-2 h-4 w-4 text-primary" /> )}
                    Suggest
                </Button>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Provide a general overview of the job." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="List responsibilities, one per line." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mustHaveSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Must-Have Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter skills separated by commas, e.g., Skill 1, Skill 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="industryType" render={({ field }) => (<FormItem><FormLabel>Industry Type</FormLabel><FormControl><Input placeholder="e.g. Education / Training" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g. Teaching & Training" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="employmentType" render={({ field }) => (<FormItem><FormLabel>Employment Type</FormLabel><FormControl><Input placeholder="e.g. Full Time, Permanent" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="roleCategory" render={({ field }) => (<FormItem><FormLabel>Role Category</FormLabel><FormControl><Input placeholder="e.g. Administration & Staff" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
             <FormField control={form.control} name="education" render={({ field }) => (<FormItem><FormLabel>Education</FormLabel><FormControl><Input placeholder="e.g. UG: Any Graduate" {...field} /></FormControl><FormMessage /></FormItem>)} />

             <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between items-center mb-2">
                        <FormLabel>Tags</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={handleGenerateTags} disabled={isGenerating}>
                            {isGenerating ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Sparkles className="mr-2 h-4 w-4 text-primary" />)}
                            Generate Tags
                        </Button>
                    </div>
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
              name="applicationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Application Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="link" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          External Link
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="form" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Internal Form
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {applicationType === 'link' && (
              <FormField
                control={form.control}
                name="applyLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/apply" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {jobToEdit ? 'Save Changes' : 'Post Job'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

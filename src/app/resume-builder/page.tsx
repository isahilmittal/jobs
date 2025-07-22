
"use client";

import { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import { Briefcase, Plus, Trash2, Printer, Wand2, Loader2, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '@/hooks/use-toast';
import { enhanceResume, EnhanceResumeInput, EnhanceResumeOutput } from '@/ai/flows/enhance-resume';
import { parseResumeFromFile, ParseResumeOutput } from '@/ai/flows/parse-resume-from-file';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type Experience = {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  id: number;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
};

type Project = {
    id: number;
    title: string;
    description: string;
};

type ResumeData = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string;
  familyDetails: string;
  declaration: string;
};

type AiFeedback = Omit<EnhanceResumeOutput, 'enhancedSummary' | 'enhancedExperience'>;

// ATS-friendly resume template component
const ResumePreview = ({ data }: { data: ResumeData }) => {
    return (
        <div className="p-8 bg-white text-black font-sans text-sm shadow-lg">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-wider">{data.fullName || "Your Name"}</h1>
                <p className="text-xs mt-1">
                    {data.email || "your.email@example.com"}
                    {data.phone && ` | ${data.phone}`}
                    {data.linkedin && ` | ${data.linkedin}`}
                </p>
            </header>

            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Summary</h2>
                    <p className="text-sm">{data.summary}</p>
                </section>
            )}
            
            {data.experience.length > 0 && (
                 <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Experience</h2>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold">{exp.title || "Job Title"}</h3>
                                <p className="text-xs">{exp.startDate || "Start"} - {exp.endDate || "End"}</p>
                            </div>
                            <p className="italic text-sm">{exp.company || "Company Name"}</p>
                            <p className="text-sm whitespace-pre-wrap mt-1">{exp.description || "Job description..."}</p>
                        </div>
                    ))}
                </section>
            )}
            
            {data.projects.length > 0 && (
                 <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Projects</h2>
                    {data.projects.map(proj => (
                        <div key={proj.id} className="mb-4">
                           <h3 className="font-bold">{proj.title || "Project Title"}</h3>
                           <p className="text-sm whitespace-pre-wrap mt-1">{proj.description || "Project description..."}</p>
                        </div>
                    ))}
                </section>
            )}

            {data.education.length > 0 && (
                 <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Education</h2>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-2">
                             <div className="flex justify-between items-baseline">
                                <h3 className="font-bold">{edu.degree || "Degree"}</h3>
                                 <p className="text-xs">{edu.startDate || "Start"} - {edu.endDate || "End"}</p>
                            </div>
                            <p className="italic text-sm">{edu.school || "School Name"}</p>
                        </div>
                    ))}
                </section>
            )}

            {data.skills && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Skills</h2>
                    <p className="text-sm">{data.skills}</p>
                </section>
            )}

            {data.familyDetails && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Personal Details</h2>
                    <p className="text-sm whitespace-pre-wrap">{data.familyDetails}</p>
                </section>
            )}

            {data.declaration && (
                <section>
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Declaration</h2>
                    <p className="text-sm">{data.declaration}</p>
                </section>
            )}
        </div>
    );
};


export default function ResumeBuilderPage() {
    const [resumeData, setResumeData] = useState<ResumeData>({
        fullName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '123-456-7890',
        linkedin: 'linkedin.com/in/johndoe',
        summary: 'A highly motivated and results-oriented professional with 5+ years of experience in software development. Proven ability to lead projects and deliver high-quality code on time.',
        experience: [{
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Tech Solutions Inc.',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '- Led a team of 5 developers in the creation of a new client-facing web application.\n- Improved application performance by 30% through code optimization.\n- Mentored junior developers and conducted code reviews.'
        }],
        education: [{
            id: 1,
            degree: 'B.S. in Computer Science',
            school: 'State University',
            startDate: 'Aug 2016',
            endDate: 'May 2020',
        }],
        projects: [{
            id: 1,
            title: 'Personal Portfolio Website',
            description: '- Developed a responsive personal portfolio using Next.js and Tailwind CSS.\n- Deployed on Vercel with CI/CD integration.'
        }],
        skills: 'JavaScript, React, Next.js, TypeScript, Node.js, Python, SQL, AWS',
        familyDetails: 'Father\'s Name: Robert Doe\nMarital Status: Single',
        declaration: 'I hereby declare that all the information provided above is true to the best of my knowledge.'
    });
    
    const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
    const [isGenerating, startGenerationTransition] = useTransition();
    const [isParsing, startParsingTransition] = useTransition();
    const { toast } = useToast();
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePrint = useReactToPrint({
        content: () => resumePreviewRef.current,
        documentTitle: `${resumeData.fullName.replace(' ', '_')}_Resume`,
    });

    const handleInputChange = (field: keyof Omit<ResumeData, 'experience' | 'education' | 'projects'>, value: string) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const handleExperienceChange = (id: number, field: keyof Omit<Experience, 'id'>, value: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };
    
    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { id: Date.now(), title: '', company: '', startDate: '', endDate: '', description: '' }]
        }));
    };

    const removeExperience = (id: number) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };
    
    const handleEducationChange = (id: number, field: keyof Omit<Education, 'id'>, value: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };
    
    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { id: Date.now(), degree: '', school: '', startDate: '', endDate: '' }]
        }));
    };

    const removeEducation = (id: number) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const handleProjectChange = (id: number, field: keyof Omit<Project, 'id'>, value: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
        }));
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, { id: Date.now(), title: '', description: '' }]
        }));
    };

    const removeProject = (id: number) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter(proj => proj.id !== id)
        }));
    };
    
    const handleEnhanceResume = () => {
        const resumeInput: EnhanceResumeInput = {
            summary: resumeData.summary,
            experience: resumeData.experience.map(({id, ...rest}) => rest),
            skills: resumeData.skills,
        };

        startGenerationTransition(async () => {
            try {
                const result = await enhanceResume(resumeInput);
                setResumeData(prev => ({
                    ...prev,
                    summary: result.enhancedSummary,
                    experience: prev.experience.map((exp, index) => ({
                        ...exp,
                        description: result.enhancedExperience[index]?.enhancedDescription || exp.description
                    })),
                    skills: `${prev.skills}, ${result.suggestedSkills.join(', ')}`
                }));

                setAiFeedback({
                    feedback: result.feedback,
                    score: result.score,
                    suggestedSkills: result.suggestedSkills,
                });
                
                toast({ title: "Resume Enhanced!", description: "AI has updated your resume." });
            } catch (error) {
                console.error("Failed to enhance resume:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not enhance resume. Please try again." });
            }
        });
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const resumeDataUri = reader.result as string;
            startParsingTransition(async () => {
                try {
                    const result = await parseResumeFromFile({ resumeDataUri });
                    setResumeData({
                        fullName: result.fullName,
                        email: result.email,
                        phone: result.phone,
                        linkedin: result.linkedin || '',
                        summary: result.summary,
                        experience: result.experience.map(exp => ({...exp, id: Date.now() + Math.random()})),
                        education: result.education.map(edu => ({...edu, id: Date.now() + Math.random()})),
                        projects: result.projects.map(proj => ({...proj, id: Date.now() + Math.random()})),
                        skills: result.skills,
                        familyDetails: '', // These are not typically parsed
                        declaration: ''    // These are not typically parsed
                    });
                    setAiFeedback(null); // Clear previous feedback
                    toast({ title: "Resume Parsed!", description: "Your details have been imported." });
                } catch (error) {
                    console.error("Failed to parse resume:", error);
                    toast({ variant: "destructive", title: "Parsing Error", description: "Could not read resume. Please try a different file." });
                }
            });
        };
        reader.onerror = (error) => {
            console.error("File reading error:", error);
            toast({ variant: "destructive", title: "File Error", description: "Could not read the selected file." });
        };
    };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-card/80 border-b sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">analyzed.in</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">Home</Link>
            <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">Job Listings</Link>
            <Link href="/resume-builder" className="font-bold text-foreground">Resume Builder</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow grid md:grid-cols-2 gap-8 container mx-auto p-4">
        {/* Editor Panel */}
        <div className="bg-card p-6 rounded-lg shadow-md h-[calc(100vh-100px)] overflow-y-auto relative">
          {isParsing && (
            <div className="absolute inset-0 bg-black/60 z-10 flex flex-col justify-center items-center backdrop-blur-sm rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold">Parsing your resume...</p>
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold">Resume Editor</h2>
             <div className="flex gap-2">
                <Button onClick={handleEnhanceResume} variant="outline" disabled={isGenerating || isParsing}>
                    {isGenerating ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2 text-primary"/>}
                    Enhance with AI
                </Button>
                <Button onClick={handlePrint} disabled={isParsing}><Printer className="mr-2"/>Export to PDF</Button>
             </div>
          </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Upload className="text-primary"/>Import from File</CardTitle>
                    <CardDescription>Upload your existing resume (PDF, DOCX) to get started faster.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileChange}
                        disabled={isParsing}
                        className="file:text-primary file:font-semibold"
                    />
                </CardContent>
            </Card>


          {aiFeedback && (
            <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">AI Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold">Overall Score</h4>
                            <span className="font-bold text-primary">{aiFeedback.score}/100</span>
                        </div>
                        <Progress value={aiFeedback.score} className="h-2" />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Suggestions:</h4>
                        <p className="text-sm text-muted-foreground">{aiFeedback.feedback}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Suggested Skills to Add:</h4>
                         <div className="flex flex-wrap gap-2">
                            {aiFeedback.suggestedSkills.map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4 p-4 border rounded-md">
                <h3 className="font-semibold text-lg text-primary">Personal Details</h3>
                <Input placeholder="Full Name" value={resumeData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Email" value={resumeData.email} onChange={e => handleInputChange('email', e.target.value)} />
                    <Input placeholder="Phone Number" value={resumeData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                </div>
                <Input placeholder="LinkedIn Profile URL" value={resumeData.linkedin} onChange={e => handleInputChange('linkedin', e.target.value)} />
            </div>

            {/* Summary */}
             <div className="space-y-2 p-4 border rounded-md">
                 <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-primary">Professional Summary</h3>
                 </div>
                <Textarea placeholder="Write a brief summary of your career..." value={resumeData.summary} onChange={e => handleInputChange('summary', e.target.value)} rows={4}/>
            </div>
            
             {/* Work Experience */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary px-4">Work Experience</h3>
                {resumeData.experience.map(exp => (
                    <div key={exp.id} className="p-4 border rounded-md space-y-3 relative">
                         <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4"/></Button>
                         <Input placeholder="Job Title" value={exp.title} onChange={e => handleExperienceChange(exp.id, 'title', e.target.value)} />
                         <Input placeholder="Company" value={exp.company} onChange={e => handleExperienceChange(exp.id, 'company', e.target.value)} />
                         <div className="grid grid-cols-2 gap-4">
                             <Input placeholder="Start Date (e.g., Jan 2020)" value={exp.startDate} onChange={e => handleExperienceChange(exp.id, 'startDate', e.target.value)} />
                             <Input placeholder="End Date (e.g., Present)" value={exp.endDate} onChange={e => handleExperienceChange(exp.id, 'endDate', e.target.value)} />
                         </div>
                         <Textarea placeholder="Describe your responsibilities and achievements..." value={exp.description} onChange={e => handleExperienceChange(exp.id, 'description', e.target.value)} rows={5}/>
                    </div>
                ))}
                <Button variant="outline" onClick={addExperience} className="w-full"><Plus className="mr-2"/>Add Experience</Button>
            </div>

            <Separator />

            {/* Projects */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary px-4">Projects</h3>
                {resumeData.projects.map(proj => (
                    <div key={proj.id} className="p-4 border rounded-md space-y-3 relative">
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeProject(proj.id)}><Trash2 className="h-4 w-4"/></Button>
                        <Input placeholder="Project Title" value={proj.title} onChange={e => handleProjectChange(proj.id, 'title', e.target.value)} />
                        <Textarea placeholder="Describe your project..." value={proj.description} onChange={e => handleProjectChange(proj.id, 'description', e.target.value)} rows={3}/>
                    </div>
                ))}
                <Button variant="outline" onClick={addProject} className="w-full"><Plus className="mr-2"/>Add Project</Button>
            </div>
            
            <Separator />
            
            {/* Education */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary px-4">Education</h3>
                {resumeData.education.map(edu => (
                    <div key={edu.id} className="p-4 border rounded-md space-y-3 relative">
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEducation(edu.id)}><Trash2 className="h-4 w-4"/></Button>
                        <Input placeholder="Degree (e.g., B.S. in Computer Science)" value={edu.degree} onChange={e => handleEducationChange(edu.id, 'degree', e.target.value)} />
                        <Input placeholder="School/University" value={edu.school} onChange={e => handleEducationChange(edu.id, 'school', e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Start Date" value={edu.startDate} onChange={e => handleEducationChange(edu.id, 'startDate', e.target.value)} />
                            <Input placeholder="End Date" value={edu.endDate} onChange={e => handleEducationChange(edu.id, 'endDate', e.target.value)} />
                        </div>
                    </div>
                ))}
                 <Button variant="outline" onClick={addEducation} className="w-full"><Plus className="mr-2"/>Add Education</Button>
            </div>
            
            <Separator />

            {/* Skills */}
            <div className="space-y-2 p-4 border rounded-md">
                <h3 className="font-semibold text-lg text-primary">Skills</h3>
                <Textarea placeholder="Enter your skills, separated by commas..." value={resumeData.skills} onChange={e => handleInputChange('skills', e.target.value)} rows={3}/>
            </div>
            
            <Separator />
            
            {/* Family Details */}
            <div className="space-y-2 p-4 border rounded-md">
                <h3 className="font-semibold text-lg text-primary">Personal Details</h3>
                <Textarea placeholder="e.g., Father's Name, Marital Status..." value={resumeData.familyDetails} onChange={e => handleInputChange('familyDetails', e.target.value)} rows={3}/>
            </div>
            
            <Separator />

            {/* Declaration */}
            <div className="space-y-2 p-4 border rounded-md">
                <h3 className="font-semibold text-lg text-primary">Declaration</h3>
                <Textarea placeholder="Enter your declaration here..." value={resumeData.declaration} onChange={e => handleInputChange('declaration', e.target.value)} rows={3}/>
            </div>

          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-muted p-6 rounded-lg h-[calc(100vh-100px)] overflow-y-auto">
            <div ref={resumePreviewRef}>
              <ResumePreview data={resumeData} />
            </div>
        </div>
      </main>
    </div>
  );
}


"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Briefcase, Plus, Trash2, Printer, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useReactToPrint } from 'react-to-print';

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

type ResumeData = {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
};

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
                <section>
                    <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Skills</h2>
                    <p className="text-sm">{data.skills}</p>
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
        skills: 'JavaScript, React, Next.js, TypeScript, Node.js, Python, SQL, AWS'
    });
    
    const resumePreviewRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => resumePreviewRef.current,
        documentTitle: `${resumeData.fullName.replace(' ', '_')}_Resume`,
    });

    const handleInputChange = (field: keyof ResumeData, value: string) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const handleExperienceChange = (id: number, field: keyof Experience, value: string) => {
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
    
    const handleEducationChange = (id: number, field: keyof Education, value: string) => {
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
        <div className="bg-card p-6 rounded-lg shadow-md h-[calc(100vh-100px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold">Resume Editor</h2>
             <Button onClick={handlePrint}><Printer className="mr-2"/>Export to PDF</Button>
          </div>

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
                    <Button variant="outline" size="sm" disabled><Wand2 className="mr-2"/>AI Suggest</Button>
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


"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import Link from "next/link";
import { Job } from "@/lib/types";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tag, X, Star, Loader2, Mail, BarChart } from "lucide-react";
import { getJobs, addInitialJobs } from "@/lib/jobs";
import { addSubscriber } from "@/lib/subscribers";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubscribing, startSubscribeTransition] = useTransition();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      try {
        let fetchedJobs = await getJobs(true); // Fetch all jobs, including expired ones
        if (fetchedJobs.length === 0) {
          await addInitialJobs();
          fetchedJobs = await getJobs(true); // Re-fetch after seeding
        }
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load job listings." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please enter your email address.'});
          return;
      }
      startSubscribeTransition(async () => {
          const result = await addSubscriber(email);
          if (result.success) {
              toast({ title: 'Subscribed!', description: "Thanks for joining our newsletter."});
              setEmail("");
          } else {
              toast({ variant: 'destructive', title: 'Error', description: result.message });
          }
      });
  }

  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const allTags = useMemo(() => {
    if (isLoading || jobs.length === 0) return [];
    const tagsSet = new Set<string>();
    jobs.forEach(job => job.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [jobs, isLoading]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => job.tags.includes(tag));
      return searchMatch && tagsMatch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs, searchQuery, selectedTags]);


  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="bg-background/80 border-b sticky top-0 z-20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
             <Link href="/" className="flex items-center gap-2">
                <BarChart className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Analyzed.in</h1>
              </Link>
            <div className="flex items-center gap-2">
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">Home</Link>
                    <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">Services</Link>
                    <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
                    <Link href="/careers" className="font-bold text-foreground">Careers</Link>
                    <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
                </nav>
                <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center mb-12 relative">
             <div className="absolute inset-0.5 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Join Our <span className="text-primary">Team</span></h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">We're looking for passionate people to join us on our mission. Browse our open positions and find your next opportunity.</p>
          </div>
          
          <div className="mb-8 p-6 bg-card/50 border rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">Search Jobs</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by title, description, or tag..."
                    className="pl-10 h-11 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <Tag className="h-5 w-5 text-muted-foreground" />
                   <h3 className="text-sm font-medium text-foreground">Filter by Tags</h3>
                </div>
                 {isLoading ? (
                    <div className="flex flex-wrap gap-2">
                      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-20 rounded-full" />)}
                    </div>
                 ) : (
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 7).map(tag => (
                        <Badge 
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "secondary"}
                          onClick={() => toggleTagSelection(tag)}
                          className="cursor-pointer transition-all hover:scale-105"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {selectedTags.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="h-auto py-0.5 px-2">
                          <X className="mr-1 h-3 w-3" /> Clear
                        </Button>
                      )}
                    </div>
                 )}
              </div>
            </div>
          </div>
            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                            <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent>
                            <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                        </Card>
                    ))}
                </div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job, index) => (
                    <JobCard key={job.id} job={job} showAdminActions={false} animationDelay={index * 100} />
                ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
                <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No Jobs Found</h3>
                <p className="text-muted-foreground mt-2">No jobs found that match your criteria. Try adjusting your search or filters.</p>
                </div>
            )}
        </main>
        
        <footer className="bg-card border-t mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Stay Updated on New Jobs</h3>
                    <p className="text-muted-foreground mt-2">Subscribe to our newsletter to receive the latest job postings directly in your inbox.</p>
                </div>
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                    <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-background"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubscribing}
                        aria-label="Email for newsletter"
                    />
                    <Button type="submit" disabled={isSubscribing}>
                        {isSubscribing ? <Loader2 className="animate-spin"/> : <Mail />}
                        <span className="ml-2 hidden sm:inline">Subscribe</span>
                    </Button>
                </form>
            </div>
            <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Analyzed.in. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <Link href="/about" className="transition-colors hover:text-foreground">About Us</Link>
                    <Link href="/careers" className="transition-colors hover:text-foreground">Careers</Link>
                    <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
                </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

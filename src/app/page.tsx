
"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import Link from "next/link";
import { Job } from "@/lib/types";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tag, X, Briefcase, Star, LogIn, Loader2, Mail, Users, Info } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getJobs, addInitialJobs } from "@/lib/jobs";
import { addSubscriber } from "@/lib/subscribers";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribing, startSubscribeTransition] = useTransition();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
      
      let fetchedJobs = await getJobs();
      if (fetchedJobs.length === 0) {
        await addInitialJobs();
        fetchedJobs = await getJobs();
      }
      setJobs(fetchedJobs);

      setIsLoading(false);
    }
    fetchData();
  }, []);

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
    const tagsSet = new Set<string>();
    jobs.forEach(job => job.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [jobs]);

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
        <header className="bg-card/80 border-b sticky top-0 z-20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold text-foreground">analyzed.in</h1>
            </Link>
             <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                <Link href="/about" className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                    <Info className="h-4 w-4" /> About Us
                </Link>
                <Link href="/team" className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                    <Users className="h-4 w-4" /> Our Team
                </Link>
             </nav>
            {isLoggedIn ? (
                <Button asChild variant="default" size="sm">
                    <Link href="/admin">Admin Dashboard</Link>
                </Button>
            ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Admin Login</Link>
                </Button>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center mb-12 relative">
             <div className="absolute inset-0.5 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Find Your Next <span className="text-primary">Opportunity</span></h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Your one-stop shop for amazing career opportunities. Browse, search, and apply to your dream job today.</p>
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
              </div>
            </div>
          </div>
            {isLoading ? (
                 <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} showAdminActions={false} />
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
            <div className="mt-8 text-center text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} analyzed.in. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

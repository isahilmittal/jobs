
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Search, PenTool, Lightbulb, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';

export default function AgencyHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background/80 border-b sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <BarChart className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Analyzed.in</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
             <Link href="/" className="font-bold text-foreground">Home</Link>
            <Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">Job Listings</Link>
            <Link href="/resume-builder" className="text-muted-foreground transition-colors hover:text-foreground">Resume Builder</Link>
          </nav>
          <Button asChild>
            <Link href="/careers">Find a Job <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-center py-24 md:py-32 bg-background">
          <div className="absolute inset-0.5 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">
              Find Your Dream Job with <span className="text-primary">AI</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              Analyzed.in is an AI-powered job board and resume builder designed to help you land your next role faster.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/careers">Browse Jobs</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/resume-builder">Build Your Resume</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Features</h3>
              <p className="text-md text-muted-foreground mt-3 max-w-xl mx-auto">Everything you need for your job search.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Smart Job Search</h4>
                <p className="text-muted-foreground">Quickly find relevant job postings with our intelligent search and filtering tools.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <PenTool className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">AI Resume Builder</h4>
                <p className="text-muted-foreground">Create a professional, ATS-friendly resume and get AI-powered suggestions for improvement.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Career Resources</h4>
                <p className="text-muted-foreground">Access tips and articles to help you navigate the job market and advance your career.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Portfolio/Work Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Featured Companies</h3>
               <p className="text-md text-muted-foreground mt-3 max-w-xl mx-auto">Top companies are hiring on Analyzed.in</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 1" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="company logo" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h4 className="text-white text-lg font-bold">TechForward Inc.</h4>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 2" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="company logo" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <h4 className="text-white text-lg font-bold">Innovate Co.</h4>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 3" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="company logo" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <h4 className="text-white text-lg font-bold">QuantumLeap</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-card/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">What Our Users Say</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="p-6 bg-card">
                        <p className="text-muted-foreground mb-4">"Analyzed.in's resume builder helped me create a resume that got noticed. The AI suggestions were a game-changer. I landed my dream job in a month!"</p>
                        <div className="flex items-center gap-4">
                            <Image src="https://placehold.co/100x100.png" alt="Client 1" width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <p className="font-semibold">Jane Doe</p>
                                <p className="text-sm text-muted-foreground">Software Engineer</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-card">
                        <p className="text-muted-foreground mb-4">"The best job board I've used. The search is intuitive and the job descriptions are detailed. I highly recommend Analyzed.in to any job seeker."</p>
                        <div className="flex items-center gap-4">
                            <Image src="https://placehold.co/100x100.png" alt="Client 2" width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <p className="font-semibold">John Smith</p>
                                <p className="text-sm text-muted-foreground">Product Manager</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
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
  );
}

// Dummy Card component to avoid breaking changes if not present
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`bg-card rounded-lg border ${className}`}>{children}</div>
);

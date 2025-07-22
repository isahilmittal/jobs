
import Link from 'next/link';
import { BarChart, Building2, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-background/80 border-b sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <BarChart className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Analyzed.in</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">Home</Link>
            <Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">Job Listings</Link>
            <Link href="/resume-builder" className="text-muted-foreground transition-colors hover:text-foreground">Resume Builder</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">About <span className="text-primary">Analyzed.in</span></h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">We're on a mission to connect top talent with the world's most innovative companies.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Our Story</h3>
                <p className="text-muted-foreground mt-2">Founded in 2024, Analyzed.in started with a simple idea: to make the job search process more efficient, transparent, and human. We saw the disconnect between talented professionals and the companies that needed them, and we set out to build a bridge.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
                <p className="text-muted-foreground mt-2">Our mission is to empower career growth and organizational success by creating the most effective platform for discovering opportunities and hiring talent. We believe the right job can transform a person's life and the right person can transform a business.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Who We Are</h3>
                <p className="text-muted-foreground mt-2">We are a team of technologists, recruiters, and dreamers passionate about building a better future of work. We combine cutting-edge technology with a human-centric approach to create a job board that truly works for everyone.</p>
              </div>
            </div>
          </div>
          <div>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Office" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-xl"
              data-ai-hint="office team" 
            />
          </div>
        </div>
      </main>

      <footer className="bg-card border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Analyzed.in. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <Link href="/about" className="transition-colors hover:text-foreground">About Us</Link>
                    <Link href="/team" className="transition-colors hover:text-foreground">Our Team</Link>
                    <Link href="/login" className="transition-colors hover:text-foreground">Admin Login</Link>
                </div>
            </div>
          </div>
      </footer>
    </div>
  );
}

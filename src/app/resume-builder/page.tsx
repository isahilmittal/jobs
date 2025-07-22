
import Link from 'next/link';
import { Briefcase, Construction } from 'lucide-react';

export default function ResumeBuilderPage() {
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
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <Construction className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Resume Builder Coming Soon</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">We're working hard to bring you a powerful AI-driven resume builder. Stay tuned!</p>
        </div>
      </main>

      <footer className="bg-card border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} analyzed.in. All rights reserved.</p>
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


import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';


const teamMembers = [
  { name: 'Alex Johnson', role: 'CEO & Founder', avatar: 'AJ', image: 'https://placehold.co/300x300.png', hint: 'ceo portrait' },
  { name: 'Maria Garcia', role: 'Chief Technology Officer', avatar: 'MG', image: 'https://placehold.co/300x300.png', hint: 'engineer portrait' },
  { name: 'James Smith', role: 'Head of Product', avatar: 'JS', image: 'https://placehold.co/300x300.png', hint: 'manager portrait' },
  { name: 'Linda Kim', role: 'Lead UX Designer', avatar: 'LK', image: 'https://placehold.co/300x300.png', hint: 'designer portrait' },
  { name: 'Robert Brown', role: 'Senior Marketing Manager', avatar: 'RB', image: 'https://placehold.co/300x300.png', hint: 'marketer portrait' },
  { name: 'Patricia Miller', role: 'Head of Talent Acquisition', avatar: 'PM', image: 'https://placehold.co/300x300.png', hint: 'recruiter portrait' },
];

export default function TeamPage() {
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
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About Us</Link>
            <Link href="/team" className="font-bold text-foreground">Our Team</Link>
          </nav>
           <Button asChild variant="outline" size="sm" className="hidden md:flex">
             <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Meet the <span className="text-primary">Team</span></h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">The passionate individuals dedicated to revolutionizing the hiring landscape and connecting you with your future.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card group border-border/60 hover:border-primary/50">
              <CardHeader className="items-center">
                 <div className="relative w-32 h-32">
                    <Image 
                        src={member.image} 
                        alt={`Portrait of ${member.name}`}
                        width={128}
                        height={128}
                        className="rounded-full shadow-lg"
                        data-ai-hint={member.hint}
                    />
                 </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-card border-t">
          <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
             <p>&copy; {new Date().getFullYear()} analyzed.in. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}

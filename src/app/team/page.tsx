
import Link from 'next/link';
import { BarChart, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const teamMembers = [
  { 
      name: 'Sahil Mittal', 
      role: 'Developer / Head', 
      avatar: 'SM', 
      image: 'https://storage.googleapis.com/aifire-757c9.appspot.com/users%2FwYtc42jyfXhb16P3gevp62d5yC22%2Fprojects%2Fdefault%2F9f04153a812e4f02b3699c2d7658c14a.png', 
      hint: 'male developer portrait',
      bio: "Sahil leads our development team with a passion for clean code and scalable architecture. With over a decade of experience, he oversees all technical aspects of our client projects, ensuring robust and high-performance solutions. His expertise in both frontend and backend technologies allows him to guide projects from conception to deployment seamlessly."
  },
  { 
      name: 'Nitiesh Singh', 
      role: 'UI/UX / Content', 
      avatar: 'NS', 
      image: 'https://storage.googleapis.com/aifire-757c9.appspot.com/users%2FwYtc42jyfXhb16P3gevp62d5yC22%2Fprojects%2Fdefault%2F3a3d548b8989408b8813a07a14e9f905.png', 
      hint: 'male designer portrait',
      bio: "Nitiesh is the creative force behind our user-centric designs and compelling content strategies. He specializes in creating engaging user experiences that are not only visually appealing but also highly intuitive. Nitiesh works closely with clients to translate their brand's story into digital experiences that resonate with their audience."
  },
];

export default function TeamPage() {
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
            <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">Services</Link>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
            <Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">Careers</Link>
            <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Meet the <span className="text-primary">Leadership</span></h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">The passionate individuals dedicated to building your digital success story.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border/60 hover:border-primary/50 flex flex-col items-center p-8">
              <CardHeader className="items-center">
                 <div className="relative w-40 h-40">
                    <Avatar className="w-full h-full border-4 border-primary/50">
                        <AvatarImage 
                            src={member.image} 
                            alt={`Portrait of ${member.name}`}
                            data-ai-hint={member.hint}
                        />
                         <AvatarFallback className="text-4xl">{member.avatar}</AvatarFallback>
                    </Avatar>
                 </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <h3 className="text-2xl font-semibold text-foreground mt-4">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="text-muted-foreground mt-4 text-sm">{member.bio}</p>
              </CardContent>
              <CardFooter>
                  <div className="flex gap-4">
                      <Button variant="outline" size="icon" asChild>
                          <a href="#" aria-label={`${member.name}'s Twitter`}><Twitter className="h-5 w-5"/></a>
                      </Button>
                       <Button variant="outline" size="icon" asChild>
                          <a href="#" aria-label={`${member.name}'s LinkedIn`}><Linkedin className="h-5 w-5"/></a>
                      </Button>
                  </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-card border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Analyzed.in. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <Link href="/about" className="transition-colors hover:text-foreground">About Us</Link>
                    <Link href="/team" className="transition-colors hover:text-foreground">Our Team</Link>
                    <Link href="/careers" className="transition-colors hover:text-foreground">Careers</Link>
                </div>
            </div>
          </div>
      </footer>
    </div>
  );
}


"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Search, PenTool, Lightbulb, TrendingUp, Users, Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Lottie from 'lottie-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const marketingLottieUrl = "https://assets7.lottiefiles.com/packages/lf20_t87p9b6w.json";
const webDevLottieUrl = "https://assets1.lottiefiles.com/packages/lf20_caugh3q3.json";
const aiSolutionsLottieUrl = "https://assets10.lottiefiles.com/packages/lf20_bwnh5sre.json";

const portfolio = [
    {
        title: 'Hook Adhesives Website',
        description: 'Redesigned the website and implemented SEO strategies for hookadhesives.com, resulting in a 120% increase in lead generation.',
        tags: ['Web Design', 'SEO'],
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'adhesive product website',
        link: '#',
    },
    {
        title: 'Zanko.in Website',
        description: 'Developed and optimized the website for zanko.in, improving user experience and increasing conversion rates by 85%.',
        tags: ['Web Design', 'SEO', 'UX/UI'],
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'ecommerce website',
        link: '#',
    },
    {
        title: 'Swabhiman Ki Awaj',
        description: 'Created a responsive website for Swabhiman Ki Awaj organization, focusing on accessibility and user engagement while supporting their social mission.',
        tags: ['Web Design', 'SEO', 'Non-Profit'],
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'organization website',
        link: '#',
    },
];

const team = [
    {
        name: 'Sahil Mittal',
        role: 'Developer / Head',
        description: 'Leads our development team and oversees all technical aspects of our client projects.',
        avatar: 'SM',
        image: 'https://storage.googleapis.com/aifire-757c9.appspot.com/users%2FwYtc42jyfXhb16P3gevp62d5yC22%2Fprojects%2Fdefault%2F9f04153a812e4f02b3699c2d7658c14a.png',
        imageHint: 'male developer portrait'
    },
    {
        name: 'Nitiesh Singh',
        role: 'UI/UX / Content',
        description: 'Creates engaging user experiences and develops compelling content for our clients.',
        avatar: 'NS',
        image: 'https://storage.googleapis.com/aifire-757c9.appspot.com/users%2FwYtc42jyfXhb16P3gevp62d5yC22%2Fprojects%2Fdefault%2F3a3d548b8989408b8813a07a14e9f905.png',
        imageHint: 'male designer portrait'
    }
];


export default function AgencyHomePage() {
  return (
    <ParallaxProvider>
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
            <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">Services</Link>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
            <Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">Careers</Link>
            <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>
          <Button asChild>
            <Link href="/contact">Get a Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-center py-24 md:py-32 bg-background overflow-hidden">
          <Parallax translateY={[-20, 20]}>
            <div className="absolute inset-0.5 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </Parallax>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tighter">
              Digital Marketing & Web Solutions by <span className="text-primary">Analyzed.in</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              We build data-driven strategies and stunning websites to help your business grow. Your success is our code.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/services">Our Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/careers">View Job Openings</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">What We Do</h3>
              <p className="text-md text-muted-foreground mt-3 max-w-xl mx-auto">Driving growth with a full suite of digital services.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                 <div className="h-32 flex justify-center items-center">
                    <Lottie path={marketingLottieUrl} loop={true} style={{height: 150}}/>
                 </div>
                <h4 className="text-xl font-semibold mb-2 mt-4">Digital Marketing</h4>
                <p className="text-muted-foreground">From SEO to PPC, we create campaigns that convert and build your brand's online presence.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                 <div className="h-32 flex justify-center items-center">
                    <Lottie path={webDevLottieUrl} loop={true} style={{height: 150}}/>
                 </div>
                <h4 className="text-xl font-semibold mb-2 mt-4">Web Development</h4>
                <p className="text-muted-foreground">We design and build beautiful, high-performance websites tailored to your business needs.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                 <div className="h-32 flex justify-center items-center">
                    <Lottie path={aiSolutionsLottieUrl} loop={true} style={{height: 150}}/>
                 </div>
                <h4 className="text-xl font-semibold mb-2 mt-4">AI-Powered Solutions</h4>
                <p className="text-muted-foreground">Leverage our expertise in AI to build innovative features, like the integrated job platform.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Portfolio/Work Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Our Work</h3>
               <p className="text-md text-muted-foreground mt-3 max-w-xl mx-auto">We're proud of the solutions we've delivered.</p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {portfolio.map((item, index) => (
                    <Card key={index} className="flex flex-col overflow-hidden bg-card/50 transition-shadow hover:shadow-xl">
                        <CardHeader className="p-0">
                             <Image src={item.imageUrl} alt={item.title} width={600} height={400} className="w-full" data-ai-hint={item.imageHint} />
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                            <p className="text-muted-foreground mb-4">{item.description}</p>
                             <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Button asChild variant="outline">
                                <a href={item.link} target="_blank" rel="noopener noreferrer">Visit Website <ExternalLink className="ml-2 h-4 w-4" /></a>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-card/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                   {team.map((member, index) => (
                     <Card key={index} className="p-6 bg-card">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-2 border-primary">
                                <AvatarImage src={member.image} alt={`Portrait of ${member.name}`} data-ai-hint={member.imageHint} />
                                <AvatarFallback>{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="text-lg font-semibold">{member.name}</h4>
                                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                                <p className="text-muted-foreground text-sm">{member.description}</p>
                            </div>
                        </div>
                    </Card>
                   ))}
                </div>
                 <div className="text-center mt-12">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/team">More About Us</Link>
                    </Button>
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
                    <Link href="/services" className="transition-colors hover:text-foreground">Services</Link>
                    <Link href="/careers" className="transition-colors hover:text-foreground">Careers</Link>
                    <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
    </ParallaxProvider>
  );
}

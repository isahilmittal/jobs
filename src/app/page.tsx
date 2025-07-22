
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Search, PenTool, Lightbulb, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

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
        <section className="relative text-center py-24 md:py-32 bg-background">
          <div className="absolute inset-0.5 bg-primary/10 rounded-full blur-3xl -z-10"></div>
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
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Digital Marketing</h4>
                <p className="text-muted-foreground">From SEO to PPC, we create campaigns that convert and build your brand's online presence.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <PenTool className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Web Development</h4>
                <p className="text-muted-foreground">We design and build beautiful, high-performance websites tailored to your business needs.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">AI-Powered Solutions</h4>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 1" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="website screenshot" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h4 className="text-white text-lg font-bold">E-Commerce Platform</h4>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 2" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="marketing dashboard" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <h4 className="text-white text-lg font-bold">SaaS Analytics Dashboard</h4>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 3" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="mobile app" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <h4 className="text-white text-lg font-bold">Mobile App for Startups</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-card/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">What Our Clients Say</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="p-6 bg-card">
                        <p className="text-muted-foreground mb-4">"Analyzed.in transformed our online presence. Their data-driven approach to SEO doubled our organic traffic in just six months. A truly professional and effective team."</p>
                        <div className="flex items-center gap-4">
                            <Image src="https://placehold.co/100x100.png" alt="Client 1" width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <p className="font-semibold">Jane Doe</p>
                                <p className="text-sm text-muted-foreground">CEO, TechForward Inc.</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-card">
                        <p className="text-muted-foreground mb-4">"The website Analyzed.in built for us is not only beautiful but also incredibly fast and user-friendly. Our conversion rates have seen a significant boost since the launch."</p>
                        <div className="flex items-center gap-4">
                            <Image src="https://placehold.co/100x100.png" alt="Client 2" width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <p className="font-semibold">John Smith</p>
                                <p className="text-sm text-muted-foreground">Marketing Director, Innovate Co.</p>
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
                    <Link href="/services" className="transition-colors hover:text-foreground">Services</Link>
                    <Link href="/careers" className="transition-colors hover:text-foreground">Careers</Link>
                    <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}


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
            <h1 className="text-xl font-bold text-foreground">Stellar Digital</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
              Amplify Your Brand's <span className="text-primary">Digital Presence</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              We are a results-driven digital marketing agency specializing in SEO, content strategy, and PPC to help you achieve stellar growth.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/services">Our Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">What We Do</h3>
              <p className="text-md text-muted-foreground mt-3 max-w-xl mx-auto">Our expertise spans the full digital marketing spectrum.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Search Engine Optimization</h4>
                <p className="text-muted-foreground">Boost your organic traffic and climb the search rankings with our proven SEO strategies.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <PenTool className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Content Marketing</h4>
                <p className="text-muted-foreground">Engage your audience and build authority with high-quality, compelling content.</p>
              </Card>
              <Card className="p-8 text-center bg-card shadow-lg transition-transform hover:-translate-y-2">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">PPC Campaigns</h4>
                <p className="text-muted-foreground">Drive targeted leads and maximize ROI with our expertly managed pay-per-click campaigns.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Portfolio/Work Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Our Work</h3>
              <p className="text-md text-muted-foreground mt-3 max-w-xl mx-auto">We're proud of the results we've delivered.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 1" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="marketing project" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h4 className="text-white text-lg font-bold">E-commerce SEO Growth</h4>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 2" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="analytics dashboard" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <h4 className="text-white text-lg font-bold">SaaS Content Strategy</h4>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" alt="Project 3" width={600} height={400} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="social media campaign" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <h4 className="text-white text-lg font-bold">Local Business PPC</h4>
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
                        <p className="text-muted-foreground mb-4">"Stellar Digital transformed our online presence. Their SEO expertise led to a 200% increase in organic traffic in just six months. Highly recommended!"</p>
                        <div className="flex items-center gap-4">
                            <Image src="https://placehold.co/100x100.png" alt="Client 1" width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <p className="font-semibold">Jane Doe</p>
                                <p className="text-sm text-muted-foreground">CEO, TechForward</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-card">
                        <p className="text-muted-foreground mb-4">"The best digital marketing team we've ever worked with. Their content strategy was a game-changer for our brand engagement."</p>
                        <div className="flex items-center gap-4">
                            <Image src="https://placehold.co/100x100.png" alt="Client 2" width={48} height={48} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <p className="font-semibold">John Smith</p>
                                <p className="text-sm text-muted-foreground">Founder, Innovate Co.</p>
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
                <p>&copy; {new Date().getFullYear()} Stellar Digital. All rights reserved.</p>
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

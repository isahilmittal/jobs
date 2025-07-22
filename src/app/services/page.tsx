
import Link from 'next/link';
import { BarChart, Search, PenTool, Lightbulb, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';

const services = [
  {
    icon: Search,
    title: 'Search Engine Optimization (SEO)',
    description: 'Our SEO services are designed to increase your visibility within the algorithmic ("natural", "organic", or "free") search results to deliver high quality, targeted traffic to your website.',
    features: ['Keyword Research & Strategy', 'On-Page SEO', 'Technical SEO', 'Link Building', 'Local SEO'],
  },
  {
    icon: Lightbulb,
    title: 'Pay-Per-Click (PPC) Advertising',
    description: 'Drive immediate, qualified traffic to your site. We create, manage, and optimize PPC campaigns on Google Ads and social media platforms to maximize your return on investment.',
    features: ['Campaign Strategy & Setup', 'Ad Copywriting & A/B Testing', 'Bid Management', 'Performance Tracking', 'Landing Page Optimization'],
  },
  {
    icon: PenTool,
    title: 'Content Marketing',
    description: 'Engage and attract your target audience with high-quality, relevant content. From blog posts to whitepapers, we create content that builds brand authority and drives conversions.',
    features: ['Content Strategy & Calendar', 'Blog & Article Writing', 'Video & Infographic Creation', 'Content Distribution', 'Performance Analysis'],
  },
  {
    icon: Users,
    title: 'Social Media Marketing',
    description: 'Build a strong brand community and drive engagement across social platforms. We manage your social presence, creating and curating content that resonates with your followers.',
    features: ['Platform Management (Facebook, Instagram, LinkedIn)', 'Content Creation & Curation', 'Community Management', 'Social Advertising', 'Analytics & Reporting'],
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-background/80 border-b sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <BarChart className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Analyzed.in</h1>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">Home</Link>
                <Link href="/services" className="font-bold text-foreground">Services</Link>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
                <Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">Careers</Link>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Our Digital Marketing <span className="text-primary">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A comprehensive suite of services to elevate your brand and drive measurable results.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col bg-card/50 transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-start gap-4 p-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">{service.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{service.description}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
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
              <Link href="/careers" className="transition-colors hover:text-foreground">Careers</Link>
              <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


"use client";

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BarChart, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 bg-card/50">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel>Company (Optional)</FormLabel><FormControl><Input placeholder="Your Company" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel>Your Message</FormLabel><FormControl><Textarea rows={5} placeholder="How can we help you?" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Send Message
                </Button>
              </form>
            </Form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Email</h4>
                  <p className="text-muted-foreground">General Inquiries</p>
                  <a href="mailto:contact@analyzed.in" className="text-primary hover:underline">contact@analyzed.in</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Phone</h4>
                  <p className="text-muted-foreground">Mon-Fri, 9am-5pm</p>
                  <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Office</h4>
                  <p className="text-muted-foreground">123 Digital Ave, Suite 100</p>
                  <p className="text-primary">New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
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

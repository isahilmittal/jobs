'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo />
        <nav>
          <Button asChild variant="ghost">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Admin Login
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

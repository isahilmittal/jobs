import { Briefcase } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
        <Briefcase className="h-6 w-6 text-primary" />
      </div>
      <span className="text-xl font-bold text-foreground">
        Job<span className="text-primary">Scout</span>
      </span>
    </Link>
  );
}

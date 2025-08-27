import type { Blog } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  blog: Blog;
}

const timeAgo = (date: number) => {
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    return "today";
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`} className="h-full block group">
      <Card className="flex flex-col h-full bg-secondary/30 hover:bg-secondary/50 transition-colors duration-300 relative border-2 border-transparent hover:border-primary/50">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint="technical blog"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <CardTitle className="text-xl group-hover:text-primary transition-colors mb-2 line-clamp-2">{blog.title}</CardTitle>
          <p className="text-muted-foreground line-clamp-3 mb-4">{blog.content}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
                <div className='flex items-center gap-2'>
                    <User className="h-4 w-4" />
                    <span>{blog.author}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <Calendar className="h-4 w-4" />
                    <span>{timeAgo(blog.createdAt)}</span>
                </div>
            </div>
            <ArrowRight className="h-5 w-5 group-hover:text-primary transform-gpu transition-transform group-hover:translate-x-1" />
        </CardFooter>
      </Card>
    </Link>
  );
}

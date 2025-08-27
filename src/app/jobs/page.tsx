import { getJobs, getBlogs } from '@/lib/actions';
import JobListings from '@/components/JobListings';
import BlogCard from '@/components/BlogCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function JobsPage() {
  const jobs = await getJobs();
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto px-4 py-8">
      <JobListings jobs={jobs} />

      <section className="py-16">
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">From the Blog</h2>
            {/* <Link href="/blog" className="flex items-center gap-2 text-primary hover:underline">
                View All Posts <ArrowRight className="h-4 w-4" />
            </Link> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}

import { getJobs } from '@/lib/store';
import JobForm from '@/components/JobForm';
import AdminJobList from '@/components/AdminJobList';
import { addJobAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  const jobs = await getJobs();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Job</CardTitle>
              <CardDescription>Fill out the form to post a new job listing.</CardDescription>
            </CardHeader>
            <CardContent>
              <JobForm action={addJobAction} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
                <CardTitle>Manage Jobs</CardTitle>
                <CardDescription>Edit or delete existing job listings.</CardDescription>
            </CardHeader>
            <CardContent>
                <AdminJobList jobs={jobs} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

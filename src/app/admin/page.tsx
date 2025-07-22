
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User as FirebaseUser } from 'firebase/auth';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";

import { Job } from "@/lib/types";
import { getJobs, addJob, updateJob, deleteJob } from "@/lib/jobs";
import { getApplicants } from "@/lib/applicants";
import { getSubscriberCount } from "@/lib/subscribers";
import { JobForm } from "@/components/job-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Briefcase, MoreHorizontal, PlusCircle, Trash2, Edit, LogOut, UserPlus, Users, Loader2, FileText, ArrowRight, Mail, Info } from "lucide-react";
import withAuth from "@/components/with-auth";
import { logout, getCurrentUserWithRole, getAllAdminUsers, type UserRole, type AdminUser, ensureSuperAdminExists } from "@/lib/auth";

type AdminStaff = Omit<AdminUser, 'password'>;


function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentUser, setCurrentUser] = useState<{ user: FirebaseUser; role: UserRole } | null>(null);
  const [adminStaff, setAdminStaff] = useState<AdminStaff[]>([]);
  const [applicantCount, setApplicantCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        await ensureSuperAdminExists();
        const userWithRole = await getCurrentUserWithRole();
        
        if (!userWithRole) {
          router.push('/login');
          return;
        }
        setCurrentUser(userWithRole);
        
        const promises: any[] = [
            getJobs(true), 
            getApplicants(), 
            getSubscriberCount()
        ];
        
        if (userWithRole.role === 'SUPER_ADMIN') {
            promises.push(getAllAdminUsers());
        }

        const [fetchedJobs, fetchedApplicants, fetchedSubscribers, fetchedAdminStaff] = await Promise.all(promises);

        setJobs(fetchedJobs);
        setApplicantCount(fetchedApplicants.length);
        setSubscriberCount(fetchedSubscribers);
        if(fetchedAdminStaff) {
          setAdminStaff(fetchedAdminStaff);
        }

    } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast({variant: "destructive", title: "Error", description: "Could not load dashboard data."})
    } finally {
        setIsLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleAddJob = async (data: Omit<Job, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!currentUser?.user.email) {
      toast({variant: "destructive", title: "Error", description: "You must be logged in to create a job."});
      router.push('/login');
      return;
    }
    await addJob({
      ...data,
      createdBy: currentUser.user.email,
    });
    toast({title: "Success", description: "Job posted successfully."});
    fetchData();
  };

  const handleEditJob = async (data: Omit<Job, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!jobToEdit) return;
    await updateJob(jobToEdit.id, data);
    setJobToEdit(null);
    toast({title: "Success", description: "Job updated successfully."});
    fetchData();
  };
  
  const openEditForm = (job: Job) => {
    setJobToEdit(job);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setJobToEdit(null);
    setIsFormOpen(true);
  };
  
  const handleDeleteJob = async (jobId: string) => {
    await deleteJob(jobId);
    toast({title: "Success", description: "Job deleted successfully."});
    fetchData();
  };

  
  const jobColumns: ColumnDef<Job>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags: string[] = row.getValue("tags");
        return (
          <div className="flex flex-wrap gap-1 w-48">
            {tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            {tags.length > 3 && <Badge variant="outline">+{tags.length - 3}</Badge>}
          </div>
        );
      }
    },
    { accessorKey: "createdBy", header: "Posted By" },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Posted On <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isExpired = date < sevenDaysAgo;
        return (
            <div className="flex items-center">
                <span>{format(date, "MMM d, yyyy")}</span>
                {isExpired && <Badge variant="destructive" className="ml-2">Expired</Badge>}
            </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openEditForm(job)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete this job posting.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteJob(job.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, delete job</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      },
    }
  ];

  const adminColumns: ColumnDef<AdminStaff>[] = [
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role", cell: ({row}) => <Badge variant={row.original.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>{row.original.role}</Badge> },
  ];

  const jobTable = useReactTable({ data: jobs, columns: jobColumns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), onSortingChange: setSorting, getSortedRowModel: getSortedRowModel(), state: { sorting } });
  const adminTable = useReactTable({ data: adminStaff, columns: adminColumns, getCoreRowModel: getCoreRowModel() });


  if(isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-muted-foreground">
        <header className="bg-card/80 border-b sticky top-0 z-10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <nav className="flex items-center gap-4 text-sm font-medium">
               <Link href="/" className="flex items-center gap-2 text-foreground">
                <Briefcase className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-bold">Admin Dashboard</h1>
               </Link>
               <Link href="/admin" className="font-bold text-foreground transition-colors hover:text-foreground">Jobs</Link>
               <Link href="/admin/applicants" className="text-muted-foreground transition-colors hover:text-foreground">Applicants</Link>
            </nav>
             <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Welcome, {currentUser?.user.email}</span>
                <Badge variant={currentUser?.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>{currentUser?.role}</Badge>
                <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow">
          <section className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{jobs.filter(job => { const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); return new Date(job.createdAt) >= sevenDaysAgo; }).length}</div>
                        <p className="text-xs text-muted-foreground">Jobs posted in the last 7 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicantCount}</div>
                        <p className="text-xs text-muted-foreground">Applications received</p>
                    </CardContent>
                    <CardFooter>
                       <Button asChild size="sm" variant="outline" className="w-full">
                            <Link href="/admin/applicants">View Applicants <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Admin Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adminStaff.length}</div>
                        <p className="text-xs text-muted-foreground">Users with admin access</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Ready for your updates</p>
                    </CardContent>
                </Card>
            </div>
          </section>

          {currentUser?.role === 'SUPER_ADMIN' && (
              <section className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6"/>Manage Admin Staff</CardTitle>
                    <CardDescription>View all administrator accounts in the system.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="rounded-lg border bg-card text-foreground">
                        <Table>
                        <TableHeader>{adminTable.getHeaderGroups().map(hg => <TableRow key={hg.id}>{hg.headers.map(h => <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}</TableRow>)}</TableHeader>
                        <TableBody>
                            {adminTable.getRowModel().rows?.length ? adminTable.getRowModel().rows.map(row => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map(cell => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                            </TableRow>
                            )) : <TableRow><TableCell colSpan={adminColumns.length} className="h-24 text-center">No staff found.</TableCell></TableRow>}
                        </TableBody>
                        </Table>
                      </div>
                      <div className="p-4 bg-secondary/50 border border-dashed rounded-lg flex items-start gap-3">
                         <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                         <div>
                            <h4 className="font-semibold text-foreground">How to Manage Admins</h4>
                            <p className="text-sm text-muted-foreground mt-1">To ensure security, admin users must be managed directly in the Firebase Console. You can add or remove users from the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">Authentication</a> section of your project.</p>
                         </div>
                      </div>
                  </CardContent>
                </Card>
              </section>
          )}

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">All Job Listings</h2>
              <Button onClick={openAddForm} className="bg-primary/90 hover:bg-primary text-primary-foreground"><PlusCircle className="mr-2 h-5 w-5" />Add New Job</Button>
            </div>
            <div className="rounded-lg border bg-card text-foreground">
              <Table>
                <TableHeader>{jobTable.getHeaderGroups().map(hg => <TableRow key={hg.id}>{hg.headers.map(h => <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}</TableRow>)}</TableHeader>
                <TableBody>
                  {jobTable.getRowModel().rows?.length ? jobTable.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>{row.getVisibleCells().map(cell => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>
                  )) : <TableRow><TableCell colSpan={jobColumns.length} className="h-24 text-center">No results.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" onClick={() => jobTable.previousPage()} disabled={!jobTable.getCanPreviousPage()}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => jobTable.nextPage()} disabled={!jobTable.getCanNextPage()}>Next</Button>
            </div>
          </section>
        </main>
      </div>
      <JobForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={jobToEdit ? handleEditJob : handleAddJob} jobToEdit={jobToEdit} />
    </>
  );
}

export default withAuth(AdminPage);

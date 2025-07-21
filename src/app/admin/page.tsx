
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { JobForm } from "@/components/job-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Briefcase, MoreHorizontal, PlusCircle, Trash2, Edit, LogOut, UserPlus, Users, Loader2, FileText, ArrowRight } from "lucide-react";
import withAuth from "@/components/with-auth";
import { logout, getAuthenticatedUser, addAdminUser, getAllAdminUsers, deleteAdminUser, type AdminUser, type UserRole } from "@/lib/auth";

type AdminStaff = Omit<AdminUser, 'password'>;

const addAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type AddAdminFormValues = z.infer<typeof addAdminSchema>;


function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: UserRole } | null>(null);
  const [adminStaff, setAdminStaff] = useState<AdminStaff[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  
  const router = useRouter();
  const { toast } = useToast();

  const addAdminForm = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: { email: "", password: "" },
  });
  
  useEffect(() => {
    const user = getAuthenticatedUser();
    setCurrentUser(user);
    if(user?.role === 'SUPER_ADMIN') {
        setAdminStaff(getAllAdminUsers());
    }

    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs).map((j: Job) => ({...j, createdAt: new Date(j.createdAt)})));
    }
    
    const storedApplicants = localStorage.getItem('applicants');
    if (storedApplicants) {
      setApplicantCount(JSON.parse(storedApplicants).length);
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAddJob = (data: Omit<Job, 'id' | 'createdAt' | 'createdBy'>) => {
    const adminUser = getAuthenticatedUser();
    if (!adminUser) {
      alert("You must be logged in to create a job.");
      router.push('/login');
      return;
    }

    const newJob: Job = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      createdBy: adminUser.email,
    };
    setJobs((prevJobs) => [newJob, ...prevJobs]);
  };

  const handleEditJob = (data: Omit<Job, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!jobToEdit) return;
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobToEdit.id ? { ...job, ...data, id: jobToEdit.id, createdAt: jobToEdit.createdAt, createdBy: jobToEdit.createdBy } : job
      )
    );
    setJobToEdit(null);
  };
  
  const openEditForm = (job: Job) => {
    setJobToEdit(job);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setJobToEdit(null);
    setIsFormOpen(true);
  };
  
  const handleDeleteJob = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const handleAddAdmin = (data: AddAdminFormValues) => {
    setIsAddingUser(true);
    const result = addAdminUser({ ...data, role: 'ADMIN' });
    if(result.success) {
      toast({ title: "Success", description: result.message });
      setAdminStaff(getAllAdminUsers());
      addAdminForm.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsAddingUser(false);
  };

  const handleDeleteAdmin = (email: string) => {
    const result = deleteAdminUser(email);
     if(result.success) {
      toast({ title: "Success", description: result.message });
      setAdminStaff(getAllAdminUsers());
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
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
      cell: ({ row }) => <div>{format(row.getValue("createdAt") as Date, "MMM d, yyyy")}</div>
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
    { id: "actions", cell: ({ row }) => {
        const user = row.original;
        if (user.role === 'SUPER_ADMIN') return null;
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Delete</Button></AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Delete Admin?</AlertDialogTitle><AlertDialogDescription>This will remove their access. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteAdmin(user.email)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, delete admin</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }}
  ];

  const jobTable = useReactTable({ data: jobs, columns: jobColumns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), onSortingChange: setSorting, getSortedRowModel: getSortedRowModel(), state: { sorting } });
  const adminTable = useReactTable({ data: adminStaff, columns: adminColumns, getCoreRowModel: getCoreRowModel() });


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
               <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">Jobs</Link>
               <Link href="/admin/applicants" className="text-muted-foreground transition-colors hover:text-foreground">Applicants</Link>
            </nav>
             <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Welcome, {currentUser?.email}</span>
                <Badge variant={currentUser?.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>{currentUser?.role}</Badge>
                <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow">
          <section className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{jobs.length}</div>
                        <p className="text-xs text-muted-foreground">Currently active job listings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicantCount}</div>
                        <p className="text-xs text-muted-foreground">Applications received via internal form</p>
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
                        <div className="text-2xl font-bold">{adminStaff.length + 1}</div>
                        <p className="text-xs text-muted-foreground">Users with admin access</p>
                    </CardContent>
                </Card>
            </div>
          </section>

          {currentUser?.role === 'SUPER_ADMIN' && (
              <section className="mb-12">
                  <div className="grid md:grid-cols-2 gap-8">
                      <Card>
                          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-6 w-6"/>Manage Admin Staff</CardTitle><CardDescription>Add or remove admin users from the system.</CardDescription></CardHeader>
                          <CardContent>
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
                          </CardContent>
                      </Card>
                       <Card>
                          <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-6 w-6" />Add New Admin</CardTitle><CardDescription>Create a new administrator account.</CardDescription></CardHeader>
                          <CardContent>
                            <Form {...addAdminForm}>
                                <form onSubmit={addAdminForm.handleSubmit(handleAddAdmin)} className="space-y-4">
                                <FormField control={addAdminForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="new.admin@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={addAdminForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <Button type="submit" disabled={isAddingUser}>{isAddingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Add Admin</Button>
                                </form>
                            </Form>
                          </CardContent>
                      </Card>
                  </div>
              </section>
          )}

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Job Listings</h2>
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

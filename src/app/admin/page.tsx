
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Briefcase, MoreHorizontal, PlusCircle, Trash2, Edit, LogOut } from "lucide-react";
import withAuth from "@/components/with-auth";
import { logout, getAuthenticatedUser } from "@/lib/auth";

function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs).map((j: Job) => ({...j, createdAt: new Date(j.createdAt)})));
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
      // This should ideally not happen if withAuth is working correctly
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
  
  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags: string[] = row.getValue("tags");
        return (
          <div className="flex flex-wrap gap-1 w-48">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            {tags.length > 3 && <Badge variant="outline">+{tags.length - 3}</Badge>}
          </div>
        )
      }
    },
    {
      accessorKey: "createdBy",
      header: "Posted By",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Posted On
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <div>{format(date, "MMM d, yyyy")}</div>
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
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openEditForm(job)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  job posting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteJob(job.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, delete job
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      },
    }
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-muted-foreground">
        <header className="bg-card/80 border-b sticky top-0 z-10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            </Link>
             <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Job Listings</h2>
            <Button onClick={openAddForm} className="bg-primary/90 hover:bg-primary text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Job
            </Button>
          </div>

          <div className="rounded-lg border bg-card text-foreground">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </main>
      </div>

      <JobForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSubmit={jobToEdit ? handleEditJob : handleAddJob}
        jobToEdit={jobToEdit}
      />
    </>
  );
}


export default withAuth(AdminPage);

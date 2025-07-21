
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Applicant, EnrichedApplicant, Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Briefcase, FileText, LogOut, User } from "lucide-react";
import withAuth from "@/components/with-auth";
import { getAuthenticatedUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

function ApplicantsPage() {
  const [applicants, setApplicants] = useState<EnrichedApplicant[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const user = getAuthenticatedUser();
    setCurrentUser(user);
    
    const storedApplicants = localStorage.getItem('applicants');
    const storedJobs = localStorage.getItem('jobs');
    
    if (storedApplicants && storedJobs) {
      const allApplicants: Applicant[] = JSON.parse(storedApplicants);
      const allJobs: Job[] = JSON.parse(storedJobs);
      
      const jobsMap = new Map(allJobs.map(job => [job.id, job.title]));
      
      const enrichedApplicants = allApplicants.map(applicant => ({
        ...applicant,
        appliedAt: new Date(applicant.appliedAt),
        jobTitle: jobsMap.get(applicant.jobId) || "Unknown Job",
      })).sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());
      
      setApplicants(enrichedApplicants);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const columns: ColumnDef<EnrichedApplicant>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Applicant Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> {row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "jobTitle",
      header: "Applied For",
    },
    {
        accessorKey: "resume",
        header: "Resume",
        cell: ({row}) => <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> <span>{row.getValue("resume")}</span></div>
    },
    {
      accessorKey: "appliedAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Applied On <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{format(row.getValue("appliedAt") as Date, "MMM d, yyyy 'at' h:mm a")}</div>
    },
  ];

  const table = useReactTable({
    data: applicants,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-muted-foreground">
       <header className="bg-card/80 border-b sticky top-0 z-10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <nav className="flex items-center gap-4 text-sm font-medium">
               <Link href="/" className="flex items-center gap-2 text-foreground">
                <Briefcase className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-bold">Admin Dashboard</h1>
               </Link>
               <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">Jobs</Link>
               <Link href="/admin/applicants" className="text-foreground transition-colors hover:text-foreground">Applicants</Link>
            </nav>
             <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Welcome, {currentUser?.email}</span>
                <Badge variant={currentUser?.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>{currentUser?.role}</Badge>
                <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
            </div>
          </div>
        </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Job Applicants</h2>
        <div className="rounded-lg border bg-card text-foreground">
          <Table>
            <TableHeader>{table.getHeaderGroups().map(hg => <TableRow key={hg.id}>{hg.headers.map(h => <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}</TableRow>)}</TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                </TableRow>
              )) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No applicants found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </main>
    </div>
  );
}

export default withAuth(ApplicantsPage);

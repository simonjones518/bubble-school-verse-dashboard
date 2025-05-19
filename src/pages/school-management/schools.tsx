import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { SchoolsTableSkeleton } from "@/components/school/SchoolsTableSkeleton";
import { EmptySchoolsState } from "@/components/school/EmptySchoolsState";
import { SchoolForm } from "@/components/school/SchoolForm";
import {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  exportSchools,
} from "@/services/schoolService";
import { School, SchoolFormData, SchoolsFilter, SortField, SortOrder } from "@/types/school";
import { debounce } from "lodash";
import { supabase } from "@/integrations/supabase/client";

// Utility function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

const SchoolsManagement = () => {
  // State for filtering, sorting and pagination
  const [filters, setFilters] = useState<SchoolsFilter>({
    search: "",
    status: "active",
    sortField: "name",
    sortOrder: "asc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);

  // Access the query client
  const queryClient = useQueryClient();
  
  // Query for fetching schools data
  const {
    data: schools = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schools", filters],
    queryFn: () => getSchools(filters),
  });
  
  // Create school mutation
  const createMutation = useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast({
        title: "School Added",
        description: "The school has been successfully added.",
      });
      setAddDialogOpen(false);
    },
    onError: (error) => {
      console.error("School creation error:", error);
      let errorMessage = error.message;
      
      // Check for authentication errors
      if (errorMessage.includes("Authentication required")) {
        errorMessage = "You need to be logged in to add a school. Please sign in and try again.";
      } 
      // Check for RLS policy errors
      else if (errorMessage.includes("row-level security policy")) {
        errorMessage = "Permission denied: You don't have the required permissions to add a school.";
      }
      
      toast({
        title: "Error",
        description: `Failed to add school: ${errorMessage}`,
        variant: "destructive",
      });
    },
  });
  
  // Update school mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SchoolFormData }) =>
      updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast({
        title: "School Updated",
        description: "The school has been successfully updated.",
      });
      setEditDialogOpen(false);
      setCurrentSchool(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update school: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete school mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast({
        title: "School Deleted",
        description: "The school has been permanently removed.",
      });
      setDeleteDialogOpen(false);
      setCurrentSchool(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete school: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Export mutation
  const exportMutation = useMutation({
    mutationFn: exportSchools,
    onSuccess: (url) => {
      window.open(url, "_blank");
      toast({
        title: "Export Complete",
        description: "Your export has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Export Failed",
        description: `Could not generate export: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, search: value }));
      setCurrentPage(1);
    }, 300),
    []
  );

  // Update search input
  useEffect(() => {
    debouncedSearch(searchInput);
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput, debouncedSearch]);

  // Pagination logic
  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return schools.slice(startIndex, startIndex + rowsPerPage);
  }, [schools, currentPage, rowsPerPage]);
  
  const pageCount = Math.ceil(schools.length / rowsPerPage);

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as "active" | "inactive" | "all",
    }));
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    // Parse the value to extract field and order
    const [field, order] = value.split("-");
    setFilters((prev) => ({
      ...prev,
      sortField: field as SortField,
      sortOrder: order as SortOrder,
    }));
    setCurrentPage(1);
  };

  // Handle add school
  const handleAddSchool = (data: SchoolFormData) => {
    createMutation.mutate(data);
  };

  // Handle edit school
  const handleEditSchool = (data: SchoolFormData) => {
    if (currentSchool) {
      updateMutation.mutate({ id: currentSchool.id, data });
    }
  };

  // Handle delete school
  const handleDeleteSchool = () => {
    if (currentSchool) {
      deleteMutation.mutate(currentSchool.id);
    }
  };

  // Handle export
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    exportMutation.mutate(format);
  };

  return (
    <DashboardLayout title="Manage Schools">
      <div className="flex flex-col space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Manage Schools</h1>
          <Button onClick={() => setAddDialogOpen(true)} className="self-start sm:self-auto">
            <Icons.plus className="mr-2 h-4 w-4" />
            Add New School
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Icons.search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by School Name, Email, or Phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 max-w-full sm:max-w-md"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select
              defaultValue={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
                <SelectItem value="all">All Statuses</SelectItem>
              </SelectContent>
            </Select>

            <Select
              defaultValue={`${filters.sortField}-${filters.sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="classes_count-desc">Most Classes</SelectItem>
                <SelectItem value="created_at-desc">Recently Added</SelectItem>
                <SelectItem value="updated_at-desc">Last Modified</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Icons.download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <Icons.fileText className="mr-2 h-4 w-4" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <Icons.excel className="mr-2 h-4 w-4" />
                  <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <Icons.pdf className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
            <p>Error loading schools. Please try again later.</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <SchoolsTableSkeleton rowCount={rowsPerPage} />}

        {/* Empty state */}
        {!isLoading && schools.length === 0 && (
          <EmptySchoolsState onAddNew={() => setAddDialogOpen(true)} />
        )}

        {/* Schools Table */}
        {!isLoading && schools.length > 0 && (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Address</TableHead>
                    <TableHead className="hidden md:table-cell">Classes</TableHead>
                    <TableHead className="hidden lg:table-cell">Admins</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Created On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <a href={`mailto:${school.email}`} className="text-blue-600 hover:underline">
                          {school.email}
                        </a>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <a href={`tel:${school.phone}`} className="text-blue-600 hover:underline">
                          {school.phone}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px]">
                        <span title={school.address}>{truncateText(school.address, 30)}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Link to={`/school-management/classes?schoolId=${school.id}`} className="text-blue-600 hover:underline">
                          {school.classes_count}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link to={`/school-management/admins?schoolId=${school.id}`} className="text-blue-600 hover:underline">
                          {school.admins_count}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={school.status === "active" ? "default" : "outline"}>
                          {school.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(school.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentSchool(school);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Icons.edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              setCurrentSchool(school);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Icons.trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination and Rows Per Page */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Rows per page</p>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={rowsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min((currentPage - 1) * rowsPerPage + 1, schools.length)}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * rowsPerPage, schools.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{schools.length}</span> schools
                </p>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(pageCount)].map((_, i) => {
                    // Show first page, last page, and pages around current page
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === pageCount ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={pageNumber === currentPage}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Show ellipsis
                    if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === pageCount - 1 && currentPage < pageCount - 2)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                      className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}

        {/* Add School Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
              <DialogDescription>
                Create a new school in the system. Fill in the required information below.
              </DialogDescription>
            </DialogHeader>
            <SchoolForm
              isSubmitting={createMutation.isPending}
              onSubmit={handleAddSchool}
              onCancel={() => setAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit School Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit School</DialogTitle>
              <DialogDescription>
                Update the school information. Modify the fields below.
              </DialogDescription>
            </DialogHeader>
            {currentSchool && (
              <SchoolForm
                initialData={currentSchool}
                isSubmitting={updateMutation.isPending}
                onSubmit={handleEditSchool}
                onCancel={() => setEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Delete {currentSchool?.name}? This will permanently remove all associated data,
                including classes, students, and other records linked to this school.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDeleteSchool}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Icons.building className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default SchoolsManagement;

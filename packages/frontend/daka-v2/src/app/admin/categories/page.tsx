"use client"

import {useState} from "react"
import {CategoriesHeader} from "./header";
import {CategoriesTable} from "./table";
import {CategoriesFooter} from "./footer";
import { useCategories } from "@/hooks/use-categories"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const { data, loading, error, deleteCategory, createCategory/*, updateCategory*/ } = useCategories({
    page: currentPage,
    pageSize,
    search: searchTerm,
  })

  const handleEdit = (id: string) => {
    console.log("Edit category:", id)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id)
    }
  }

  const handleCreateCategory = () => {
    createCategory({
      name: "New Category",
      description: "A new category description",
      image: "/placeholder.svg?height=40&width=40",
      status: "active",
    })
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  if (error) {
    return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>Error loading categories: {error}</AlertDescription>
            </Alert>
          </div>
        </div>
    )
  }

  return (
      <div className="w-full bg-background">

        <div className="w-full mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="text-muted-foreground">Manage your product categories</p>
            </div>

            {/* Categories Header with Search and Create Button */}
            <CategoriesHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCreateCategory={handleCreateCategory}
            />

            {/* Loading State */}
            {loading ? (
                <div className="rounded-lg border bg-card p-6">
                  <div className="space-y-4">
                    {Array.from({ length: pageSize }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[300px]" />
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            ) : (
                <>
                  {/* Categories Table */}
                  <CategoriesTable categories={data?.categories || []} onEdit={handleEdit} onDelete={handleDelete} />

                  {/* Categories Footer with Pagination */}
                  {data && (
                      <CategoriesFooter
                          currentPage={data.pagination.page}
                          totalPages={data.pagination.totalPages}
                          pageSize={data.pagination.pageSize}
                          totalItems={data.pagination.total}
                          onPageChange={setCurrentPage}
                          onPageSizeChange={handlePageSizeChange}
                      />
                  )}
                </>
            )}
          </div>
        </div>
      </div>
  )
}

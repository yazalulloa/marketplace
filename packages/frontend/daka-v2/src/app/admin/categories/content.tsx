"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { deleteCategoryAction, createCategoryAction } from "./actions"
import {CategoriesHeader} from "./header";
import {CategoriesTable} from "./table";
import {CategoriesFooter} from "./footer";
import {Categories} from "@marketplace/core/category";
import Category = Categories.Category;
interface CategoriesPageContentProps {
  initialCategories: Category[]
  initialPagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  initialSearch: string
}

export function CategoriesPageContent({
                                        initialCategories,
                                        initialPagination,
                                        initialSearch,
                                      }: CategoriesPageContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const updateURL = (updates: { page?: number; pageSize?: number; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.page !== undefined) {
      if (updates.page === 1) {
        params.delete("page")
      } else {
        params.set("page", updates.page.toString())
      }
    }

    if (updates.pageSize !== undefined) {
      if (updates.pageSize === 5) {
        params.delete("pageSize")
      } else {
        params.set("pageSize", updates.pageSize.toString())
      }
    }

    if (updates.search !== undefined) {
      if (updates.search === "") {
        params.delete("search")
      } else {
        params.set("search", updates.search)
      }
    }


    const newURL = params.toString() ? `/admin/categories?${params.toString()}` : "/admin/categories"
    router.push(newURL)
    console.log("Updated URL:", newURL)
  }

  const handleSearchChange = (search: string) => {
    updateURL({ search, page: 1 })
    console.log("Search updated:", search)
  }

  const handlePageChange = (page: number) => {
    updateURL({ page })
    console.log("Page changed:", page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    updateURL({ pageSize, page: 1 })
    console.log("Page size changed:", pageSize)
  }

  const handleEdit = (id: string) => {
    console.log("Edit category:", id)
    // TODO: Implement edit modal
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

      startTransition(async () => {
      try {
        setError(null)
        const result = await deleteCategoryAction(id)
        if (!result.success) {
          setError(result.error || "Failed to delete category")
        } else {
          // Refresh the page to show updated data
          router.refresh()
        }
      } catch (err) {
        setError("Failed to delete category")
      }
    })
  }

  const handleCreateCategory = async () => {
    startTransition(async () => {
      try {
        setError(null)
        const result = await createCategoryAction({
          name: "New Category",
          description: "A new category description",
          image: "/placeholder.svg?height=40&width=40",
          status: "active",
        })
        if (!result.success) {
          setError(result.error || "Failed to create category")
        } else {
          // Refresh the page to show updated data
          router.refresh()
        }
      } catch (err) {
        setError("Failed to create category")
      }
    })
  }

  return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="text-muted-foreground">Manage your product categories</p>
            </div>

            {/* Error Display */}
            {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Categories Header with Search and Create Button */}
            <CategoriesHeader
                searchTerm={initialSearch}
                onSearchChange={handleSearchChange}
                onCreateCategory={handleCreateCategory}
                disabled={isPending}
            />

            {/* Categories Table */}
            <CategoriesTable
                categories={initialCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                disabled={isPending}
            />

            {/* Categories Footer with Pagination */}
            <CategoriesFooter
                currentPage={initialPagination.page}
                totalPages={initialPagination.totalPages}
                pageSize={initialPagination.pageSize}
                totalItems={initialPagination.total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                disabled={isPending}
            />
          </div>
        </div>
      </div>
  )
}

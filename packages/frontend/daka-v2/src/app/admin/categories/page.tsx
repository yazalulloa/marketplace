"use client"

import { useState } from "react"
import {CategoriesHeader} from "./header";
import {CategoriesTable} from "./table";
import {CategoriesFooter} from "./footer";
import {Metadata} from "next";

// Mock data for categories
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    image: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    id: 2,
    name: "Clothing",
    description: "Fashion and apparel items",
    image: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    id: 3,
    name: "Books",
    description: "Educational and entertainment books",
    image: "/placeholder.svg?height=40&width=40",
    status: "inactive",
  },
  {
    id: 4,
    name: "Home & Garden",
    description: "Home improvement and gardening supplies",
    image: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    id: 5,
    name: "Sports",
    description: "Sports equipment and fitness gear",
    image: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    id: 6,
    name: "Toys",
    description: "Children's toys and games",
    image: "/placeholder.svg?height=40&width=40",
    status: "inactive",
  },
  {
    id: 7,
    name: "Beauty",
    description: "Cosmetics and personal care products",
    image: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
  {
    id: 8,
    name: "Automotive",
    description: "Car parts and automotive accessories",
    image: "/placeholder.svg?height=40&width=40",
    status: "active",
  },
]

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Filter categories based on search term
  const filteredCategories = mockCategories.filter(
      (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalItems = filteredCategories.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentCategories = filteredCategories.slice(startIndex, endIndex)

  const handleEdit = (id: number) => {
    console.log("Edit category:", id)
  }

  const handleDelete = (id: number) => {
    console.log("Delete category:", id)
  }

  const handleCreateCategory = () => {
    console.log("Create new category")
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

            {/* Categories Table */}
            <CategoriesTable categories={currentCategories} onEdit={handleEdit} onDelete={handleDelete} />

            {/* Categories Footer with Pagination */}
            <CategoriesFooter
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize)
                  setCurrentPage(1) // Reset to first page when changing page size
                }}
            />
          </div>
        </div>
      </div>
  )
}

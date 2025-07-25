"use client"
import { useState } from "react"
import {Edit, Trash2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Categories} from "@marketplace/core/category";
import Category = Categories.Category;
import {DeleteCategoryDialog} from "./delete-dialog";


interface CategoriesTableProps {
  categories: Category[]
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
  disabled?: boolean
  isDeleting?: boolean
}

export function CategoriesTable({categories, onEdit, onDelete, disabled, isDeleting }: CategoriesTableProps) {

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async (categoryId: string) => {
    await onDelete(categoryId)
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }


  return (
      <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
            ) : (
                categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                      <TableCell>
                        <img
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            className="h-10 w-10 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                            variant={category.status === "active" ? "default" : "secondary"}>{category.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(category.id)}
                              disabled={disabled}
                              className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4"/>
                            <span className="sr-only">Edit category</span>
                          </Button>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(category)}
                              disabled={disabled}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Delete category</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

        <DeleteCategoryDialog
            category={categoryToDelete}
            open={deleteDialogOpen}
            onOpenChange={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
        />
      </>
  )
}

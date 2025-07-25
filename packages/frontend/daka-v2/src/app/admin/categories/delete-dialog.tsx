"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"
import {Categories} from "@marketplace/core/category";
import Category = Categories.Category;

interface DeleteCategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (categoryId: string) => Promise<void>
  isDeleting?: boolean
}

export function DeleteCategoryDialog({
                                       category,
                                       open,
                                       onOpenChange,
                                       onConfirm,
                                       isDeleting = false,
                                     }: DeleteCategoryDialogProps) {
  const handleConfirm = async () => {
    if (category) {
      await onConfirm(category.id)
    }
  }

  if (!category) return null

  return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to delete the category "{category.name}"?</p>
              <br/>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete the category and remove it from the system.
              </p>
              {category.description && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Description:</span> {category.description}
                    </p>
                  </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleConfirm}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
              ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Category
                  </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}

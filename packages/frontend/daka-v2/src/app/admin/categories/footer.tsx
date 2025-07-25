"use client"

import {ChevronLeft, ChevronRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

interface CategoriesFooterProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  disabled?: boolean
}

export function CategoriesFooter({
                                   currentPage,
                                   totalPages,
                                   pageSize,
                                   totalItems,
                                   onPageChange,
                                   onPageSizeChange,
                                   disabled,
                                 }: CategoriesFooterProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card rounded-lg border">
        {/* Results Info and Page Size Selector */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">

          <span>
          {totalItems === 0
              ? "No results found"
              : `Showing ${startItem} to ${endItem} of ${totalItems} results`}
        </span>

          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(Number(value))}
                disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || disabled}
              className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4"/>
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current page
              const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)

              if (!showPage) {
                // Show ellipsis for gaps
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                      <span key={page} className="px-2 text-muted-foreground">
                    ...
                  </span>
                  )
                }
                return null
              }

              return (
                  <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      disabled={disabled}
                      className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
              )
            })}
          </div>

          <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || disabled}
              className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4"/>
          </Button>
        </div>
      </div>
  )
}

"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CategoriesHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onCreateCategory: () => void
}

export function CategoriesHeader({ searchTerm, onSearchChange, onCreateCategory }: CategoriesHeaderProps) {
  return (
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card rounded-lg border">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
          />
        </div>

        {/* Create Category Button */}
        <Button onClick={onCreateCategory} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>
  )
}

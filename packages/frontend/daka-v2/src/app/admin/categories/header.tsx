"use client"

import { useState, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from 'use-debounce';

interface CategoriesHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onCreateCategory: () => void
  disabled?: boolean
}

export function CategoriesHeader({ searchTerm, onSearchChange, onCreateCategory, disabled }: CategoriesHeaderProps) {

  const handleSearch = useDebouncedCallback((term) => {
    onSearchChange(term)
  }, 300);

  return (
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card rounded-lg border">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Search categories..."
              defaultValue={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
              disabled={disabled}
          />
        </div>

        {/* Create Category Button */}
        <Button onClick={onCreateCategory} disabled={disabled} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>
  )
}

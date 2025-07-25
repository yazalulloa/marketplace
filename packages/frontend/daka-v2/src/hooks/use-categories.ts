"use client"

import {useEffect, useState} from "react"
import type {Category} from "@marketplace/core/category"

interface UseCategoriesParams {
  page: number
  pageSize: number
  search: string
}

interface CategoriesResponse {
  categories: Category[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export function useCategories({page, pageSize, search}: UseCategoriesParams) {
  const [data, setData] = useState<CategoriesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: search,
      })

      const response = await fetch(`/api/categories?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [page, pageSize, search])

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      // Refresh the data
      await fetchCategories()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category")
      return false
    }
  }

  const createCategory = async (categoryData: Omit<Category, "id" | "tenant_id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      // Refresh the data
      await fetchCategories()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category")
      return false
    }
  }

  const updateCategory = async (id: string, categoryData: Omit<Category, "id" | "created_at" | "updated_at">) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      // Refresh the data
      await fetchCategories()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category")
      return false
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchCategories,
    deleteCategory,
    createCategory,
    updateCategory,
  }
}

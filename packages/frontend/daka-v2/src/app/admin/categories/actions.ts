"use server"

import {Categories} from "@marketplace/core/category";
import {revalidatePath} from "next/cache"
import {seedCategories} from "./seed";
import Category = Categories.Category;

export async function createCategoryAction(data: {
  name: string
  description?: string
  image?: string
  status?: "active" | "inactive"
}) {
  try {
    if (!data.name || data.name.trim().length === 0) {
      return {success: false, error: "Name is required"}
    }

    await seedCategories()

    await Categories.create({
      name: data.name.trim(),
      description: data.description,
      image: data.image,
      status: data.status,
    })

    revalidatePath("/admin/categories")
    return {success: true}
  } catch (error) {
    console.error("Failed to create category:", error)
    return {success: false, error: "Failed to create category"}
  }
}

export async function updateCategoryAction(
    id: string,
    data: {
      name: string
      description?: string
      image?: string
      status?: "active" | "inactive"
    },
) {
  try {
    if (!data.name || data.name.trim().length === 0) {
      return {success: false, error: "Name is required"}
    }

    const updated = await Categories.update(id, {
      name: data.name.trim(),
      description: data.description,
      image: data.image,
      status: data.status,
    })

    if (!updated) {
      return {success: false, error: "Category not found"}
    }

    revalidatePath("/admin/categories")
    return {success: true}
  } catch (error) {
    console.error("Failed to update category:", error)
    return {success: false, error: "Failed to update category"}
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const deleted = await Categories.deleteById(id)

    if (!deleted) {
      return {success: false, error: "Category not found"}
    }

    revalidatePath("/admin/categories")
    return {success: true}
  } catch (error) {
    console.error("Failed to delete category:", error)
    return {success: false, error: "Failed to delete category"}
  }
}

export async function findCategories(options: {
  search?: string
  limit?: number
  offset?: number
  tenantId?: string
}): Promise<{ categories: Category[]; total: number }> {

  const listPromise = Categories.list(options)
  const countPromise = Categories.count({
    search: options.search,
    tenantId: options.tenantId,
  })

  const [results, total] = await Promise.all([listPromise, countPromise])

  return {categories: results, total}
}
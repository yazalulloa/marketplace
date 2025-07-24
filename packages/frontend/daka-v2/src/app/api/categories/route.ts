import { type NextRequest, NextResponse } from "next/server"
import {db} from "@/lib/db"
import * as schema from '@/lib/model/schema.sql';

export async function GET(request: NextRequest) {
  throw new Error("Method not implemented.");

  // try {
  //   const { searchParams } = new URL(request.url)
  //   const page = Number.parseInt(searchParams.get("page") || "1")
  //   const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
  //   const search = searchParams.get("search") || ""
  //
  //   const offset = (page - 1) * pageSize
  //
  //   let query = "SELECT * FROM categories"
  //   let countQuery = "SELECT COUNT(*) as total FROM categories"
  //   const queryParams: any[] = []
  //   const countParams: any[] = []
  //
  //   if (search) {
  //     query += " WHERE name LIKE ? OR description LIKE ?"
  //     countQuery += " WHERE name LIKE ? OR description LIKE ?"
  //     const searchParam = `%${search}%`
  //     queryParams.push(searchParam, searchParam)
  //     countParams.push(searchParam, searchParam)
  //   }
  //
  //   query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
  //   queryParams.push(pageSize, offset)
  //
  //   const [categories] = await db.execute(query, queryParams)
  //   const [countResult] = (await db.execute(countQuery, countParams)) as any[]
  //
  //   const total = countResult[0].total
  //
  //   return NextResponse.json({
  //     categories,
  //     pagination: {
  //       page,
  //       pageSize,
  //       total,
  //       totalPages: Math.ceil(total / pageSize),
  //     },
  //   })
  // } catch (error) {
  //   console.error("Database error:", error)
  //   return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  // }
}

export async function POST(request: NextRequest) {
  throw new Error("Method not implemented.");
  // try {
  //   const body = await request.json()
  //   const { name, description, image, status } = body
  //
  //   if (!name) {
  //     return NextResponse.json({ error: "Name is required" }, { status: 400 })
  //   }
  //
  //   const [result] = (await pool.execute(
  //       "INSERT INTO categories (name, description, image, status) VALUES (?, ?, ?, ?)",
  //       [name, description || "", image || "", status || "active"],
  //   )) as any[]
  //
  //   const [newCategory] = await pool.execute("SELECT * FROM categories WHERE id = ?", [result.insertId])
  //
  //   return NextResponse.json(newCategory[0], { status: 201 })
  // } catch (error) {
  //   console.error("Database error:", error)
  //   return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  // }
}

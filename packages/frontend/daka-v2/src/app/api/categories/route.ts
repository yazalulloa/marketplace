import {type NextRequest, NextResponse} from "next/server"

import * as schema from '@/lib/model/schema.sql';
import {and, desc, like, or, sql} from 'drizzle-orm';
import {db} from "@marketplace/core/mysql"

export async function GET(request: NextRequest) {

  try {

    const {searchParams} = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const search = searchParams.get("search") || ""

    const offset = (page - 1) * pageSize

    const [categories] = await db.select().from(schema.categories).where(
        and(
            search ? or(like(schema.categories.name, search), like(schema.categories.description, search)) : sql`TRUE`
        )
    ).orderBy(desc(schema.categories.created_at))
    .limit(pageSize).offset(offset);


    const total = await db.$count(schema.categories, search ?
        or(like(schema.categories.name, search), like(schema.categories.description, search)) : sql`TRUE`);

    return NextResponse.json({
      categories,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({error: "Failed to fetch categories"}, {status: 500})
  }
}

export async function POST(request: NextRequest) {
  throw new Error("Method not implemented. Use POST /api/categories/[id] for creating categories.")
  // try {
  //   const body = await request.json()
  //   const {name, description, image, status} = body
  //
  //   if (!name) {
  //     return NextResponse.json({error: "Name is required"}, {status: 400})
  //   }
  //
  //   const [result] = (await pool.execute(
  //       "INSERT INTO categories (name, description, image, status) VALUES (?, ?, ?, ?)",
  //       [name, description || "", image || "", status || "active"],
  //   )) as any[]
  //
  //   const [newCategory] = await pool.execute("SELECT * FROM categories WHERE id = ?", [result.insertId])
  //
  //   return NextResponse.json(newCategory[0], {status: 201})
  // } catch (error) {
  //   console.error("Database error:", error)
  //   return NextResponse.json({error: "Failed to create category"}, {status: 500})
  // }
}

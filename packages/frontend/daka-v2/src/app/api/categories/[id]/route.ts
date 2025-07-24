import {type NextRequest, NextResponse} from "next/server"
import {db} from "@/lib/db"
import * as schema from '@/lib/model/schema.sql';
import {eq} from 'drizzle-orm';

export async function PUT(request: NextRequest, {params}: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const {name, description, image, status} = body

    if (!name) {
      return NextResponse.json({error: "Name is required"}, {status: 400})
    }

    await db.update(schema.categories)
    .set({
      name,
      description: description || "",
      image: image || "",
      status: status || "active",
    })
    .where(eq(schema.categories.id, id))

    const updatedCategory = await db.select().from(schema.categories).where(eq(schema.categories.id, id))

    return NextResponse.json(updatedCategory[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({error: "Failed to update category"}, {status: 500})
  }
}

export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {
  try {
    const id = params.id



    const [result] = (await db.delete(schema.categories).where(eq(schema.categories.id, id))) as any[]

    if (result.affectedRows === 0) {
      return NextResponse.json({error: "Category not found"}, {status: 404})
    }

    return NextResponse.json({message: "Category deleted successfully"})
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({error: "Failed to delete category"}, {status: 500})
  }
}

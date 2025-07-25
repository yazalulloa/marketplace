import {type NextRequest, NextResponse} from "next/server"
import {Categories} from "@marketplace/core/category";


export async function PUT(request: NextRequest,
                          {params}: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const {name, description, image, status} = body

    if (!name) {
      return NextResponse.json({error: "Name is required"}, {status: 400})
    }

    await Categories.update(id, name, description || "", image || "", status || "active")

    const updatedCategory = await Categories.getById(id)

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({error: "Failed to update category"}, {status: 500})
  }
}

export async function DELETE(/*request: NextRequest,*/ {params}: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await Categories.deleteById(id)

    console.log("Delete result:", result)

    return NextResponse.json({message: "Category deleted successfully"})
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({error: "Failed to delete category"}, {status: 500})
  }
}

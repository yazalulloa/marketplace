import {db} from "../mysql";
import {categoriesTable} from "./category.sql";
import {and, desc, eq, like, or, sql} from 'drizzle-orm';
import { v7 } from "uuid";

export interface Category {
  id: string
  tenant_id: string
  name: string
  description: string
  image: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}


export namespace Categories {

  export async function list(search: string, pageSize: number, offset: number) {
    const [categories] = await db.select().from(categoriesTable).where(
        and(
            search ? or(like(categoriesTable.name, search), like(categoriesTable.description, search)) : sql`TRUE`
        )
    ).orderBy(desc(categoriesTable.created_at))
    .limit(pageSize).offset(offset);

    return categories
  }

  export function count(search: string) {

    return db.$count(categoriesTable, search ?
        or(like(categoriesTable.name, search), like(categoriesTable.description, search)) : sql`TRUE`);
  }

  export async function create(name: string, description: string, image: string, status: string) {
    const id = v7();
    await db.insert(categoriesTable).values({
      id: crypto.randomUUID(),
      tenant_id: "default", // Assuming a default tenant for simplicity
      name,
      description: description || "",
      image: image || "",
      status: status || "active",
    });

    return id;
  }

  export function update(id: string, name: string, description: string, image: string, status: string) {
    return db.update(categoriesTable)
    .set({
      name,
      description: description || "",
      image: image || "",
      status: status || "active",
    })
    .where(eq(categoriesTable.id, id))
  }

  export function getById(id: string) {
    return db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).then(rows => rows[0]);
  }

  export function deleteById(id: string) {
    return db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  }
}
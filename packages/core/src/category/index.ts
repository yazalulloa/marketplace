import {db} from "../mysql";
import {categoriesTable} from "./category.sql";
import {and, desc, eq, like, or, SQL} from 'drizzle-orm';
import {v7} from "uuid";

// export interface Category {
//   id: string
//   tenant_id: string
//   name: string
//   description: string
//   image: string
//   status: "active" | "inactive"
//   created_at: string
//   updated_at: string
// }


export namespace Categories {

  export type Category = typeof categoriesTable.$inferSelect

  export function list(options: {
    search?: string
    limit?: number
    offset?: number
    tenantId?: string
  }): Promise<Category[]> {

    const {search = "", limit = 10, offset = 0, tenantId = "default"} = options
    const whereConditions = queryConditions(options)

    return db.select().from(categoriesTable)
    .where(and(...whereConditions))
    // .where(and(search ? or(like(categoriesTable.name, search), like(categoriesTable.description, search)) : sql`TRUE`))
    .orderBy(desc(categoriesTable.created_at))
    .limit(limit).offset(offset)
  }

  function queryConditions(options: { search?: string, tenantId?: string }): SQL<unknown>[] {
    const {search = "", tenantId = "default"} = options

    const whereConditions: SQL<unknown>[] = [eq(categoriesTable.tenant_id, tenantId)]
    if (search) {
      const term = `%${search}%`;
      let orlike = or(like(categoriesTable.name, term), like(categoriesTable.description, term));
      if (orlike) {
        whereConditions.push(orlike)
      }
    }

    return whereConditions
  }

  export function count(options: {
    search?: string
    tenantId?: string
  }) {

    const whereConditions = queryConditions(options)

    return db.$count(categoriesTable, and(...whereConditions));
  }

  export async function create(data: {
    name: string
    description?: string
    image?: string
    status?: "active" | "inactive"
  }) {
    const now = new Date().toISOString()
    const id = v7();

    return db.insert(categoriesTable).values({
      id: id,
      tenant_id: "default", // Assuming a default tenant for simplicity
      name: data.name,
      description: data.description || "",
      image: data.image || "",
      status: data.status || "active",
    });
  }

  export function update(id: string,
                         data: {
                           name?: string
                           description?: string
                           image?: string
                           status?: "active" | "inactive"
                         },) {
    return db.update(categoriesTable)
    .set({
      ...data,
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
import {mysqlTable, text, timestamp, varchar} from "drizzle-orm/mysql-core";

export const categoriesTable = mysqlTable("categories", {
  id: varchar({length: 128}).primaryKey().notNull(),
  tenant_id: varchar({length: 128}).notNull(),
  name: varchar({length: 255}).notNull(),
  description: text().notNull(),
  image: text().notNull(),
  status: varchar({length: 20}).notNull().default("active"),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});
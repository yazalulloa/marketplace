
import { migrate } from "drizzle-orm/mysql2/migrator";
import {db} from "@marketplace/core/mysql"

export const handler = async (event: any) => {
  await migrate(db, {
    migrationsFolder: "./migrations",
  });
};
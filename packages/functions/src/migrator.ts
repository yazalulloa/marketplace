
import { migrate } from "drizzle-orm/mysql2/migrator";
import {db} from "@marketplace/core/mysql/index"

export const handler = async (event: any) => {
  await migrate(db, {
    migrationsFolder: "./migrations",
  });
};
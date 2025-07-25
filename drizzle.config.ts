import { Resource } from "sst";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  // Pick up all our schema files
  schema: ["./packages/frontend/daka-v2/src/**/*.sql.ts"],
  out: "./migrations",
  dbCredentials: {
    host: Resource.MyDatabase.host,
    port: Resource.MyDatabase.port,
    user: Resource.MyDatabase.username,
    password: Resource.MyDatabase.password,
    database: Resource.MyDatabase.database,
  },
});
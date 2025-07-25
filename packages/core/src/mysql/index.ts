import {Resource} from "sst";
import mysql from "mysql2/promise";
import {drizzle} from "drizzle-orm/mysql2";

const poolConnection = mysql.createPool({
  user: Resource.MyDatabase.username,
  password: Resource.MyDatabase.password,
  database: Resource.MyDatabase.database,
  host: Resource.MyDatabase.host,
  port: Resource.MyDatabase.port,
});


export const db = drizzle({client: poolConnection});

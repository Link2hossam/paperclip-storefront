import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "../env";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | null = null;

export function getDb(): Db {
  if (!_db) {
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required to connect to the database");
    }
    const sql = neon(env.DATABASE_URL);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export function createDb(connectionString: string): Db {
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

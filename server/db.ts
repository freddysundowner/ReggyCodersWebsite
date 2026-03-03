import { drizzle } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import pg from "pg";
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const isNeon = process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("neon.");

let db: ReturnType<typeof drizzle> | ReturnType<typeof drizzlePg>;

if (isNeon) {
  db = drizzle({
    connection: process.env.DATABASE_URL,
    schema,
    ws: ws,
  });
} else {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });
  db = drizzlePg({ client: pool, schema });
}

export { db };

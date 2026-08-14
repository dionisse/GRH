import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool = databaseUrl
  ? (globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("supabase.co") || databaseUrl.includes("supabase")
        ? { rejectUnauthorized: false }
        : undefined,
    }))
  : null;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

const realDb = pool ? drizzle(pool) : null;

// Export a non-null proxy so TypeScript doesn't complain in closures.
// If no DB is configured, the proxy throws on any operation, which is caught
// by the try/catch in each API route handler.
export const db = realDb ?? (new Proxy({} as any, {
  get() {
    throw new Error("Base de données non configurée");
  },
}) as typeof realDb & {});

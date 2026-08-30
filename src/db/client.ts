import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/node-sqlite";
import path from "path";

// Uses Node's built-in node:sqlite module (stable since Node 22.13, no flag
// required) instead of a native addon like better-sqlite3. This means
// `npm install` never needs to compile anything — no Visual Studio Build
// Tools on Windows, no Xcode Command Line Tools on macOS, no build-essential
// on Linux. It's the reason this project has zero native dependencies.
//
// Swap this file for a Postgres/MySQL driver + the matching Drizzle adapter
// in production; the schema and every query elsewhere in the app stay the
// same.

const globalForDb = globalThis as unknown as {
  sqlite?: DatabaseSync;
};

const dbPath = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");
const resolvedPath = path.isAbsolute(dbPath)
  ? dbPath
  : path.join(/* turbopackIgnore: true */ process.cwd(), dbPath);

const sqlite = globalForDb.sqlite ?? new DatabaseSync(resolvedPath);
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA foreign_keys = ON;");

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

export const db = drizzle({ client: sqlite });
export { sqlite };

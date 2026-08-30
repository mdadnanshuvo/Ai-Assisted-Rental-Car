import "dotenv/config";
import { readFileSync } from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

const dbPath = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");
const resolvedDbPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);

const sql = readFileSync(path.join(process.cwd(), "src/db/migrations.sql"), "utf-8");

const db = new DatabaseSync(resolvedDbPath);
db.exec(sql);
db.close();

console.log(`Database ready at ${resolvedDbPath}`);

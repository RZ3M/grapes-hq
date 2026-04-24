import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { join } from "path";
import * as schema from "./schema";

const DB_PATH = join(process.env.HOME || "~", ".grapes-hq", "data.db");

// Ensure data directory exists
import { mkdirSync } from "fs";
try {
  mkdirSync(join(process.env.HOME || "~", ".grapes-hq"), { recursive: true });
} catch { /* already exists */ }

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Initialize tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'new',
    tags TEXT DEFAULT '[]',
    created_at TEXT DEFAULT '',
    updated_at TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'todo',
    tags TEXT DEFAULT '[]',
    due_date TEXT,
    source TEXT DEFAULT 'manual',
    created_at TEXT DEFAULT '',
    updated_at TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS sends (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT DEFAULT '',
    description TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    created_at TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    from_address TEXT,
    snippet TEXT DEFAULT '',
    body_preview TEXT DEFAULT '',
    actionable INTEGER DEFAULT 0,
    action_type TEXT,
    linked_task_id TEXT,
    gmail_thread_id TEXT,
    captured_at TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS daily_logs (
    id TEXT PRIMARY KEY,
    date TEXT UNIQUE NOT NULL,
    energy_level TEXT,
    mood TEXT,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(due_date);
  CREATE INDEX IF NOT EXISTS idx_sends_created ON sends(created_at);
  CREATE INDEX IF NOT EXISTS idx_emails_actionable ON emails(actionable);
`);

export { schema };

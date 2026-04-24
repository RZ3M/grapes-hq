import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const ideas = sqliteTable("ideas", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default(""),
  status: text("status").default("new"),
  tags: text("tags").default("[]"),
  createdAt: text("created_at").default(""),
  updatedAt: text("updated_at").default(""),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default(""),
  status: text("status").default("todo"),
  tags: text("tags").default("[]"),
  dueDate: text("due_date"),
  source: text("source").default("manual"),
  createdAt: text("created_at").default(""),
  updatedAt: text("updated_at").default(""),
});

export const sends = sqliteTable("sends", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").default(""),
  description: text("description").default(""),
  tags: text("tags").default("[]"),
  createdAt: text("created_at").default(""),
});

export const emails = sqliteTable("emails", {
  id: text("id").primaryKey(),
  subject: text("subject").notNull(),
  fromAddress: text("from_address"),
  snippet: text("snippet").default(""),
  bodyPreview: text("body_preview").default(""),
  actionable: integer("actionable").default(0),
  actionType: text("action_type"),
  linkedTaskId: text("linked_task_id"),
  gmailThreadId: text("gmail_thread_id"),
  capturedAt: text("captured_at").default(""),
});

export const dailyLogs = sqliteTable("daily_logs", {
  id: text("id").primaryKey(),
  date: text("date").unique().notNull(),
  energyLevel: text("energy_level"),
  mood: text("mood"),
  notes: text("notes").default(""),
  createdAt: text("created_at").default(""),
});

export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Send = typeof sends.$inferSelect;
export type NewSend = typeof sends.$inferInsert;
export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type NewDailyLog = typeof dailyLogs.$inferInsert;

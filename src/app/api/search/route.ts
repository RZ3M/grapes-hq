import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (!q) return NextResponse.json({ ideas: [], tasks: [], sends: [], emails: [] });

  const [allIdeas, allTasks, allSends, allEmails] = await Promise.all([
    db.select().from(schema.ideas),
    db.select().from(schema.tasks),
    db.select().from(schema.sends),
    db.select().from(schema.emails),
  ]);

  const ideas = allIdeas.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      (i.description || "").toLowerCase().includes(q) ||
      JSON.parse(i.tags || "[]").some((t: string) => t.toLowerCase().includes(q))
  );

  const tasks = allTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      JSON.parse(t.tags || "[]").some((tag: string) => tag.toLowerCase().includes(q))
  );

  const sends = allSends.filter(
    (s) =>
      s.url.toLowerCase().includes(q) ||
      (s.title || "").toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q)
  );

  const emails = allEmails.filter(
    (e) =>
      e.subject.toLowerCase().includes(q) ||
      (e.snippet || "").toLowerCase().includes(q) ||
      (e.fromAddress || "").toLowerCase().includes(q)
  );

  return NextResponse.json({ ideas, tasks, sends, emails });
}

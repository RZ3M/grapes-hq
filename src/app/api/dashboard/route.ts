import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const [allIdeas, allTasks, allSends, allEmails] = await Promise.all([
    db.select().from(schema.ideas).orderBy(asc(schema.ideas.createdAt)),
    db.select().from(schema.tasks).orderBy(asc(schema.tasks.createdAt)),
    db.select().from(schema.sends).orderBy(asc(schema.sends.createdAt)),
    db.select().from(schema.emails).orderBy(asc(schema.emails.capturedAt)),
  ]);

  const dueToday = allTasks.filter((t) => t.dueDate?.split("T")[0] === today && t.status !== "done");
  const inProgress = [...allTasks.filter((t) => t.status === "in-progress"), ...allIdeas.filter((i) => i.status === "in-progress")];
  const recentItems = [...allTasks, ...allIdeas].sort((a, b) => ((b.createdAt || "") > (a.createdAt || "") ? 1 : -1)).slice(-5);

  const jobSearchTag = "job-search";
  const jobSearchTasks = allTasks.filter((t) => {
    const tags = JSON.parse(t.tags || "[]") as string[];
    return tags.includes(jobSearchTag);
  });

  const interestingIdeas = allIdeas.filter((i) => i.status === "new" || i.status === "interesting");

  const recentSends = allSends.sort((a, b) => ((a.createdAt || "") > (b.createdAt || "") ? 1 : -1)).slice(-5);

  return NextResponse.json({
    dueToday,
    inProgress,
    recentItems: recentItems.reverse(),
    jobSearchTasks,
    interestingIdeas,
    recentSends,
    stats: {
      ideas: allIdeas.length,
      tasks: allTasks.length,
      sends: allSends.length,
      emails: allEmails.length,
    },
  });
}

"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "./ItemCard";
import { QuickAddForm } from "./QuickAddForm";
import { TagChip } from "./TagChip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, CheckSquare, Send, Clock, AlertCircle } from "lucide-react";

interface DashboardData {
  dueToday: any[];
  inProgress: any[];
  recentItems: any[];
  jobSearchTasks: any[];
  interestingIdeas: any[];
  recentSends: any[];
  stats: { ideas: number; tasks: number; sends: number; emails: number };
}

async function fetchDashboard(): Promise<DashboardData | null> {
  try {
    const res = await fetch("/api/dashboard");
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return null;
  }
}

async function deleteItem(type: string, id: string) {
  await fetch(`/api/${type}/${id}?id=${id}`, { method: "DELETE" });
}

async function addItem(type: "idea" | "task" | "send", data: any) {
  await fetch(`/api/${type}s`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function DashboardPanels() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const d = await fetchDashboard();
    setData(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (type: "idea" | "task" | "send", payload: any) => {
    await addItem(type, payload);
    await load();
  };

  const handleDelete = async (type: string, id: string) => {
    await deleteItem(type, id);
    await load();
  };

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3"><div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" /></CardHeader>
            <CardContent><div className="space-y-2">{[...Array(3)].map((_, j) => <div key={j} className="h-16 bg-zinc-800/50 rounded animate-pulse" />)}</div></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <AlertCircle className="w-8 h-8 mb-3" />
        <p>Failed to load dashboard. Refresh to try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QuickAddForm onAdd={handleAdd} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Due Today */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-sm font-medium text-zinc-200">Due Today</CardTitle>
            {data.dueToday.length > 0 && (
              <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                {data.dueToday.length}
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {data.dueToday.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No tasks due today</p>
            ) : (
              data.dueToday.map((t) => (
                <ItemCard key={t.id} {...t} type="task" tags={t.tags} createdAt={t.createdAt} onDelete={() => handleDelete("tasks", t.id)} />
              ))
            )}
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-sm font-medium text-zinc-200">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.inProgress.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">Nothing in progress</p>
            ) : (
              data.inProgress.map((item: any) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  type={item.title !== undefined ? "task" : "idea"}
                  title={item.title}
                  description={item.description}
                  status={item.status}
                  tags={item.tags}
                  createdAt={item.createdAt}
                  onDelete={() => handleDelete(item.title !== undefined ? "tasks" : "ideas", item.id)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Job Search */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <CheckSquare className="w-4 h-4 text-green-500" />
            <CardTitle className="text-sm font-medium text-zinc-200">Job Search</CardTitle>
            <span className="ml-auto text-xs text-zinc-500">{data.jobSearchTasks.length} tasks</span>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.jobSearchTasks.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No job search tasks</p>
            ) : (
              data.jobSearchTasks.slice(0, 5).map((t: any) => (
                <ItemCard key={t.id} {...t} type="task" tags={t.tags} createdAt={t.createdAt} onDelete={() => handleDelete("tasks", t.id)} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Ideas */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-sm font-medium text-zinc-200">Interesting Ideas</CardTitle>
            <span className="ml-auto text-xs text-zinc-500">{data.interestingIdeas.length}</span>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.interestingIdeas.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No ideas yet</p>
            ) : (
              data.interestingIdeas.slice(0, 5).map((i: any) => (
                <ItemCard key={i.id} {...i} type="idea" tags={i.tags} createdAt={i.createdAt} onDelete={() => handleDelete("ideas", i.id)} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Sends */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <Send className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-sm font-medium text-zinc-200">Recent Sends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentSends.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No sends saved</p>
            ) : (
              data.recentSends.map((s: any) => (
                <ItemCard key={s.id} {...s} type="send" tags={s.tags} createdAt={s.createdAt} onDelete={() => handleDelete("sends", s.id)} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-200">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Ideas", value: data.stats.ideas, icon: Lightbulb, color: "text-amber-500" },
                { label: "Tasks", value: data.stats.tasks, icon: CheckSquare, color: "text-blue-500" },
                { label: "Sends", value: data.stats.sends, icon: Send, color: "text-green-500" },
                { label: "Emails", value: data.stats.emails, icon: Clock, color: "text-zinc-500" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3 bg-zinc-800/50 rounded-lg p-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <div>
                    <div className="text-lg font-semibold text-zinc-100">{value}</div>
                    <div className="text-xs text-zinc-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

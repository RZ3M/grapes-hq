"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "@/components/ItemCard";
import { QuickAddForm } from "@/components/QuickAddForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const ideaColumns = [
  { id: "new", label: "New" },
  { id: "interesting", label: "Interesting" },
  { id: "in-progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

const taskColumns = [
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In Progress" },
  { id: "blocked", label: "Blocked" },
  { id: "done", label: "Done" },
];

async function fetchIdeas() {
  const res = await fetch("/api/ideas");
  const data = await res.json();
  return data.ideas || [];
}

async function fetchTasks() {
  const res = await fetch("/api/tasks");
  const data = await res.json();
  return data.tasks || [];
}

async function updateStatus(type: string, id: string, status: string) {
  await fetch(`/api/${type}s`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
}

async function deleteItem(type: string, id: string) {
  await fetch(`/api/${type}/${id}?id=${id}`, { method: "DELETE" });
}

async function addItem(type: "idea" | "task", data: any) {
  await fetch(`/api/${type}s`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export default function KanbanPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [i, t] = await Promise.all([fetchIdeas(), fetchTasks()]);
    setIdeas(i);
    setTasks(t);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (type: "idea" | "task", payload: any) => {
    await addItem(type, payload);
    await load();
  };

  const handleSendAdd = async (payload: any) => {
    await fetch("/api/sends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  const handleDrop = async (itemId: string, type: "idea" | "task", newStatus: string) => {
    await updateStatus(type, itemId, newStatus);
    await load();
  };

  const handleDelete = async (type: string, id: string) => {
    await deleteItem(type, id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-100">Kanban</h1>
      </div>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="ideas" className="data-[state=active]:bg-zinc-800">Ideas</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-zinc-800">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="mt-4">
          <QuickAddForm onAdd={(type, data) => { if (type !== "send") handleAdd(type as "idea" | "task", data); else handleSendAdd(data); }} />
          <div className="grid grid-cols-4 gap-4 mt-4">
            {ideaColumns.map((col) => {
              const items = ideas.filter((i) => i.status === col.id);
              return (
                <div key={col.id} className="bg-zinc-900/50 rounded-lg p-3 min-h-[400px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-zinc-300">{col.label}</h3>
                    <span className="text-xs text-zinc-600">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragEnd={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          if (x < rect.width / 2) {
                            const cols = ideaColumns.map((c) => c.id);
                            const idx = cols.indexOf(col.id);
                            if (idx > 0) handleDrop(item.id, "idea", cols[idx - 1]);
                          } else {
                            const cols = ideaColumns.map((c) => c.id);
                            const idx = cols.indexOf(col.id);
                            if (idx < cols.length - 1 && cols[idx + 1] !== "done") {
                              handleDrop(item.id, "idea", cols[idx + 1]);
                            }
                          }
                        }}
                      >
                        <ItemCard
                          {...item}
                          type="idea"
                          tags={item.tags}
                          createdAt={item.createdAt}
                          onDelete={() => handleDelete("ideas", item.id)}
                        />
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p className="text-xs text-zinc-600 py-8 text-center">Nothing here yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <QuickAddForm onAdd={(type, data) => handleAdd("task", data)} />
          <div className="grid grid-cols-4 gap-4 mt-4">
            {taskColumns.map((col) => {
              const items = tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="bg-zinc-900/50 rounded-lg p-3 min-h-[400px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-zinc-300">{col.label}</h3>
                    <span className="text-xs text-zinc-600">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <ItemCard
                        key={item.id}
                        {...item}
                        type="task"
                        tags={item.tags}
                        dueDate={item.dueDate}
                        createdAt={item.createdAt}
                        onDelete={() => handleDelete("tasks", item.id)}
                      />
                    ))}
                    {items.length === 0 && (
                      <p className="text-xs text-zinc-600 py-8 text-center">Nothing here yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

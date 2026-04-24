"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "@/components/ItemCard";
import { QuickAddForm } from "@/components/QuickAddForm";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

type FilterType = "all" | "idea" | "task";

export default function ListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  const load = async () => {
    setLoading(true);
    const [ideasRes, tasksRes] = await Promise.all([
      fetch("/api/ideas"),
      fetch("/api/tasks"),
    ]);
    const ideasData = await ideasRes.json();
    const tasksData = await tasksRes.json();
    const combined = [
      ...(ideasData.ideas || []).map((i: any) => ({ ...i, itemType: "idea" })),
      ...(tasksData.tasks || []).map((t: any) => ({ ...t, itemType: "task" })),
    ];
    setItems(combined);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (type: "idea" | "task" | "send", data: any) => {
    await fetch(`/api/${type}s`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await load();
  };

  const handleDelete = async (type: string, id: string) => {
    await fetch(`/api/${type}/${id}?id=${id}`, { method: "DELETE" });
    await load();
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.itemType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-100">List View</h1>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100"
          />
        </div>
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-md p-1">
          {(["all", "idea", "task"] as FilterType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                typeFilter === t ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <QuickAddForm onAdd={handleAdd} />

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-zinc-900/50 rounded animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          <p>{search || typeFilter !== "all" ? "No matching items." : "Nothing here yet. Add something above."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <ItemCard
              key={`${item.itemType}-${item.id}`}
              id={item.id}
              type={item.itemType}
              title={item.title}
              description={item.description}
              status={item.status}
              tags={item.tags}
              dueDate={item.dueDate}
              source={item.source}
              createdAt={item.createdAt}
              onDelete={() => handleDelete(item.itemType === "idea" ? "ideas" : "tasks", item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

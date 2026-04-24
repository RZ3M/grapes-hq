"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "@/components/ItemCard";
import { QuickAddForm } from "@/components/QuickAddForm";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Trash2 } from "lucide-react";

export default function SendsPage() {
  const [sends, setSends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/sends");
    const data = await res.json();
    setSends(data.sends || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (type: "idea" | "task" | "send", data: any) => {
    await fetch("/api/sends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/sends/${id}?id=${id}`, { method: "DELETE" });
    await load();
  };

  const filtered = sends.filter((s) =>
    !search ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.url.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-100">Sends</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sends..."
          className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100"
        />
      </div>

      <QuickAddForm onAdd={handleAdd} />

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-zinc-900/50 rounded animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          <p>{search ? "No matching sends." : "No sends saved yet. Save your first link above."}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filtered.map((s) => {
            const tags = Array.isArray(s.tags) ? s.tags : JSON.parse(s.tags || "[]");
            return (
              <div
                key={s.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 group hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 truncate font-mono"
                      >
                        {s.url}
                        <ExternalLink className="inline w-3 h-3 ml-1 opacity-50" />
                      </a>
                    </div>
                    {s.title && <h4 className="text-sm font-medium text-zinc-200">{s.title}</h4>}
                    {s.description && <p className="text-xs text-zinc-500 mt-1">{s.description}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map((tag: string) => (
                        <span key={tag} className="inline-flex px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

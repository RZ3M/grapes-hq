"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchResult {
  ideas: Array<{ id: string; title: string; status: string }>;
  tasks: Array<{ id: string; title: string; status: string }>;
  sends: Array<{ id: string; title: string; url: string }>;
  emails: Array<{ id: string; subject: string; fromAddress: string }>;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 200);
  }, [query]);

  const total = results
    ? results.ideas.length + results.tasks.length + results.sends.length + results.emails.length
    : 0;

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/50 rounded-md px-3 py-1.5">
        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search... (Cmd+K)"
          className="bg-transparent border-0 p-0 h-5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-500"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {open && query && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-700/50 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-zinc-500">Searching...</div>
          ) : total === 0 ? (
            <div className="p-4 text-sm text-zinc-500">No matches found.</div>
          ) : (
            <div className="py-2">
              {results!.ideas.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Ideas</div>
                  {results!.ideas.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => { router.push("/kanban"); setOpen(false); setQuery(""); }}
                      className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                    >
                      {i.title}
                    </button>
                  ))}
                </div>
              )}
              {results!.tasks.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Tasks</div>
                  {results!.tasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { router.push("/list"); setOpen(false); setQuery(""); }}
                      className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              )}
              {results!.sends.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Sends</div>
                  {results!.sends.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { router.push("/sends"); setOpen(false); setQuery(""); }}
                      className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                    >
                      {s.title || s.url}
                    </button>
                  ))}
                </div>
              )}
              {results!.emails.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-medium text-zinc-500 uppercase">Emails</div>
                  {results!.emails.map((e) => (
                    <div key={e.id} className="px-3 py-2 text-sm text-zinc-200">
                      <div>{e.subject}</div>
                      <div className="text-xs text-zinc-500">{e.fromAddress}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

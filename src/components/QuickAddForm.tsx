"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuickAddFormProps {
  onAdd: (type: "idea" | "task" | "send", data: { title: string; description?: string; tags?: string[]; url?: string }) => void;
}

const types = [
  { id: "idea", label: "Idea" },
  { id: "task", label: "Task" },
  { id: "send", label: "Send" },
] as const;

export function QuickAddForm({ onAdd }: QuickAddFormProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"idea" | "task" | "send">("idea");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, "");
      if (tag && !tags.includes(`#${tag}`)) {
        setTags([...tags, `#${tag}`]);
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(type, {
      title: title.trim(),
      description: description.trim(),
      tags,
      url: url.trim(),
    });
    setTitle("");
    setDescription("");
    setUrl("");
    setTags([]);
    setTagInput("");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full justify-start text-zinc-400 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-200"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add an item...
      </Button>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700/50 rounded-lg p-4 space-y-3">
      <div className="flex gap-1">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={cn(
              "px-3 py-1 rounded text-sm transition-colors",
              type === t.id
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={type === "send" ? "URL" : "Title"}
        className="bg-zinc-800 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      {type !== "send" && (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full bg-zinc-800 border border-zinc-700/50 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none focus:border-zinc-600"
          rows={2}
        />
      )}

      {type === "send" && (
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="bg-zinc-800 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 font-mono text-xs"
        />
      )}

      <div className="flex flex-wrap gap-1 p-2 bg-zinc-800/50 rounded-md border border-zinc-700/50 min-h-[36px]">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded text-xs">
            {tag}
            <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={() => setOpen(false)} variant="ghost" className="text-zinc-400">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500 text-white">
          Add
        </Button>
      </div>
    </div>
  );
}

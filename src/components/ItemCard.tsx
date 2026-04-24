"use client";

import { useState } from "react";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { TagChip } from "./TagChip";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  id: string;
  type: "idea" | "task" | "send";
  title: string;
  description?: string;
  status: string;
  tags: string[];
  source?: string;
  url?: string;
  dueDate?: string | null;
  createdAt: string;
  onUpdate?: (id: string, updates: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
}

export function ItemCard({
  id,
  type,
  title,
  description,
  status,
  tags,
  source,
  url,
  dueDate,
  createdAt,
  onUpdate,
  onDelete,
}: ItemCardProps) {
  const [showActions, setShowActions] = useState(false);
  const tags_parsed = Array.isArray(tags) ? tags : JSON.parse(tags || "[]") as string[];
  const relativeDate = formatRelative(createdAt);

  const typeIcon =
    type === "idea" ? "💡" : type === "task" ? "☑" : "🔗";

  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== "done";
  const isDueToday = dueDate && dueDate.split("T")[0] === new Date().toISOString().split("T")[0];

  return (
    <div
      className={cn(
        "group relative bg-zinc-900 border border-zinc-700/50 rounded-lg p-3 cursor-pointer transition-colors hover:border-zinc-600",
        isOverdue && "border-red-500/50"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={status as any} />
            {isDueToday && !isOverdue && (
              <span className="text-xs text-amber-500">Due today</span>
            )}
            {isOverdue && (
              <span className="text-xs text-red-500">Overdue</span>
            )}
          </div>
          <h4 className="text-sm font-medium text-zinc-100 truncate">{title}</h4>
          {description && (
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{description}</p>
          )}
          {url && (
            <p className="text-xs text-blue-400 mt-1 truncate font-mono">{url}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {tags_parsed.map((tag: string) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
            {source && <span>{source}</span>}
            <span>{relativeDate}</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
            className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function formatRelative(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

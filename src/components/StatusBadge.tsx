"use client";

import { cn } from "@/lib/utils";

type Status = "new" | "interesting" | "in-progress" | "done" | "shelved" | "todo" | "blocked";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/20 text-blue-400" },
  interesting: { label: "Interesting", color: "bg-amber-500/20 text-amber-400" },
  "in-progress": { label: "In Progress", color: "bg-amber-500/20 text-amber-400" },
  done: { label: "Done", color: "bg-green-500/20 text-green-400" },
  shelved: { label: "Shelved", color: "bg-zinc-500/20 text-zinc-400" },
  todo: { label: "Todo", color: "bg-zinc-500/20 text-zinc-400" },
  blocked: { label: "Blocked", color: "bg-red-500/20 text-red-400" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, color: "bg-zinc-500/20 text-zinc-400" };
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded text-xs font-medium", config.color, className)}>
      {config.label}
    </span>
  );
}

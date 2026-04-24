"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagChipProps {
  tag: string;
  removable?: boolean;
  onRemove?: () => void;
  urgent?: boolean;
}

export function TagChip({ tag, removable, onRemove, urgent }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs",
        urgent || tag === "#urgent"
          ? "bg-red-500/20 text-red-400"
          : "bg-zinc-800 text-zinc-400"
      )}
    >
      {tag}
      {removable && (
        <button onClick={onRemove} className="hover:text-zinc-200">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

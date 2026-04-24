"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Settings, Lightbulb, CheckSquare, Send, LayoutDashboard } from "lucide-react";
import { SearchBar } from "./SearchBar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kanban", label: "Kanban", icon: CheckSquare },
  { href: "/list", label: "List", icon: Lightbulb },
  { href: "/sends", label: "Sends", icon: Send },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-700/50 bg-zinc-950/95 backdrop-blur">
      <div className="flex h-14 items-center gap-6 px-6 max-w-[1400px] mx-auto">
        <Link href="/" className="text-base font-semibold text-zinc-50 tracking-tight">
          Grapes HQ
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-zinc-50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        <button className="text-zinc-400 hover:text-zinc-200 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

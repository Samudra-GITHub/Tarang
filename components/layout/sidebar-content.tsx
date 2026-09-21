"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { primaryNavItems, secondaryNavItems } from "@/lib/nav-items";
import { Logo } from "@/components/layout/logo";
import { usePlaylistPickerStore } from "@/lib/store/playlist-picker-store";
import type { NavItem } from "@/types/nav";

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-surface-2 hover:text-foreground",
        active ? "bg-surface-2 text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon
        className={cn("size-5 shrink-0", active && "text-primary")}
        strokeWidth={2}
        aria-hidden
      />
      {item.label}
    </Link>
  );
}

/** Shared nav content for the desktop Sidebar and the mobile Sheet menu. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const openPlaylistPicker = usePlaylistPickerStore((s) => s.open);

  return (
    <div className="flex h-full flex-col px-3 py-4">
      <Logo className="px-3 pb-6" />

      <nav className="flex flex-col gap-1" aria-label="Primary">
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <Separator className="my-4" />

      <nav className="flex flex-col gap-1" aria-label="Secondary">
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <Separator className="my-4" />

      <button
        type="button"
        onClick={() => {
          openPlaylistPicker();
          onNavigate?.();
        }}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <ListPlus className="size-5 shrink-0" strokeWidth={2} aria-hidden />
        New Playlist
      </button>

      <div className="mt-auto px-3 pt-4 text-xs text-muted-foreground">
        <p>Tarang · तरङ्ग</p>
      </div>
    </div>
  );
}

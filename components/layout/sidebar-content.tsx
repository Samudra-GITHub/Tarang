"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ListPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { primaryNavItems, secondaryNavItems } from "@/lib/nav-items";
import { Logo } from "@/components/layout/logo";
import { usePlaylistPickerStore } from "@/lib/store/playlist-picker-store";
import { useProfileStore, initialFromName } from "@/lib/store/profile-store";
import { useDownloadsStore, QUALITY_MB_PER_SONG } from "@/lib/store/downloads-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { NavItem } from "@/types/nav";

/** A tiny 3-bar equalizer flourish marking the active nav item. */
function MiniEqualizer() {
  const reduced = useReducedMotion();
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.5, 1, 0.7].map((peak, index) => (
        <motion.span
          key={index}
          className="w-[2px] rounded-full bg-primary"
          initial={{ height: "30%" }}
          animate={reduced ? undefined : { height: ["30%", `${peak * 100}%`, "30%"] }}
          transition={{ duration: 0.9 + index * 0.15, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
        />
      ))}
    </span>
  );
}

function NavLink({
  item,
  active,
  expanded,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  expanded: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-colors",
        "hover:bg-white/[0.05]",
        active
          ? "border border-white/[0.08] bg-white/[0.06] text-foreground"
          : "border border-transparent text-muted-foreground",
      )}
    >
      <Icon className={cn("size-5 shrink-0", active && "text-primary")} strokeWidth={2} aria-hidden />
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden whitespace-nowrap"
          >
            {item.label}
            {active && <MiniEqualizer />}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

/** Shared nav content for the desktop Sidebar (hover-expand) and the mobile Sheet menu (always expanded). */
export function SidebarContent({
  expanded = true,
  onNavigate,
}: {
  expanded?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const openPlaylistPicker = usePlaylistPickerStore((s) => s.open);
  const name = useProfileStore((s) => s.name);
  const downloadedCount = useDownloadsStore((s) => s.downloadedSongIds.length);
  const quality = useDownloadsStore((s) => s.quality);
  const usedMb = Math.round(downloadedCount * QUALITY_MB_PER_SONG[quality]);
  const usedFraction = Math.min(usedMb / 500, 1);

  return (
    <div className="flex h-full flex-col overflow-hidden px-3 py-4">
      <div className="flex h-10 items-center px-1 pb-6">
        {expanded ? (
          <Logo />
        ) : (
          <span lang="sa" className="font-devanagari text-2xl text-primary">
            त
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-1" aria-label="Primary">
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            expanded={expanded}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <Separator className="my-4 bg-white/[0.06]" />

      <nav className="flex flex-col gap-1" aria-label="Secondary">
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            expanded={expanded}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <Separator className="my-4 bg-white/[0.06]" />

      <button
        type="button"
        onClick={() => {
          openPlaylistPicker();
          onNavigate?.();
        }}
        className="flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05]"
      >
        <ListPlus className="size-5 shrink-0" strokeWidth={2} aria-hidden />
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              New Playlist
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Profile chip */}
      <div className="mt-auto flex items-center gap-3 rounded-2xl px-2 pt-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-sm font-semibold text-foreground">
          {initialFromName(name)}
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="min-w-0 flex-1 overflow-hidden"
            >
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-primary/70 transition-[width] duration-500"
                  style={{ width: `${usedFraction * 100}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] whitespace-nowrap text-muted-foreground">
                {usedMb > 0 ? `${usedMb} MB downloaded` : "No downloads yet"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

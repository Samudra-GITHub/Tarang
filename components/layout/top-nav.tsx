"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/layout/logo";
import { MobileSidebarSheet } from "@/components/layout/mobile-sidebar-sheet";
import { initialFromName, useProfileStore } from "@/lib/store/profile-store";
import { GLASS_PILL } from "@/lib/glass";
import { cn } from "@/lib/utils";

export function TopNav() {
  const router = useRouter();
  const name = useProfileStore((s) => s.name);
  const signOut = useProfileStore((s) => s.signOut);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 px-4 md:px-6">
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1 md:flex">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Go forward"
            onClick={() => router.forward()}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <MobileSidebarSheet />
        <Logo className="md:hidden" />
      </div>

      <div className="flex min-w-0 flex-1 justify-center md:justify-start md:pl-2">
        <Button
          asChild
          variant="secondary"
          className={cn(
            "h-10 w-full min-w-0 max-w-sm justify-start gap-2 bg-transparent text-muted-foreground shadow-none hover:bg-white/[0.14] hover:text-foreground",
            GLASS_PILL,
          )}
        >
          <Link href="/search">
            <Search className="size-4 shrink-0" aria-hidden />
            <span className="truncate text-sm">Search songs, artists, albums…</span>
          </Link>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Account menu"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-surface-2 text-sm font-medium">
                {initialFromName(name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <User className="size-4" aria-hidden />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="size-4" aria-hidden />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => signOut()}>
            <LogOut className="size-4" aria-hidden />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

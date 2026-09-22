"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "@/lib/nav-items";
import { SafeArea } from "@/components/layout/safe-area";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <SafeArea edge="bottom" className="shrink-0 border-t border-border bg-background md:hidden">
      <nav aria-label="Primary" className="flex h-14 items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1.5 text-mono font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" strokeWidth={2} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </SafeArea>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex flex-col leading-none transition-transform duration-300 hover:scale-[1.03]",
        className,
      )}
    >
      <span
        lang="sa"
        className="font-devanagari text-3xl text-primary drop-shadow-[0_0_18px_rgba(45,212,191,0.35)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_24px_rgba(45,212,191,0.55)]"
      >
        तरङ्ग
      </span>
      <span className="mt-0.5 text-[10px] font-medium tracking-[0.35em] text-muted-foreground uppercase">
        Tarang
      </span>
    </Link>
  );
}

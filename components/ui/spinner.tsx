import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "size-5 animate-spin rounded-full border-2 border-white/15 border-t-primary",
        className,
      )}
    />
  );
}

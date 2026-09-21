import type { LucideIcon } from "lucide-react";

export function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="size-4" aria-hidden />}
        <span className="text-xs">{label}</span>
      </div>
      <span className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}

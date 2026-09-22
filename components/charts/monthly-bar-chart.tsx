import { Mono } from "@/components/ui/typography";

export function MonthlyBarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-3 border-b border-border pb-0">
      {data.map((d) => {
        const heightPct = Math.max((d.count / max) * 100, d.count > 0 ? 4 : 0);
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <Mono>{d.count}</Mono>
            <div className="flex h-28 w-full items-end justify-center">
              <div
                className="w-6 max-w-full rounded-t-[4px] bg-primary"
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="pb-2 text-xs text-muted-foreground">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

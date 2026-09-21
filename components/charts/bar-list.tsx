import Link from "next/link";

export interface BarListItem {
  key: string;
  label: string;
  value: number;
  href?: string;
}

export function BarList({ items }: { items: BarListItem[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const pct = (item.value / max) * 100;
        const content = (
          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-sm text-foreground sm:w-36">
              {item.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-[4px] bg-surface-2">
              <div
                className="h-full rounded-r-[4px] bg-primary"
                style={{ width: `${Math.max(pct, 3)}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {item.value}
            </span>
          </div>
        );

        return item.href ? (
          <Link
            key={item.key}
            href={item.href}
            className="-mx-2 rounded-md px-2 py-1 hover:bg-surface-2"
          >
            {content}
          </Link>
        ) : (
          <div key={item.key}>{content}</div>
        );
      })}
    </div>
  );
}

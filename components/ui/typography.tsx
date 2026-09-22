import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PolymorphicProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

function makeText<TDefault extends ElementType>(
  defaultTag: TDefault,
  baseClassName: string,
) {
  return forwardRef<Element, PolymorphicProps<ElementType>>(function TextComponent(
    { as, className, children, ...props },
    ref,
  ) {
    const Tag = (as ?? defaultTag) as ElementType;
    return (
      <Tag ref={ref as never} className={cn(baseClassName, className)} {...props}>
        {children}
      </Tag>
    );
  });
}

/** The big, page-defining title — Home hero, collection/artist/mood headers. */
export const Display = makeText(
  "h1",
  "font-heading text-display font-bold tracking-tight text-balance md:text-6xl",
);

/** A page's own H1 — Library, Stats, Downloads, Moods, Settings, ... */
export const Heading = makeText(
  "h1",
  "font-heading text-heading font-semibold tracking-tight",
);

/** A section header within a page — rail titles, "Curated Playlists", "Mood Mix". */
export const Title = makeText(
  "h2",
  "font-heading text-title font-semibold tracking-tight",
);

/** Primary readable content — descriptions, card titles, list text. */
export const Body = makeText("p", "text-body text-foreground");

/** A small, uppercase, tracked eyebrow — "ALBUM", "PLAYING FROM", "JUMP BACK IN". */
export const Label = makeText(
  "span",
  "text-label font-medium tracking-wide text-muted-foreground uppercase",
);

/** Secondary metadata in sentence case — durations, counts, helper text. */
export const Caption = makeText("span", "text-caption text-muted-foreground");

/** Timecodes and numeric counters — always tabular, always this one size. */
export const Mono = makeText(
  "span",
  "text-mono font-mono text-muted-foreground tabular-nums",
);

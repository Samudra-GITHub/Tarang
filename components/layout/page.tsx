import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Heading, Caption } from "@/components/ui/typography";

const PAGE_SPACING = {
  /** List pages — Downloads, Library, Search, Moods, Stats, Settings. */
  md: "gap-6 py-6",
  /** Detail pages — Artist, Album, Playlist (header sits full-bleed above this). */
  lg: "gap-8 pb-10",
  /** Home — hero-led, needs more room to breathe than a list page. */
  xl: "gap-10 pb-10",
} as const;

export interface PageProps {
  /** Vertical rhythm (and matching top/bottom padding) for this page's role. */
  spacing?: keyof typeof PAGE_SPACING;
  className?: string;
  children?: ReactNode;
}

/** The root flex-column every screen renders into — the one place page-level vertical rhythm is defined. */
function Page({ spacing = "md", className, children }: PageProps) {
  return <div className={cn("flex flex-col", PAGE_SPACING[spacing], className)}>{children}</div>;
}

export interface PageContainerProps {
  /** Constrains and centers content — Settings and the Design System playground read best at a fixed width. */
  maxWidth?: "2xl" | "4xl";
  className?: string;
  children: ReactNode;
}

const MAX_WIDTH = {
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
} as const;

/** The shared horizontal gutter (`px-4 md:px-6`) every page's content sits inside. */
function PageContainer({ maxWidth, className, children }: PageContainerProps) {
  return (
    <div
      className={cn(
        "px-4 md:px-6",
        maxWidth && cn("mx-auto w-full", MAX_WIDTH[maxWidth]),
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/** A page's title row — heading, optional description, optional trailing action (e.g. "Clear all"). */
function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <div>
        <Heading>{title}</Heading>
        {description && <Caption className="mt-1 block">{description}</Caption>}
      </div>
      {actions}
    </div>
  );
}

export { Page, PageContainer, PageHeader };

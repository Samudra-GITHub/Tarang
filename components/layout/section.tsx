import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Title, Caption } from "@/components/ui/typography";

export interface SectionProps {
  className?: string;
  children: ReactNode;
}

/** A titled block within a page — a rail, a stat group, a settings card group. */
function Section({ className, children }: SectionProps) {
  return <section className={cn("flex flex-col gap-3", className)}>{children}</section>;
}

/** The row a section's title (and an optional trailing action) sits in. */
function SectionHeader({ className, children }: SectionProps) {
  return <div className={cn("flex items-center justify-between gap-4", className)}>{children}</div>;
}

export interface SectionTitleProps {
  /** Renders as this HTML tag instead of Title's default `h2` — e.g. `h3` for a subsection. */
  as?: "h2" | "h3" | "h4";
  className?: string;
  children: ReactNode;
}

/** A section's own heading — thin wrapper over the Title typography component. */
function SectionTitle({ as, className, children }: SectionTitleProps) {
  return (
    <Title as={as} className={className}>
      {children}
    </Title>
  );
}

/** A section's supporting line, directly under its title. */
function SectionDescription({ className, children }: SectionTitleProps) {
  return <Caption className={cn("block", className)}>{children}</Caption>;
}

/** The body of a section, below its header — cards, a list, a chart. */
function SectionContent({ className, children }: SectionProps) {
  return <div className={className}>{children}</div>;
}

export { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent };

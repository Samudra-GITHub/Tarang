import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps {
  icon: LucideIcon;
  size?: "xs" | "sm" | "md" | "lg";
  /** Semantic color — omit to inherit the surrounding text color. */
  tone?: "current" | "muted" | "primary" | "danger";
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
}

const SIZE_CLASSES = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

const TONE_CLASSES = {
  current: "",
  muted: "text-muted-foreground",
  primary: "text-primary",
  danger: "text-destructive",
} as const;

/**
 * The one wrapper around every Lucide glyph in Tarang — fixes stroke width and
 * maps size/color onto design tokens instead of ad-hoc `size-4 text-...` pairs.
 */
function Icon({ icon: LucideGlyph, size = "sm", tone = "current", className, ...props }: IconProps) {
  return (
    <LucideGlyph
      strokeWidth={2}
      className={cn(SIZE_CLASSES[size], TONE_CLASSES[tone], className)}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    />
  );
}

export { Icon };

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ScrollContainerProps {
  /** The semantic element to render — `"main"` for the app shell's primary scroll region. */
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: `aria-${string}`]: unknown;
}

/** The single scrollable region every page renders into — the app shell's `<main>`, dialogs' scrollable bodies. */
function ScrollContainer({ as: Tag = "div", className, children, ...props }: ScrollContainerProps) {
  return (
    <Tag className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)} {...props}>
      {children}
    </Tag>
  );
}

export { ScrollContainer };

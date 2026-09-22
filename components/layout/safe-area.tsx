import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SafeAreaProps {
  /** Which edge(s) to pad for the device's safe area (notches, home indicators). */
  edge?: "top" | "bottom" | "both";
  className?: string;
  children: ReactNode;
}

const EDGE_STYLE: Record<NonNullable<SafeAreaProps["edge"]>, CSSProperties> = {
  top: { paddingTop: "env(safe-area-inset-top)" },
  bottom: { paddingBottom: "env(safe-area-inset-bottom)" },
  both: { paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" },
};

/** Adds the device's safe-area inset as real padding — the bottom nav and top nav sit inside this. */
function SafeArea({ edge = "bottom", className, children }: SafeAreaProps) {
  return (
    <div className={cn(className)} style={EDGE_STYLE[edge]}>
      {children}
    </div>
  );
}

export { SafeArea };

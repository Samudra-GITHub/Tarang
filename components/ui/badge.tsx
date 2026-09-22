import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2 text-label font-medium tracking-wide whitespace-nowrap uppercase [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-muted-foreground",
        live: "bg-accent-danger/15 text-accent-danger",
        explicit: "bg-surface-3 text-foreground",
        premium: "bg-accent-warning/15 text-accent-warning",
        offline: "bg-surface-2 text-muted-foreground",
        new: "bg-primary/15 text-primary",
        downloaded: "bg-primary/15 text-primary",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

/** A small semantic status marker — Live, Explicit, Premium, Offline, New, Downloaded. */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

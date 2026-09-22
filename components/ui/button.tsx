import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FOCUS_RING } from "@/lib/a11y";

const buttonVariants = cva(
  cn(
    "group/button relative inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-out select-none focus-visible:border-border-focus active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    FOCUS_RING,
  ),
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-surface-2 text-foreground hover:bg-surface-3",
        ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        outline:
          "border-border-strong bg-transparent text-foreground hover:bg-surface-2",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        // Touch targets under 44px get an invisible `before:` hit-area expansion
        // (no visual change) so every tap target meets the 44x44px minimum.
        sm: "h-8 gap-1 px-3 text-xs before:absolute before:inset-y-[-6px] before:inset-x-0 before:content-[''] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        md: "h-9 px-4 before:absolute before:inset-y-[-4px] before:inset-x-0 before:content-[''] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9 before:absolute before:inset-[-4px] before:content-['']",
        "icon-sm": "size-8 before:absolute before:inset-[-6px] before:content-['']",
        "icon-lg": "size-11",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * The one Button underlying every clickable surface in Tarang — Primary, Secondary,
 * Ghost, Outline and Destructive variants, plus loading/icon-slot/full-width support.
 * IconButton, PlayButton and FAB are all thin compositions over this same primitive.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    fullWidth,
    asChild = false,
    loading = false,
    disabled,
    iconStart,
    iconEnd,
    children,
    ...props
  },
  ref,
) {
  const sharedProps = {
    "data-slot": "button",
    "data-variant": variant,
    "data-size": size,
    className: cn(buttonVariants({ variant, size, fullWidth, className })),
    disabled: disabled || loading,
    "aria-busy": loading || undefined,
    ...props,
  };

  // `asChild` hands rendering to a single child element (Radix Slot) — icon slots and the
  // loading spinner only make sense for a button that renders its own content, so skip them here.
  if (asChild) {
    return (
      <Slot.Root ref={ref as never} {...sharedProps}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button ref={ref} {...sharedProps}>
      {loading ? (
        <Spinner className="size-4 border-current/25 border-t-current" />
      ) : (
        <>
          {iconStart && (
            <span data-icon="inline-start" aria-hidden>
              {iconStart}
            </span>
          )}
          {children}
          {iconEnd && (
            <span data-icon="inline-end" aria-hidden>
              {iconEnd}
            </span>
          )}
        </>
      )}
    </button>
  );
});

export { Button, buttonVariants };

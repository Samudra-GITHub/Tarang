import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  state?: "default" | "error" | "success";
  helperText?: string;
}

const STATE_BORDER = {
  default: "border-input focus-visible:border-border-focus focus-visible:ring-ring/50",
  error: "border-accent-danger focus-visible:border-accent-danger focus-visible:ring-accent-danger/30",
  success: "border-accent-success focus-visible:border-accent-success focus-visible:ring-accent-success/30",
} as const;

const HELPER_TEXT_COLOR = {
  default: "text-muted-foreground",
  error: "text-accent-danger",
  success: "text-accent-success",
} as const;

/** The base text field underlying SearchInput, PasswordInput and TextArea. */
const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, state = "default", helperText, id, ...props },
  ref,
) {
  const helperId = helperText ? `${id ?? props.name ?? "field"}-helper` : undefined;

  const input = (
    <input
      ref={ref}
      id={id}
      type={type}
      data-slot="input"
      aria-invalid={state === "error" || undefined}
      aria-describedby={helperId}
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40",
        STATE_BORDER[state],
        className,
      )}
      {...props}
    />
  );

  if (!helperText) return input;

  return (
    <div className="flex flex-col gap-1">
      {input}
      <p id={helperId} className={cn("text-xs", HELPER_TEXT_COLOR[state])}>
        {helperText}
      </p>
    </div>
  );
});

export { Input };

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface IconButtonProps extends Omit<ButtonProps, "size" | "iconStart" | "iconEnd"> {
  size?: "sm" | "md" | "lg";
  /** Required — an icon-only button has no visible text for assistive tech to read. */
  "aria-label": string;
}

const ICON_SIZE_MAP = { sm: "icon-sm", md: "icon", lg: "icon-lg" } as const;

/** A round, icon-only Button — transport controls, overflow menus, header actions. */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "ghost", size = "md", className, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={ICON_SIZE_MAP[size]}
      className={className}
      {...props}
    />
  );
});

export { IconButton };

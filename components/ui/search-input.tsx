"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<InputProps, "type" | "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

/** A text input with a leading search glyph and a clear button once it has a value. */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange, onClear, className, ...props },
  ref,
) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn("pl-9", value && "pr-9", className)}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(""))}
          aria-label="Clear search"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
});

export { SearchInput };

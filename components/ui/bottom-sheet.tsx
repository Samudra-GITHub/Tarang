"use client";

import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** A Sheet fixed to the bottom edge — song popups, credits, queue actions on mobile. */
function BottomSheet(props: React.ComponentProps<typeof Sheet>) {
  return <Sheet {...props} />;
}

function BottomSheetContent({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SheetContent>, "side">) {
  return <SheetContent side="bottom" className={className} {...props} />;
}

export {
  BottomSheet,
  BottomSheetContent,
  SheetClose as BottomSheetClose,
  SheetDescription as BottomSheetDescription,
  SheetFooter as BottomSheetFooter,
  SheetHeader as BottomSheetHeader,
  SheetTitle as BottomSheetTitle,
  SheetTrigger as BottomSheetTrigger,
};

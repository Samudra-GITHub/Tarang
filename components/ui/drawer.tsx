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

/** A Sheet fixed to a left/right edge — the Queue, mobile navigation. */
function Drawer(props: React.ComponentProps<typeof Sheet>) {
  return <Sheet {...props} />;
}

function DrawerContent({
  side = "right",
  className,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  return <SheetContent side={side} className={className} {...props} />;
}

export {
  Drawer,
  DrawerContent,
  SheetClose as DrawerClose,
  SheetDescription as DrawerDescription,
  SheetFooter as DrawerFooter,
  SheetHeader as DrawerHeader,
  SheetTitle as DrawerTitle,
  SheetTrigger as DrawerTrigger,
};

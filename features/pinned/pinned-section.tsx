"use client";

import { Pin } from "lucide-react";
import { usePinsStore } from "@/lib/store/pins-store";
import { PinnedItemCard } from "@/components/cards/pinned-item-card";
import { HorizontalRail } from "@/components/layout/horizontal-rail";

export function PinnedSection({ className }: { className?: string }) {
  const pins = usePinsStore((state) => state.pins);
  if (pins.length === 0) return null;

  return (
    <HorizontalRail
      className={className}
      animate={false}
      title={
        <>
          <Pin className="size-4 text-primary" aria-hidden />
          Pinned
        </>
      }
    >
      {pins.map((pin) => (
        <PinnedItemCard key={`${pin.kind}-${pin.id}`} pin={pin} />
      ))}
    </HorizontalRail>
  );
}

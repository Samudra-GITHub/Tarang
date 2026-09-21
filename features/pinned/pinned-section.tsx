"use client";

import { Pin } from "lucide-react";
import { usePinsStore } from "@/lib/store/pins-store";
import { PinnedItemCard } from "@/components/cards/pinned-item-card";

export function PinnedSection({ className }: { className?: string }) {
  const pins = usePinsStore((state) => state.pins);
  if (pins.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex items-center gap-2 px-4 md:px-6">
        <Pin className="size-4 text-primary" aria-hidden />
        <h2 className="font-heading text-lg font-semibold tracking-tight">Pinned</h2>
      </div>
      <div className="mt-3 flex gap-4 overflow-x-auto px-4 pb-2 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pins.map((pin) => (
          <PinnedItemCard key={`${pin.kind}-${pin.id}`} pin={pin} />
        ))}
      </div>
    </section>
  );
}

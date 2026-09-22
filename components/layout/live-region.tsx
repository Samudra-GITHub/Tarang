"use client";

import { useEffect, useState } from "react";
import { useAnnounceStore } from "@/lib/store/announce-store";
import { usePlayerAnnouncements } from "@/hooks/use-player-announcements";

/**
 * The one `aria-live` region for player/queue transport announcements — mounted
 * once in the app shell. Cleared and re-set on every change (even a repeated
 * message) so screen readers re-announce identical consecutive states, e.g.
 * "Paused" firing twice in a row.
 */
export function LiveRegion() {
  usePlayerAnnouncements();
  const message = useAnnounceStore((s) => s.message);
  const count = useAnnounceStore((s) => s.count);
  const [text, setText] = useState("");

  useEffect(() => {
    if (count === 0) return;
    setText("");
    const timer = setTimeout(() => setText(message), 30);
    return () => clearTimeout(timer);
  }, [count, message]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {text}
    </div>
  );
}

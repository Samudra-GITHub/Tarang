"use client";

import { useEffect, useState } from "react";

const FALLBACK = "#141414";

/** Deterministic fallback so a track always gets a stable, distinct tint. */
function hashColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 35%, 18%)`;
}

/**
 * Samples the average color of an image via canvas for a "dynamic background
 * derived from album colors" effect. Falls back to a deterministic hue when
 * the image can't be read (e.g. a tainted canvas from a CORS-restricted host).
 */
export function useDominantColor(src: string | undefined): string {
  const [color, setColor] = useState(() => (src ? hashColor(src) : FALLBACK));

  useEffect(() => {
    if (!src) {
      setColor(FALLBACK);
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      try {
        const size = 24;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        setColor(`rgb(${r}, ${g}, ${b})`);
      } catch {
        setColor(hashColor(src));
      }
    };

    img.onerror = () => {
      if (!cancelled) setColor(hashColor(src));
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return color;
}

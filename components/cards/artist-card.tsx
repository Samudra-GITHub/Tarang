"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Artist } from "@/types/music";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { useTilt } from "@/hooks/use-tilt";
import { springSnappy } from "@/lib/motion";

export function ArtistCard({ artist }: { artist: Artist }) {
  const glow = useDominantColor(artist.coverUrl);
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(6);

  const glowVars = {
    "--glow-rest": `color-mix(in srgb, ${glow} 10%, transparent)`,
    "--glow-hover": `color-mix(in srgb, ${glow} 50%, transparent)`,
  } as CSSProperties;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={springSnappy}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group w-32 shrink-0 text-center sm:w-36"
    >
      <Link href={`/artist/${artist.id}`} className="focus-visible:outline-2 focus-visible:outline-ring">
        <div
          style={glowVars}
          className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full bg-surface-2 shadow-[0_10px_25px_-10px_var(--glow-rest)] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_-10px_var(--glow-hover)] sm:w-32"
        >
          <Image
            src={artist.coverUrl}
            alt=""
            fill
            sizes="128px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
        <p className="mt-2 truncate text-sm font-medium text-foreground group-hover:underline">
          {artist.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{artist.genre}</p>
      </Link>
    </motion.div>
  );
}

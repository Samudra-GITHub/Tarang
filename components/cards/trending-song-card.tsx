"use client";

import { motion } from "framer-motion";
import type { Song } from "@/types/music";
import { usePlayerStore } from "@/lib/store/player-store";
import { useSongPopupStore } from "@/lib/store/song-popup-store";
import { useTilt } from "@/hooks/use-tilt";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { easings } from "@/lib/motion";
import { cardEnter } from "@/lib/motion-variants";
import { useMotionVariant, useReducedMotion } from "@/hooks/use-reduced-motion";
import { PlayButton } from "@/components/ui/play-button";
import { CardArtwork, CardBody, CardTitle, CardSubtitle } from "@/components/ui/card";

export function TrendingSongCard({ song }: { song: Song }) {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const openPopup = useSongPopupStore((state) => state.open);
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();
  const reducedMotion = useReducedMotion();
  const variants = useMotionVariant(cardEnter);
  const glow = useDominantColor(song.coverUrl);

  return (
    <motion.div
      layout
      layoutId={`trending-${song.id}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="initial"
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={reducedMotion ? undefined : { y: -6, scale: 1.03 }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      transition={easings.springSnappy}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      className="group w-40 shrink-0 sm:w-44"
      tabIndex={-1}
    >
      <CardArtwork
        src={song.coverUrl}
        onClick={() => openPopup(song)}
        ariaLabel={`${song.title} by ${song.artistName} — open details`}
        glowColor={glow}
      >
        <PlayButton label={`Play ${song.title}`} onPlay={() => playQueue([song], 0, song.title)} />
      </CardArtwork>
      <CardBody>
        <CardTitle>{song.title}</CardTitle>
        <CardSubtitle>{song.artistName}</CardSubtitle>
      </CardBody>
    </motion.div>
  );
}

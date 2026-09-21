"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { JourneyBucketKey, JourneyEntry } from "@/lib/stats";
import type { Song } from "@/types/music";
import { songs } from "@/data/songs";
import { usePlayerStore } from "@/lib/store/player-store";

const BUCKET_ICONS: Record<JourneyBucketKey, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
};

function JourneyRow({ entry, isLast }: { entry: JourneyEntry; isLast: boolean }) {
  const Icon = BUCKET_ICONS[entry.key];
  const playQueue = usePlayerStore((s) => s.playQueue);
  const trackSongs = entry.recentSongIds
    .map((id) => songs.find((s) => s.id === id))
    .filter((s): s is Song => Boolean(s));

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center">
        <div
          className={
            entry.count > 0
              ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
              : "flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted-foreground"
          }
        >
          <Icon className="size-5" aria-hidden />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border-strong" />}
      </div>

      <div className="flex-1 pb-8">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="font-heading text-base font-semibold text-foreground">{entry.label}</h3>
          <span className="text-xs text-muted-foreground">{entry.hourRange}</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {entry.count} {entry.count === 1 ? "play" : "plays"}
          </span>
        </div>

        {entry.count === 0 ? (
          <p className="mt-1.5 text-sm text-muted-foreground">No listening yet.</p>
        ) : (
          <>
            {entry.topGenre && (
              <p className="mt-1 text-sm text-muted-foreground">
                Mostly <span className="text-foreground">{entry.topGenre}</span>
              </p>
            )}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {trackSongs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => playQueue(trackSongs, trackSongs.indexOf(song), `${entry.label} Journey`)}
                  className="group shrink-0"
                  title={`${song.title} — ${song.artistName}`}
                >
                  <Image
                    src={song.coverUrl}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-md object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function ListeningJourney({ entries }: { entries: JourneyEntry[] }) {
  return (
    <div className="flex flex-col">
      {entries.map((entry, index) => (
        <JourneyRow key={entry.key} entry={entry} isLast={index === entries.length - 1} />
      ))}
    </div>
  );
}

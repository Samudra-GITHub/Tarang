"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Languages, MicOff, Music2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { lyricsBySongId } from "@/data/lyrics";
import { lyricsTranslationsBySongId } from "@/data/lyrics-translations";
import { usePlayerStore } from "@/lib/store/player-store";
import { useDominantColor } from "@/hooks/use-dominant-color";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterChip } from "@/components/ui/chip";
import { LyricShareDialog } from "./lyric-share-dialog";
import type { Song } from "@/types/music";

const FALLBACK_LINE_DURATION = 6;

export function LyricsView({ song }: { song: Song }) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const seekTo = usePlayerStore((s) => s.seekTo);

  const lines = lyricsBySongId[song.id];
  const translations = lyricsTranslationsBySongId[song.id];

  const [translateOn, setTranslateOn] = useState(false);
  const [karaokeOn, setKaraokeOn] = useState(false);
  const [shareLine, setShareLine] = useState<string | null>(null);
  const dominantColor = useDominantColor(song.coverUrl);

  const activeIndex = useMemo(() => {
    if (!lines) return -1;
    let index = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= currentTime) index = i;
      else break;
    }
    return index;
  }, [lines, currentTime]);

  const [userScrolling, setUserScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const handleUserScroll = () => {
    setUserScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setUserScrolling(false), 3000);
  };

  useEffect(() => {
    if (userScrolling || activeIndex < 0 || karaokeOn) return;
    lineRefs.current[activeIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex, userScrolling, karaokeOn]);

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  if (!lines) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={MicOff}
          title="No lyrics yet"
          description="We don't have synced lyrics for this track yet."
        />
      </div>
    );
  }

  const toolbar = (
    <div className="mb-2 flex items-center justify-center gap-2">
      <FilterChip
        selected={translateOn}
        onClick={() => setTranslateOn((v) => !v)}
        icon={<Languages className="size-3.5" aria-hidden />}
        className={translateOn ? "h-8 bg-primary/15 text-primary" : "h-8 bg-surface-3"}
      >
        हिंदी
      </FilterChip>
      <FilterChip
        selected={karaokeOn}
        onClick={() => setKaraokeOn((v) => !v)}
        icon={<Music2 className="size-3.5" aria-hidden />}
        className={karaokeOn ? "h-8 bg-primary/15 text-primary" : "h-8 bg-surface-3"}
      >
        Karaoke
      </FilterChip>
    </div>
  );

  if (karaokeOn) {
    const current = activeIndex >= 0 ? lines[activeIndex] : lines[0];
    const currentEnglishIndex = activeIndex >= 0 ? activeIndex : 0;
    const next = lines[currentEnglishIndex + 1];
    const lineStart = current.time;
    const lineEnd = next ? next.time : lineStart + FALLBACK_LINE_DURATION;
    const fraction = Math.min(1, Math.max(0, (currentTime - lineStart) / Math.max(1, lineEnd - lineStart)));
    const words = current.text.split(" ");
    const highlightCount = activeIndex < 0 ? 0 : Math.ceil(fraction * words.length);

    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
        {toolbar}
        <div className="flex max-w-xl flex-wrap justify-center gap-x-2 gap-y-1 text-center">
          {words.map((word, index) => (
            <span
              key={index}
              className={cn(
                "font-heading text-3xl font-bold tracking-tight transition-colors duration-200 md:text-4xl",
                index < highlightCount ? "text-primary" : "text-white/25",
              )}
            >
              {word}
            </span>
          ))}
        </div>
        {next && (
          <p className="max-w-md text-center text-base text-muted-foreground/70">{next.text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {toolbar}
      <div
        onWheel={handleUserScroll}
        onTouchMove={handleUserScroll}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {lines.map((line, index) => {
          const isActive = index === activeIndex;
          const translatedText = translations?.[index]?.text;
          return (
            <div key={`${line.time}-${index}`} className="group flex items-start gap-2">
              <button
                ref={(el) => {
                  lineRefs.current[index] = el;
                }}
                type="button"
                onClick={() => seekTo(line.time)}
                className={cn(
                  "flex-1 text-left text-2xl font-heading font-bold tracking-tight transition-all duration-300 md:text-3xl",
                  isActive
                    ? "scale-100 text-foreground opacity-100"
                    : "scale-[0.97] text-muted-foreground opacity-50 hover:opacity-80",
                )}
              >
                {line.text}
                {translateOn && translatedText && (
                  <span className="mt-1 block text-base font-normal text-muted-foreground md:text-lg">
                    {translatedText}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShareLine(line.text)}
                aria-label={`Share line: ${line.text}`}
                className="mt-1 shrink-0 rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
              >
                <Share2 className="size-4" aria-hidden />
              </button>
            </div>
          );
        })}
        {translateOn && !translations && (
          <p className="pt-2 text-center text-sm text-muted-foreground">
            Translation not available for this track yet.
          </p>
        )}
      </div>

      <LyricShareDialog
        song={shareLine ? song : null}
        lineText={shareLine}
        dominantColor={dominantColor}
        onClose={() => setShareLine(null)}
      />
    </div>
  );
}

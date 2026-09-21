"use client";

import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCreditsUIStore } from "@/lib/store/credits-ui-store";
import { getSongCredits } from "@/lib/credits";
import { formatDuration } from "@/lib/format-time";
import { isYoutubeAudioUrl } from "@/features/youtube/youtube-engine";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function CreditsSheet() {
  const song = useCreditsUIStore((s) => s.song);
  const close = useCreditsUIStore((s) => s.close);

  const credits = song ? getSongCredits(song) : null;
  const isSearchResult = song ? isYoutubeAudioUrl(song.audioUrl) : false;

  return (
    <Sheet open={Boolean(song)} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border-border-strong [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {song && credits && (
          <>
            <SheetHeader className="flex-row items-center gap-3 pb-0">
              <Image
                src={song.coverUrl}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <SheetTitle className="truncate">{song.title}</SheetTitle>
                {isSearchResult ? (
                  <p className="block truncate text-sm text-muted-foreground">
                    {song.artistName}
                  </p>
                ) : (
                  <Link
                    href={`/artist/${song.artistId}`}
                    onClick={close}
                    className="block truncate text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {song.artistName}
                  </Link>
                )}
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 pb-6">
              <div>
                <p className="mb-1 px-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Song
                </p>
                <MetaRow
                  label="Album"
                  value={song.albumTitle}
                />
                <MetaRow label="Genre" value={song.genre} />
                <MetaRow label="Language" value={song.language} />
                <MetaRow label="Year" value={String(song.year)} />
                <MetaRow label="Duration" value={formatDuration(song.duration)} />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Credits
                </p>
                <MetaRow label="Writers" value={credits.writers.join(", ")} />
                <MetaRow label="Composer" value={credits.composer} />
                <MetaRow label="Producer" value={credits.producer} />
                <MetaRow label="Engineer" value={credits.engineer} />
                <MetaRow label="Label" value={credits.label} />
                <MetaRow label="Recorded" value={credits.recordedAt} />
                <MetaRow label="ISRC" value={credits.isrc} />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

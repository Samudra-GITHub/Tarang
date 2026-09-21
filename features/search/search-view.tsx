"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, TimerOff, TriangleAlert, WifiOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AlbumCard } from "@/components/cards/album-card";
import { PlaylistCard } from "@/components/cards/playlist-card";
import { ArtistCard } from "@/components/cards/artist-card";
import { GenreCard } from "@/components/cards/genre-card";
import { TrackList } from "@/components/tracks/track-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { genres } from "@/data/genres";
import { searchByGenre } from "@/lib/search";
import { useYoutubeSearch } from "@/features/youtube/use-youtube-search";
import { youtubeResultToSong } from "@/features/youtube/to-song";
import type { YoutubeSearchErrorKind } from "@/features/youtube/invidious-client";

const ERROR_COPY: Record<
  YoutubeSearchErrorKind,
  { icon: LucideIcon; title: string; description: string }
> = {
  offline: {
    icon: WifiOff,
    title: "You're offline",
    description: "Search needs a connection. Reconnect and try again.",
  },
  timeout: {
    icon: TimerOff,
    title: "Search timed out",
    description: "Search didn't respond in time. Your connection may be slow right now.",
  },
  unavailable: {
    icon: TriangleAlert,
    title: "Search unavailable",
    description: "Couldn't reach search right now. Try again in a moment.",
  },
};

export function SearchView() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");
  const [query, setQuery] = useState("");

  const hasQuery = query.trim().length > 0;
  const { results: youtubeResults, loading, errorKind, retry } = useYoutubeSearch(query);
  const youtubeSongs = useMemo(() => youtubeResults.map(youtubeResultToSong), [youtubeResults]);

  const genreResults = useMemo(
    () => (!hasQuery && genreParam ? searchByGenre(genreParam) : null),
    [hasQuery, genreParam],
  );
  const genreIsEmpty =
    genreResults !== null &&
    genreResults.songs.length === 0 &&
    genreResults.albums.length === 0 &&
    genreResults.artists.length === 0;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div className="relative max-w-xl">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for any song…"
          className="h-11 rounded-full bg-surface-2 pl-10"
        />
      </div>

      {!hasQuery && !genreParam && (
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Browse Genres</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {genres.map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </div>
      )}

      {!hasQuery && genreResults && (
        <div className="flex flex-col gap-8">
          <h2 className="font-heading text-xl font-semibold tracking-tight">{genreParam}</h2>

          {genreIsEmpty ? (
            <EmptyState
              icon={SearchIcon}
              title="No matches"
              description={`Nothing turned up for "${genreParam}" in the catalog.`}
            />
          ) : (
            <>
              {genreResults.songs.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h3 className="font-heading text-base font-semibold">Songs</h3>
                  <TrackList songs={genreResults.songs} sourceLabel={genreParam ?? "Genre"} showAlbum />
                </section>
              )}

              {genreResults.artists.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className="font-heading text-base font-semibold">Artists</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {genreResults.artists.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </section>
              )}

              {genreResults.albums.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className="font-heading text-base font-semibold">Albums</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {genreResults.albums.map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </div>
                </section>
              )}

              {genreResults.playlists.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h3 className="font-heading text-base font-semibold">Playlists</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {genreResults.playlists.map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {hasQuery && (
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Results for &quot;{query}&quot;
          </h2>

          {loading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-md" />
              ))}
            </div>
          )}

          {!loading && errorKind && (
            <EmptyState
              icon={ERROR_COPY[errorKind].icon}
              title={ERROR_COPY[errorKind].title}
              description={ERROR_COPY[errorKind].description}
              action={{ label: "Retry", onClick: retry }}
            />
          )}

          {!loading && !errorKind && youtubeSongs.length === 0 && (
            <EmptyState
              icon={SearchIcon}
              title="No matches"
              description={`Nothing turned up for "${query}".`}
            />
          )}

          {!loading && !errorKind && youtubeSongs.length > 0 && (
            <TrackList songs={youtubeSongs} sourceLabel={`Search: ${query}`} />
          )}
        </div>
      )}
    </div>
  );
}

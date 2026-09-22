"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, TimerOff, TriangleAlert, WifiOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { AlbumCard } from "@/components/cards/album-card";
import { PlaylistCard } from "@/components/cards/playlist-card";
import { ArtistCard } from "@/components/cards/artist-card";
import { GenreCard } from "@/components/cards/genre-card";
import { TrackList } from "@/components/tracks/track-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { genres } from "@/data/genres";
import { searchByGenre } from "@/lib/search";
import { useYoutubeSearch } from "@/features/youtube/use-youtube-search";
import { youtubeResultToSong } from "@/features/youtube/to-song";
import type { YoutubeSearchErrorKind } from "@/features/youtube/invidious-client";
import { Page, PageContainer } from "@/components/layout/page";
import { Section, SectionTitle } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { HorizontalRail } from "@/components/layout/horizontal-rail";
import { StickyHeader } from "@/components/layout/sticky-header";

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
    <PageContainer>
      <Page spacing="md">
        <StickyHeader>
          <SearchInput
            autoFocus
            value={query}
            onChange={setQuery}
            placeholder="Search for any song…"
            className="h-11 max-w-xl rounded-full bg-surface-2"
          />
        </StickyHeader>

        {!hasQuery && !genreParam && (
          <Section>
            <SectionTitle>Browse Genres</SectionTitle>
            <Grid preset="genres">
              {genres.map((genre) => (
                <GenreCard key={genre.id} genre={genre} />
              ))}
            </Grid>
          </Section>
        )}

        {!hasQuery && genreResults && (
          <Section className="gap-8">
            <SectionTitle>{genreParam}</SectionTitle>

            {genreIsEmpty ? (
              <EmptyState
                icon={SearchIcon}
                title="No matches"
                description={`Nothing turned up for "${genreParam}" in the catalog.`}
              />
            ) : (
              <>
                {genreResults.songs.length > 0 && (
                  <Section className="gap-2">
                    <SectionTitle as="h3">Songs</SectionTitle>
                    <TrackList songs={genreResults.songs} sourceLabel={genreParam ?? "Genre"} showAlbum />
                  </Section>
                )}

                {genreResults.artists.length > 0 && (
                  <HorizontalRail title="Artists" padded={false} animate={false}>
                    {genreResults.artists.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </HorizontalRail>
                )}

                {genreResults.albums.length > 0 && (
                  <HorizontalRail title="Albums" padded={false} animate={false}>
                    {genreResults.albums.map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </HorizontalRail>
                )}

                {genreResults.playlists.length > 0 && (
                  <HorizontalRail title="Playlists" padded={false} animate={false}>
                    {genreResults.playlists.map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </HorizontalRail>
                )}
              </>
            )}
          </Section>
        )}

        {hasQuery && (
          <Section className="gap-4">
            <SectionTitle>Results for &quot;{query}&quot;</SectionTitle>

            {loading && (
              <div role="status" aria-live="polite" className="flex items-center justify-center py-12">
                <Spinner className="size-6" />
                <span className="sr-only">Searching for &quot;{query}&quot;…</span>
              </div>
            )}

            {!loading && (
              <p role="status" aria-live="polite" className="sr-only">
                {errorKind
                  ? ERROR_COPY[errorKind].title
                  : youtubeSongs.length === 0
                    ? `No results for "${query}"`
                    : `${youtubeSongs.length} results for "${query}"`}
              </p>
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
          </Section>
        )}
      </Page>
    </PageContainer>
  );
}

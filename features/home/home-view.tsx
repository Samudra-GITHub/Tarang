import { HeroSpotlight, type Spotlight } from "./hero-spotlight";
import { EditorialBento } from "./editorial-bento";
import { AlbumCard } from "@/components/cards/album-card";
import { PlaylistCard } from "@/components/cards/playlist-card";
import { GenreCard } from "@/components/cards/genre-card";
import { PinnedSection } from "@/features/pinned/pinned-section";
import { TrendingRail } from "@/features/home/trending-rail";
import { MoodCard } from "@/features/moods/mood-card";
import { Page } from "@/components/layout/page";
import { Section, SectionTitle } from "@/components/layout/section";
import { HorizontalRail } from "@/components/layout/horizontal-rail";
import { albums } from "@/data/albums";
import { playlists } from "@/data/playlists";
import { genres } from "@/data/genres";
import { moods } from "@/data/moods";
import { continueListening, recentlyPlayed, type HomeMediaRef } from "@/data/home-sections";

function MediaRefCard({ item }: { item: HomeMediaRef }) {
  if (item.kind === "album") {
    const album = albums.find((a) => a.id === item.id);
    if (!album) return null;
    return <AlbumCard album={album} progress={item.progress} />;
  }
  const playlist = playlists.find((p) => p.id === item.id);
  if (!playlist) return null;
  return <PlaylistCard playlist={playlist} progress={item.progress} />;
}

function resolveSpotlight(ref: HomeMediaRef | undefined): Spotlight | null {
  if (!ref) return null;
  if (ref.kind === "album") {
    const album = albums.find((a) => a.id === ref.id);
    return album ? { kind: "album", item: album } : null;
  }
  const playlist = playlists.find((p) => p.id === ref.id);
  return playlist ? { kind: "playlist", item: playlist } : null;
}

// `continueListening`/`albums`/`playlists` are static module data, so this
// only ever needs to run once, not on every HomeView render.
const homeSpotlight = resolveSpotlight(continueListening[0]);

export function HomeView() {
  const spotlight = homeSpotlight;

  return (
    <Page spacing="xl">
      {spotlight && <HeroSpotlight spotlight={spotlight} greeting="Good to see you" />}

      <PinnedSection />

      <TrendingRail />

      <HorizontalRail title="Mood Spaces">
        {moods.map((mood) => (
          <MoodCard key={mood.id} mood={mood} />
        ))}
      </HorizontalRail>

      <HorizontalRail title="Continue Listening">
        {continueListening.map((item) => (
          <MediaRefCard key={`${item.kind}-${item.id}`} item={item} />
        ))}
      </HorizontalRail>

      <HorizontalRail title="Recently Played">
        {recentlyPlayed.map((item) => (
          <MediaRefCard key={`${item.kind}-${item.id}`} item={item} />
        ))}
      </HorizontalRail>

      <HorizontalRail title="New For You">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </HorizontalRail>

      <Section>
        <SectionTitle className="px-4 md:px-6">Editorial Picks</SectionTitle>
        <EditorialBento playlists={playlists} />
      </Section>

      <HorizontalRail title="Genre Collections">
        {genres.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </HorizontalRail>
    </Page>
  );
}

import { notFound } from "next/navigation";
import { artists } from "@/data/artists";
import { getArtistAlbums, getArtistSongs } from "@/lib/collections";
import { ArtistHeader } from "@/components/collection/artist-header";
import { TrackList } from "@/components/tracks/track-list";
import { AlbumCard } from "@/components/cards/album-card";
import { Page, PageContainer } from "@/components/layout/page";
import { Section, SectionTitle } from "@/components/layout/section";
import { HorizontalRail } from "@/components/layout/horizontal-rail";

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = artists.find((a) => a.id === id);
  if (!artist) notFound();

  const popularSongs = getArtistSongs(artist.id, 5);
  const artistAlbums = getArtistAlbums(artist.id);

  return (
    <Page spacing="lg">
      <ArtistHeader artist={artist} />

      {popularSongs.length > 0 && (
        <PageContainer>
          <Section>
            <SectionTitle>Popular</SectionTitle>
            <TrackList songs={popularSongs} sourceLabel={`${artist.name} — Popular`} />
          </Section>
        </PageContainer>
      )}

      {artistAlbums.length > 0 && (
        <HorizontalRail title="Albums">
          {artistAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </HorizontalRail>
      )}
    </Page>
  );
}

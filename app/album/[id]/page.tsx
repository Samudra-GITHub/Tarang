import { notFound } from "next/navigation";
import { albums } from "@/data/albums";
import { getAlbumSongs } from "@/lib/collections";
import { CollectionHeader } from "@/components/collection/collection-header";
import { TrackList } from "@/components/tracks/track-list";
import { Page, PageContainer } from "@/components/layout/page";

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = albums.find((a) => a.id === id);
  if (!album) notFound();

  const songs = getAlbumSongs(album);

  return (
    <Page spacing="lg">
      <CollectionHeader kind="album" album={album} />
      <PageContainer>
        <TrackList songs={songs} sourceLabel={album.title} />
      </PageContainer>
    </Page>
  );
}

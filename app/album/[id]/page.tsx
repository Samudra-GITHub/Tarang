import { notFound } from "next/navigation";
import { albums } from "@/data/albums";
import { getAlbumSongs } from "@/lib/collections";
import { CollectionHeader } from "@/components/collection/collection-header";
import { TrackList } from "@/components/tracks/track-list";

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = albums.find((a) => a.id === id);
  if (!album) notFound();

  const songs = getAlbumSongs(album);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <CollectionHeader kind="album" album={album} />
      <div className="px-4 md:px-6">
        <TrackList songs={songs} sourceLabel={album.title} />
      </div>
    </div>
  );
}

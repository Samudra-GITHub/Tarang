import { notFound } from "next/navigation";
import { artists } from "@/data/artists";
import { getArtistAlbums, getArtistSongs } from "@/lib/collections";
import { ArtistHeader } from "@/components/collection/artist-header";
import { TrackList } from "@/components/tracks/track-list";
import { AlbumCard } from "@/components/cards/album-card";

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = artists.find((a) => a.id === id);
  if (!artist) notFound();

  const popularSongs = getArtistSongs(artist.id, 5);
  const artistAlbums = getArtistAlbums(artist.id);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <ArtistHeader artist={artist} />

      {popularSongs.length > 0 && (
        <div className="px-4 md:px-6">
          <h2 className="mb-3 font-heading text-lg font-semibold tracking-tight">Popular</h2>
          <TrackList songs={popularSongs} sourceLabel={`${artist.name} — Popular`} />
        </div>
      )}

      {artistAlbums.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="px-4 font-heading text-lg font-semibold tracking-tight md:px-6">Albums</h2>
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {artistAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

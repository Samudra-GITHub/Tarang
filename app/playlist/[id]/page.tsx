import { playlists } from "@/data/playlists";
import { getPlaylistSongs } from "@/lib/collections";
import { CollectionHeader } from "@/components/collection/collection-header";
import { TrackList } from "@/components/tracks/track-list";
import { UserPlaylistDetail } from "@/features/library/user-playlist-detail";

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playlist = playlists.find((p) => p.id === id);

  // Not in the static catalog — it may be a user-created playlist, which only
  // exists in client-side (localStorage) state.
  if (!playlist) return <UserPlaylistDetail id={id} />;

  const songs = getPlaylistSongs(playlist);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <CollectionHeader kind="playlist" playlist={playlist} />
      <div className="px-4 md:px-6">
        <TrackList songs={songs} sourceLabel={playlist.title} showAlbum enableFilter enableSort />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ListMusic } from "lucide-react";
import { useUserPlaylistsStore } from "@/lib/store/user-playlists-store";
import { getPlaylistSongs } from "@/lib/collections";
import { CollectionHeader } from "@/components/collection/collection-header";
import { TrackList } from "@/components/tracks/track-list";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { EmptyState } from "@/components/ui/empty-state";

export function UserPlaylistDetail({ id }: { id: string }) {
  const [hydrated, setHydrated] = useState(false);
  const playlist = useUserPlaylistsStore((state) => state.playlists.find((p) => p.id === id));

  useEffect(() => setHydrated(true), []);

  // Avoid a false "not found" flash before persisted state has loaded.
  if (!hydrated) return null;

  if (!playlist) {
    return (
      <PlaceholderPage
        title="Playlist not found"
        note="This playlist doesn't exist or was removed."
      />
    );
  }

  const songs = getPlaylistSongs(playlist);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <CollectionHeader kind="playlist" playlist={playlist} />
      <div className="px-4 md:px-6">
        {songs.length === 0 ? (
          <EmptyState
            icon={ListMusic}
            title="This playlist is empty"
            description="Add songs from anywhere in Tarang using the “Add to Playlist” menu."
            action={{
              label: "Browse Search",
              href: "/search",
            }}
          />
        ) : (
          <TrackList songs={songs} sourceLabel={playlist.title} showAlbum enableFilter enableSort />
        )}
      </div>
    </div>
  );
}

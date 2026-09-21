"use client";

import type { Playlist } from "@/types/music";
import { PlaylistCard } from "@/components/cards/playlist-card";

export function DraggablePlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/tarang-playlist-id", playlist.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <PlaylistCard playlist={playlist} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlaylistPickerStore } from "@/lib/store/playlist-picker-store";
import { useUserPlaylistsStore } from "@/lib/store/user-playlists-store";
import { toast } from "@/lib/store/toast-store";

export function AddToPlaylistDialog() {
  const isOpen = usePlaylistPickerStore((s) => s.isOpen);
  const songId = usePlaylistPickerStore((s) => s.songId);
  const close = usePlaylistPickerStore((s) => s.close);

  const playlists = useUserPlaylistsStore((s) => s.playlists);
  const createPlaylist = useUserPlaylistsStore((s) => s.createPlaylist);
  const addSongToPlaylist = useUserPlaylistsStore((s) => s.addSongToPlaylist);
  const removeSongFromPlaylist = useUserPlaylistsStore((s) => s.removeSongFromPlaylist);

  const [newTitle, setNewTitle] = useState("");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
          setNewTitle("");
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{songId ? "Add to Playlist" : "New Playlist"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!newTitle.trim()) return;
            const id = createPlaylist(newTitle.trim());
            if (songId) addSongToPlaylist(id, songId);
            toast.success("Playlist created", `"${newTitle.trim()}" is ready.`);
            setNewTitle("");
            close();
          }}
          className="flex gap-2"
        >
          <Input
            autoFocus
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Playlist name"
            className="h-9"
          />
          <Button type="submit" size="sm" variant="secondary" disabled={!newTitle.trim()}>
            <Plus className="size-4" aria-hidden />
            Create
          </Button>
        </form>

        {songId && (
          <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
            {playlists.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                You don&apos;t have any playlists yet.
              </p>
            ) : (
              playlists.map((playlist) => {
                const included = playlist.songIds.includes(songId);
                return (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => {
                      if (included) {
                        removeSongFromPlaylist(playlist.id, songId);
                        toast.info("Removed from playlist", `Removed from "${playlist.title}".`);
                      } else {
                        addSongToPlaylist(playlist.id, songId);
                        toast.success("Added to playlist", `Added to "${playlist.title}".`);
                      }
                    }}
                    className="flex items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-surface-2"
                  >
                    <span className="truncate">{playlist.title}</span>
                    {included && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

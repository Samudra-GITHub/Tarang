"use client";

import { useState } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { Clock, History, ListMusic, ListPlus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { usePlayerUIStore } from "@/lib/store/player-ui-store";
import { usePlayerStore, selectUpNext, selectHistory } from "@/lib/store/player-store";
import { useUserPlaylistsStore } from "@/lib/store/user-playlists-store";
import { QueueRow, ReorderableQueueRow } from "./queue-row";
import { Label } from "@/components/ui/typography";
import { ScrollContainer } from "@/components/layout/scroll-container";
import { announce } from "@/lib/store/announce-store";

export function QueueDrawer() {
  const isOpen = usePlayerUIStore((s) => s.isQueueOpen);
  const closeQueue = usePlayerUIStore((s) => s.closeQueue);

  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const sourceLabel = usePlayerStore((s) => s.sourceLabel);
  const playLater = usePlayerStore((s) => s.playLater);

  const upNext = usePlayerStore(useShallow(selectUpNext));
  const history = usePlayerStore(useShallow(selectHistory));

  const playUpcoming = usePlayerStore((s) => s.playUpcoming);
  const removeFromUpcoming = usePlayerStore((s) => s.removeFromUpcoming);
  const reorderUpcoming = usePlayerStore((s) => s.reorderUpcoming);
  const setUpcomingOrder = usePlayerStore((s) => s.setUpcomingOrder);
  const clearUpcoming = usePlayerStore((s) => s.clearUpcoming);

  const removeFromPlayLater = usePlayerStore((s) => s.removeFromPlayLater);
  const reorderPlayLater = usePlayerStore((s) => s.reorderPlayLater);
  const setPlayLaterOrder = usePlayerStore((s) => s.setPlayLaterOrder);

  const createPlaylist = useUserPlaylistsStore((s) => s.createPlaylist);
  const addSongToPlaylist = useUserPlaylistsStore((s) => s.addSongToPlaylist);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : undefined;
  const [showHistory, setShowHistory] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const handleSaveAsPlaylist = () => {
    if (!playlistName.trim() || upNext.length === 0) return;
    const id = createPlaylist(playlistName.trim());
    for (const song of upNext) addSongToPlaylist(id, song.id);
    setPlaylistName("");
    setSaveDialogOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeQueue()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle>Queue</SheetTitle>
          {sourceLabel && (
            <p className="text-xs text-muted-foreground">Playing from {sourceLabel}</p>
          )}
        </SheetHeader>

        <ScrollContainer className="px-2 py-3">
          {currentSong && (
            <div className="mb-4">
              <Label as="p" className="px-2 pb-2">
                Now Playing
              </Label>
              <QueueRow song={currentSong} />
            </div>
          )}

          <div className="mb-1 flex items-center justify-between px-2">
            <Label as="p">Up Next{shuffle ? " · Shuffled" : ""}</Label>
            {upNext.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSaveDialogOpen(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ListPlus className="size-3.5" aria-hidden />
                  Save as Playlist
                </button>
                <button
                  type="button"
                  onClick={clearUpcoming}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  Clear
                </button>
              </div>
            )}
          </div>

          {upNext.length === 0 ? (
            <EmptyState
              icon={ListMusic}
              title="Nothing queued next"
              description="Add songs from anywhere in Tarang using the queue menu."
              className="py-8"
            />
          ) : (
            <Reorder.Group
              as="ul"
              axis="y"
              values={upNext}
              onReorder={setUpcomingOrder}
              className="flex flex-col"
            >
              <AnimatePresence initial={false}>
                {upNext.map((song, index) => (
                  <ReorderableQueueRow
                    key={song.id}
                    song={song}
                    onPlay={() => playUpcoming(song.id)}
                    onRemove={() => {
                      removeFromUpcoming(index);
                      announce(`Removed ${song.title} from queue`);
                    }}
                    onMoveUp={() => index > 0 && reorderUpcoming(index, index - 1)}
                    onMoveDown={() =>
                      index < upNext.length - 1 && reorderUpcoming(index, index + 1)
                    }
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}

          {playLater.length > 0 && (
            <div className="mt-5">
              <Label as="p" className="mb-1 flex items-center gap-1.5 px-2">
                <Clock className="size-3.5" aria-hidden />
                Play Later
              </Label>
              <Reorder.Group
                as="ul"
                axis="y"
                values={playLater}
                onReorder={setPlayLaterOrder}
                className="flex flex-col"
              >
                <AnimatePresence initial={false}>
                  {playLater.map((song, index) => (
                    <ReorderableQueueRow
                      key={song.id}
                      song={song}
                      onRemove={() => {
                        removeFromPlayLater(index);
                        announce(`Removed ${song.title} from queue`);
                      }}
                      onMoveUp={() => index > 0 && reorderPlayLater(index, index - 1)}
                      onMoveDown={() =>
                        index < playLater.length - 1 && reorderPlayLater(index, index + 1)
                      }
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-5 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className="flex w-full items-center gap-1.5 px-2 hover:text-foreground"
              >
                <Label as="span" className="flex items-center gap-1.5">
                  <History className="size-3.5" aria-hidden />
                  History ({history.length})
                </Label>
              </button>
              {showHistory && (
                <div className="mt-1 flex flex-col">
                  {history.map((song, index) => (
                    <QueueRow key={`${song.id}-${index}`} song={song} onPlay={() => playUpcoming(song.id)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollContainer>
      </SheetContent>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Save Queue as Playlist</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveAsPlaylist();
            }}
            className="flex gap-2"
          >
            <Input
              autoFocus
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              placeholder="Playlist name"
              className="h-9"
            />
            <Button type="submit" size="sm" className="rounded-full" disabled={!playlistName.trim()}>
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

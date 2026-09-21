"use client";

import { useState } from "react";
import { FolderPlus, ListPlus, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useFoldersStore, type PlaylistFolder } from "@/lib/store/folders-store";
import { usePlaylistPickerStore } from "@/lib/store/playlist-picker-store";
import { useUserPlaylistsStore } from "@/lib/store/user-playlists-store";
import { useLibraryStore } from "@/lib/store/library-store";
import { cn } from "@/lib/utils";
import { FolderDialog } from "./folder-dialog";
import { FolderRow } from "./folder-row";
import { DraggablePlaylistCard } from "./draggable-playlist-card";
import { useAllPlaylists } from "./use-all-playlists";

type DialogState = { mode: "create" | "edit"; parentId?: string | null; folder?: PlaylistFolder } | null;

export function PlaylistFolders() {
  const folders = useFoldersStore((s) => s.folders);
  const playlistFolderMap = useFoldersStore((s) => s.playlistFolderMap);
  const assignPlaylistToFolder = useFoldersStore((s) => s.assignPlaylistToFolder);

  const userPlaylists = useUserPlaylistsStore((s) => s.playlists);
  const deleteUserPlaylist = useUserPlaylistsStore((s) => s.deletePlaylist);
  const savedPlaylistIds = useLibraryStore((s) => s.savedPlaylistIds);
  const openPlaylistPicker = usePlaylistPickerStore((s) => s.open);

  const allPlaylists = useAllPlaylists();
  // Only playlists actually in "your library" (created or saved) can live in folders.
  const libraryPlaylists = allPlaylists.filter(
    (p) => userPlaylists.some((up) => up.id === p.id) || savedPlaylistIds.includes(p.id),
  );

  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [dragOverUnfiled, setDragOverUnfiled] = useState(false);

  const rootFolders = folders.filter((f) => f.parentId === null);
  const pinnedFolders = rootFolders.filter((f) => f.pinned);
  const otherFolders = rootFolders.filter((f) => !f.pinned);
  const unfiled = libraryPlaylists.filter((p) => !playlistFolderMap[p.id]);

  const handleDrop = (folderId: string, playlistId: string) => {
    assignPlaylistToFolder(playlistId, folderId);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openPlaylistPicker()}
          className="flex items-center gap-2 rounded-full border border-dashed border-border-strong px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
        >
          <ListPlus className="size-4" aria-hidden />
          New Playlist
        </button>
        <button
          type="button"
          onClick={() => setDialogState({ mode: "create", parentId: null })}
          className="flex items-center gap-2 rounded-full border border-dashed border-border-strong px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
        >
          <FolderPlus className="size-4" aria-hidden />
          New Folder
        </button>
      </div>

      {(pinnedFolders.length > 0 || otherFolders.length > 0) && (
        <div className="flex flex-col gap-1" data-folder-drop>
          {pinnedFolders.map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder}
              allPlaylists={libraryPlaylists}
              allFolders={folders}
              onEdit={(f) => setDialogState({ mode: "edit", folder: f })}
              onCreateSubfolder={(parentId) => setDialogState({ mode: "create", parentId })}
              dragOverFolderId={dragOverFolderId}
              onDragOverFolder={setDragOverFolderId}
              onDropOnFolder={handleDrop}
            />
          ))}
          {otherFolders.map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder}
              allPlaylists={libraryPlaylists}
              allFolders={folders}
              onEdit={(f) => setDialogState({ mode: "edit", folder: f })}
              onCreateSubfolder={(parentId) => setDialogState({ mode: "create", parentId })}
              dragOverFolderId={dragOverFolderId}
              onDragOverFolder={setDragOverFolderId}
              onDropOnFolder={handleDrop}
            />
          ))}
        </div>
      )}

      <div
        data-folder-drop
        onDragOver={(event) => {
          event.preventDefault();
          setDragOverUnfiled(true);
        }}
        onDragLeave={() => setDragOverUnfiled(false)}
        onDrop={(event) => {
          event.preventDefault();
          const id = event.dataTransfer.getData("text/tarang-playlist-id");
          if (id) assignPlaylistToFolder(id, null);
          setDragOverUnfiled(false);
        }}
        className={cn(
          "flex flex-col gap-3 rounded-lg p-2 transition-colors",
          dragOverUnfiled && "bg-primary/10 ring-1 ring-primary/40",
        )}
      >
        {folders.length > 0 && (
          <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            All Playlists
          </p>
        )}
        {unfiled.length === 0 ? (
          <EmptyState
            icon={ListPlus}
            title="No playlists yet"
            description="Create a playlist or save one from Home or Search to start organizing."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {unfiled.map((playlist) => {
              const isOwned = userPlaylists.some((up) => up.id === playlist.id);
              return isOwned ? (
                <div key={playlist.id} className="group/item relative">
                  <button
                    type="button"
                    onClick={() => deleteUserPlaylist(playlist.id)}
                    className="absolute top-1 right-1 z-10 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover/item:opacity-100"
                    aria-label={`Delete ${playlist.title}`}
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                  <DraggablePlaylistCard playlist={playlist} />
                </div>
              ) : (
                <DraggablePlaylistCard key={playlist.id} playlist={playlist} />
              );
            })}
          </div>
        )}
      </div>

      <FolderDialog state={dialogState} onClose={() => setDialogState(null)} />
    </div>
  );
}

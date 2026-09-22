"use client";

import { AnimatePresence, motion } from "framer-motion";
import { durations, easings } from "@/lib/motion";
import {
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Trash2,
} from "lucide-react";
import type { Playlist } from "@/types/music";
import { cn } from "@/lib/utils";
import { useFoldersStore, type PlaylistFolder } from "@/lib/store/folders-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid } from "@/components/layout/grid";
import { DraggablePlaylistCard } from "./draggable-playlist-card";

export function FolderRow({
  folder,
  allPlaylists,
  allFolders,
  onEdit,
  onCreateSubfolder,
  dragOverFolderId,
  onDragOverFolder,
  onDropOnFolder,
}: {
  folder: PlaylistFolder;
  allPlaylists: Playlist[];
  allFolders: PlaylistFolder[];
  onEdit: (folder: PlaylistFolder) => void;
  onCreateSubfolder?: (parentId: string) => void;
  dragOverFolderId: string | null;
  onDragOverFolder: (folderId: string | null) => void;
  onDropOnFolder: (folderId: string, playlistId: string) => void;
}) {
  const playlistFolderMap = useFoldersStore((s) => s.playlistFolderMap);
  const toggleCollapsed = useFoldersStore((s) => s.toggleCollapsed);
  const togglePinned = useFoldersStore((s) => s.togglePinned);
  const deleteFolder = useFoldersStore((s) => s.deleteFolder);

  const folderPlaylists = allPlaylists.filter((p) => playlistFolderMap[p.id] === folder.id);
  const subfolders = allFolders.filter((f) => f.parentId === folder.id);
  const isRoot = folder.parentId === null;
  const isDragOver = dragOverFolderId === folder.id;
  const isEmpty = folderPlaylists.length === 0 && subfolders.length === 0;

  return (
    <div className="flex flex-col gap-1">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          onDragOverFolder(folder.id);
        }}
        onDragLeave={() => onDragOverFolder(null)}
        onDrop={(event) => {
          event.preventDefault();
          const playlistId = event.dataTransfer.getData("text/tarang-playlist-id");
          if (playlistId) onDropOnFolder(folder.id, playlistId);
          onDragOverFolder(null);
        }}
        className={cn(
          "group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors",
          isDragOver ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-surface-2",
        )}
      >
        <button
          type="button"
          onClick={() => toggleCollapsed(folder.id)}
          aria-expanded={!folder.collapsed}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              !folder.collapsed && "rotate-90",
            )}
            aria-hidden
          />
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: folder.color }}
            aria-hidden
          />
          {folder.collapsed ? (
            <FolderIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          ) : (
            <FolderOpen className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          )}
          <span className="truncate text-sm font-medium text-foreground">{folder.name}</span>
          <span className="text-xs text-muted-foreground">{folderPlaylists.length}</span>
        </button>

        {folder.pinned && <Pin className="size-3.5 shrink-0 text-primary" aria-hidden />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full p-1 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100 data-[state=open]:opacity-100"
              aria-label={`More options for ${folder.name}`}
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(folder)}>
              <Pencil className="size-4" aria-hidden />
              Rename & Recolor
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => togglePinned(folder.id)}>
              {folder.pinned ? (
                <PinOff className="size-4" aria-hidden />
              ) : (
                <Pin className="size-4" aria-hidden />
              )}
              {folder.pinned ? "Unpin" : "Pin to top"}
            </DropdownMenuItem>
            {isRoot && onCreateSubfolder && (
              <DropdownMenuItem onSelect={() => onCreateSubfolder(folder.id)}>
                <Plus className="size-4" aria-hidden />
                New Subfolder
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => deleteFolder(folder.id)}>
              <Trash2 className="size-4" aria-hidden />
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence initial={false}>
        {!folder.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: durations.normal, ease: easings.decelerate }}
            className="overflow-hidden pl-6"
          >
            {isEmpty ? (
              <p className="py-3 text-xs text-muted-foreground">Drag playlists here to file them.</p>
            ) : (
              <div className="flex flex-col gap-3 pt-1 pb-3">
                {folderPlaylists.length > 0 && (
                  <Grid preset="genres">
                    {folderPlaylists.map((playlist) => (
                      <DraggablePlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </Grid>
                )}
                {subfolders.map((sub) => (
                  <FolderRow
                    key={sub.id}
                    folder={sub}
                    allPlaylists={allPlaylists}
                    allFolders={allFolders}
                    onEdit={onEdit}
                    dragOverFolderId={dragOverFolderId}
                    onDragOverFolder={onDragOverFolder}
                    onDropOnFolder={onDropOnFolder}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

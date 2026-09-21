import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PlaylistFolder {
  id: string;
  name: string;
  color: string;
  parentId: string | null;
  pinned: boolean;
  collapsed: boolean;
  createdAt: number;
}

/** Curated, on-brand folder colors — teal/coral/neutral family, no purple or neon. */
export const FOLDER_COLORS = [
  "#2dd4bf",
  "#ff6b6b",
  "#f5c451",
  "#7dd3fc",
  "#a3e635",
  "#c4b5fd",
  "#d4d4d0",
];

interface FoldersState {
  folders: PlaylistFolder[];
  /** playlistId -> folderId. Absence means the playlist isn't in any folder. */
  playlistFolderMap: Record<string, string>;

  createFolder: (name: string, parentId?: string | null) => string | null;
  renameFolder: (id: string, name: string) => void;
  recolorFolder: (id: string, color: string) => void;
  deleteFolder: (id: string) => void;
  toggleCollapsed: (id: string) => void;
  togglePinned: (id: string) => void;
  assignPlaylistToFolder: (playlistId: string, folderId: string | null) => void;
  canNestUnder: (folderId: string) => boolean;
}

export const useFoldersStore = create<FoldersState>()(
  persist(
    (set, get) => ({
      folders: [],
      playlistFolderMap: {},

      createFolder: (name, parentId = null) => {
        if (parentId && !get().canNestUnder(parentId)) return null;
        const id = `folder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const folder: PlaylistFolder = {
          id,
          name: name.trim() || "New Folder",
          color: FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)],
          parentId,
          pinned: false,
          collapsed: false,
          createdAt: Date.now(),
        };
        set((state) => ({ folders: [...state.folders, folder] }));
        return id;
      },

      renameFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        })),

      recolorFolder: (id, color) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, color } : f)),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          // Child folders move up to root rather than being cascade-deleted.
          folders: state.folders
            .filter((f) => f.id !== id)
            .map((f) => (f.parentId === id ? { ...f, parentId: null } : f)),
          playlistFolderMap: Object.fromEntries(
            Object.entries(state.playlistFolderMap).filter(([, folderId]) => folderId !== id),
          ),
        })),

      toggleCollapsed: (id) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, collapsed: !f.collapsed } : f,
          ),
        })),

      togglePinned: (id) =>
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, pinned: !f.pinned } : f)),
        })),

      assignPlaylistToFolder: (playlistId, folderId) =>
        set((state) => {
          const next = { ...state.playlistFolderMap };
          if (folderId) next[playlistId] = folderId;
          else delete next[playlistId];
          return { playlistFolderMap: next };
        }),

      // A folder can accept a subfolder only if it is itself at the root (depth 0),
      // keeping the tree at a maximum depth of 2 (root + one nested level).
      canNestUnder: (folderId) => {
        const parent = get().folders.find((f) => f.id === folderId);
        return Boolean(parent) && parent!.parentId === null;
      },
    }),
    { name: "tarang-folders" },
  ),
);

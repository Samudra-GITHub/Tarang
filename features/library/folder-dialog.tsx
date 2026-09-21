"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FOLDER_COLORS, useFoldersStore, type PlaylistFolder } from "@/lib/store/folders-store";

interface FolderDialogState {
  mode: "create" | "edit";
  parentId?: string | null;
  folder?: PlaylistFolder;
}

export function FolderDialog({
  state,
  onClose,
}: {
  state: FolderDialogState | null;
  onClose: () => void;
}) {
  const createFolder = useFoldersStore((s) => s.createFolder);
  const renameFolder = useFoldersStore((s) => s.renameFolder);
  const recolorFolder = useFoldersStore((s) => s.recolorFolder);

  const [name, setName] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0]);

  useEffect(() => {
    if (state?.mode === "edit" && state.folder) {
      setName(state.folder.name);
      setColor(state.folder.color);
    } else {
      setName("");
      setColor(FOLDER_COLORS[0]);
    }
  }, [state]);

  const isOpen = state !== null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (state?.mode === "edit" && state.folder) {
      renameFolder(state.folder.id, name.trim());
      recolorFolder(state.folder.id, color);
    } else if (state?.mode === "create") {
      const id = createFolder(name.trim(), state.parentId ?? null);
      if (id) recolorFolder(id, color);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {state?.mode === "edit" ? "Edit Folder" : state?.parentId ? "New Subfolder" : "New Folder"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Folder name"
            className="h-9"
          />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Color</span>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  aria-label={`Use color ${swatch}`}
                  aria-pressed={color === swatch}
                  className={cn(
                    "size-7 rounded-full ring-offset-2 ring-offset-popover transition-transform hover:scale-110",
                    color === swatch && "ring-2 ring-foreground",
                  )}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" size="sm" className="self-end rounded-full" disabled={!name.trim()}>
            {state?.mode === "edit" ? "Save" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

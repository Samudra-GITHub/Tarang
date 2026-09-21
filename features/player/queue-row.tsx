"use client";

import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";
import type { Song } from "@/types/music";
import { formatDuration } from "@/lib/format-time";
import { cn } from "@/lib/utils";

function QueueRowContent({
  song,
  reorderable,
  onPlay,
  onRemove,
  onMoveUp,
  onMoveDown,
  dragHandleProps,
}: {
  song: Song;
  reorderable: boolean;
  onPlay?: () => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      onClick={onPlay}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5",
        onPlay && "cursor-pointer hover:bg-surface-2",
      )}
    >
      {reorderable && (
        <div
          {...dragHandleProps}
          className="touch-none cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-4 shrink-0" aria-hidden />
        </div>
      )}
      <Image
        src={song.coverUrl}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 rounded object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{song.title}</p>
        <p className="truncate text-xs text-muted-foreground">{song.artistName}</p>
      </div>
      <span className="hidden font-mono text-xs text-muted-foreground sm:block">
        {formatDuration(song.duration)}
      </span>
      {reorderable && (
        <div className="flex items-center">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMoveUp?.();
            }}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Move up in queue"
          >
            <ChevronUp className="size-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMoveDown?.();
            }}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Move down in queue"
          >
            <ChevronDown className="size-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove?.();
            }}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Remove from queue"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

/** A static row — used for "Now Playing" and read-only History entries. */
export function QueueRow({ song, onPlay }: { song: Song; onPlay?: () => void }) {
  return <QueueRowContent song={song} reorderable={false} onPlay={onPlay} />;
}

/** A drag-reorderable row — must be rendered inside a <Reorder.Group>. */
export function ReorderableQueueRow({
  song,
  onPlay,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  song: Song;
  onPlay?: () => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item value={song} dragListener={false} dragControls={dragControls} className="list-none">
      <QueueRowContent
        song={song}
        reorderable
        onPlay={onPlay}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        dragHandleProps={{
          onPointerDown: (event) => dragControls.start(event),
        }}
      />
    </Reorder.Item>
  );
}

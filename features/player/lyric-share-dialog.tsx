"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Song } from "@/types/music";
import { toast } from "@/lib/store/toast-store";
import { THEME_COLORS } from "@/lib/theme-colors";

const CARD_WIDTH = 480;
const CARD_HEIGHT = 600;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function drawCard(
  canvas: HTMLCanvasElement,
  song: Song,
  lineText: string,
  dominantColor: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  gradient.addColorStop(0, dominantColor);
  gradient.addColorStop(1, THEME_COLORS.background);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const artSize = 152;
  const artX = (CARD_WIDTH - artSize) / 2;
  const artY = 56;
  const img = await loadImage(song.coverUrl);
  ctx.save();
  const radius = 16;
  ctx.beginPath();
  ctx.moveTo(artX + radius, artY);
  ctx.arcTo(artX + artSize, artY, artX + artSize, artY + artSize, radius);
  ctx.arcTo(artX + artSize, artY + artSize, artX, artY + artSize, radius);
  ctx.arcTo(artX, artY + artSize, artX, artY, radius);
  ctx.arcTo(artX, artY, artX + artSize, artY, radius);
  ctx.closePath();
  ctx.clip();
  if (img) {
    ctx.drawImage(img, artX, artY, artSize, artSize);
  } else {
    ctx.fillStyle = THEME_COLORS.surface2;
    ctx.fillRect(artX, artY, artSize, artSize);
  }
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = THEME_COLORS.foreground;
  ctx.font = "600 20px sans-serif";
  ctx.fillText(song.title, CARD_WIDTH / 2, artY + artSize + 36, CARD_WIDTH - 80);
  ctx.fillStyle = "rgba(242,242,240,0.65)";
  ctx.font = "400 14px sans-serif";
  ctx.fillText(song.artistName, CARD_WIDTH / 2, artY + artSize + 58, CARD_WIDTH - 80);

  ctx.fillStyle = THEME_COLORS.foreground;
  ctx.font = "700 30px sans-serif";
  const lyricLines = wrapText(ctx, `"${lineText}"`, CARD_WIDTH - 96);
  const lineHeight = 40;
  const blockHeight = lyricLines.length * lineHeight;
  const startY = artY + artSize + 130 + Math.max(0, (150 - blockHeight) / 2);
  lyricLines.forEach((line, index) => {
    ctx.fillText(line, CARD_WIDTH / 2, startY + index * lineHeight, CARD_WIDTH - 96);
  });

  ctx.fillStyle = "rgba(242,242,240,0.5)";
  ctx.font = "500 15px sans-serif";
  ctx.fillText("तरङ्ग · Tarang", CARD_WIDTH / 2, CARD_HEIGHT - 32);
}

export function LyricShareDialog({
  song,
  lineText,
  dominantColor,
  onClose,
}: {
  song: Song | null;
  lineText: string | null;
  dominantColor: string;
  onClose: () => void;
}) {
  // A state-backed ref (rather than a plain useRef) so this component re-renders
  // once Radix actually mounts DialogContent's children — a plain ref read
  // inside an effect can fire before that portal mount lands, missing the draw.
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
    if (!canvas || !song || !lineText) return;
    void drawCard(canvas, song, lineText, dominantColor);
  }, [canvas, song, lineText, dominantColor]);

  const handleDownload = () => {
    if (!canvas) return;
    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${song?.title ?? "tarang-lyric"}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch {
      // Canvas export can fail if the artwork host ever blocks anonymous CORS reads — the card still previews fine.
    }
  };

  const handleCopy = async () => {
    if (!lineText) return;
    try {
      await navigator.clipboard.writeText(lineText);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy", "Clipboard access was blocked by the browser.");
    }
  };

  return (
    <Dialog open={Boolean(song && lineText)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Share this line</DialogTitle>
        </DialogHeader>
        <canvas
          ref={setCanvas}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          className="w-full rounded-lg"
        />
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={handleCopy}>
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? "Copied" : "Copy text"}
          </Button>
          <Button className="flex-1" onClick={handleDownload}>
            <Download className="size-4" aria-hidden />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

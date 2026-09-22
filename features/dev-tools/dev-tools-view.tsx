"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import { Chip } from "@/components/ui/chip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Display, Heading, Title, Body, Label, Caption, Mono } from "@/components/ui/typography";
import { Page, PageContainer, PageHeader } from "@/components/layout/page";
import { Section, SectionTitle, SectionDescription } from "@/components/layout/section";
import { toast } from "@/lib/store/toast-store";
import { announce } from "@/lib/store/announce-store";
import { usePlayerStore } from "@/lib/store/player-store";
import { songs } from "@/data/songs";
import * as variants from "@/lib/motion-variants";
import { Play } from "lucide-react";

const RADIUS_TOKENS = ["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-full"];
const SHADOW_TOKENS = ["shadow-sm", "shadow-md", "shadow-lg", "shadow-artwork-md", "shadow-artwork-lg"];
const SPACING_TOKENS = [1, 2, 3, 4, 6, 8, 12, 16, 24];
const COLOR_TOKENS = [
  "bg-background", "bg-surface", "bg-surface-2", "bg-surface-3", "bg-primary",
  "bg-accent-secondary", "bg-muted", "bg-accent-success", "bg-accent-warning", "bg-accent-danger",
];
const BREAKPOINTS = [
  { name: "sm", min: 640 },
  { name: "md", min: 768 },
  { name: "lg", min: 1024 },
  { name: "xl", min: 1280 },
  { name: "2xl", min: 1536 },
];
const MOTION_VARIANTS: Array<[string, Variants]> = [
  ["fade", variants.fade],
  ["fadeUp", variants.fadeUp],
  ["fadeDown", variants.fadeDown],
  ["fadeScale", variants.fadeScale],
  ["cardEnter", variants.cardEnter],
  ["sectionEnter", variants.sectionEnter],
  ["pageEnter", variants.pageEnter],
  ["drawerEnter", variants.drawerEnter],
  ["sheetEnter", variants.sheetEnter],
  ["toastEnter", variants.toastEnter],
  ["playerExpand", variants.playerExpand],
  ["queueSlide", variants.queueSlide],
  ["railItem", variants.railItem],
];

function DevSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Section className="gap-4 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div>
        <SectionTitle>{title}</SectionTitle>
        {description && <SectionDescription className="mt-1">{description}</SectionDescription>}
      </div>
      {children}
    </Section>
  );
}

function useViewportWidth() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

function BreakpointSimulator() {
  const width = useViewportWidth();
  const active = [...BREAKPOINTS].reverse().find((bp) => width >= bp.min);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Mono>{width}px</Mono>
      <div className="flex gap-1.5">
        {BREAKPOINTS.map((bp) => (
          <Chip key={bp.name} selected={active?.name === bp.name} disabled>
            {bp.name} ≥{bp.min}
          </Chip>
        ))}
      </div>
      <Caption>Resize the window — this reads the real viewport, it doesn&apos;t fake one.</Caption>
    </div>
  );
}

function SafeAreaSimulator() {
  const [inset, setInset] = useState(24);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Label as="label" htmlFor="safe-area-inset">Simulated inset</Label>
        <input
          id="safe-area-inset"
          type="range"
          min={0}
          max={64}
          value={inset}
          onChange={(e) => setInset(Number(e.target.value))}
          className="w-40"
        />
        <Mono>{inset}px</Mono>
      </div>
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface-2">
        <div className="bg-primary/20" style={{ height: inset }} />
        <div className="p-3">
          <Caption>Content below the simulated top safe-area inset</Caption>
        </div>
      </div>
      <Caption>Illustrative only — the real SafeArea component reads env(safe-area-inset-*) from the device.</Caption>
    </div>
  );
}

function MotionPreview() {
  const [playKey, setPlayKey] = useState(0);
  const [reducedPreview, setReducedPreview] = useState(false);
  const [selected, setSelected] = useState<string>("fadeUp");
  const activeVariant = MOTION_VARIANTS.find(([name]) => name === selected)?.[1] ?? variants.fadeUp;

  const strippedVariant: Variants = reducedPreview
    ? Object.fromEntries(
        Object.entries(activeVariant).map(([key, value]) => [
          key,
          typeof value === "object" && value !== null
            ? Object.fromEntries(Object.entries(value).filter(([k]) => !["x", "y", "scale", "scaleX", "scaleY", "rotate"].includes(k)))
            : value,
        ]),
      )
    : activeVariant;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {MOTION_VARIANTS.map(([name]) => (
          <Chip key={name} selected={selected === name} onClick={() => setSelected(name)}>
            {name}
          </Chip>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={reducedPreview} onCheckedChange={setReducedPreview} aria-label="Preview with reduced motion" />
        <Label as="span">Preview with reduced motion (strips transforms, keeps opacity)</Label>
      </div>
      <div className="flex items-center gap-4">
        <Button size="sm" onClick={() => setPlayKey((k) => k + 1)}>Replay</Button>
        <div className="flex h-24 w-40 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2">
          <motion.div
            key={playKey}
            variants={strippedVariant}
            initial="initial"
            animate="animate"
            className="flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <Play className="size-5 fill-current" aria-hidden />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AudioTester() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentSong = usePlayerStore((s) => (s.currentIndex >= 0 ? s.queue[s.currentIndex] : undefined));
  const playQueue = usePlayerStore((s) => s.playQueue);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const addNext = usePlayerStore((s) => s.addNext);
  const addToPlayLater = usePlayerStore((s) => s.addToPlayLater);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const playLaterLength = usePlayerStore((s) => s.playLater.length);

  const sample = songs[0];

  return (
    <div className="flex flex-col gap-3">
      <Body>
        {currentSong ? `Now: ${currentSong.title} — ${isPlaying ? "playing" : "paused"}` : "Nothing loaded"}
      </Body>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => playQueue(songs.slice(0, 5), 0, "Dev Tools")}>Load 5 test songs</Button>
        <Button size="sm" variant="secondary" onClick={togglePlay}>Play/Pause</Button>
        <Button size="sm" variant="secondary" onClick={previous}>Previous</Button>
        <Button size="sm" variant="secondary" onClick={next}>Next</Button>
        <Button size="sm" variant="secondary" onClick={() => seekTo(30)}>Seek to 0:30</Button>
        <Button size="sm" variant="secondary" onClick={() => setVolume(0.5)}>Volume 50%</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => sample && addNext(sample)}>Add next: queue tester</Button>
        <Button size="sm" variant="outline" onClick={() => sample && addToPlayLater(sample)}>Add to Play Later</Button>
      </div>
      <Caption>Queue length: {queueLength} · Play Later: {playLaterLength}</Caption>
    </div>
  );
}

export function DevToolsView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pinging, setPinging] = useState(false);
  const announceRef = useRef(0);

  return (
    <PageContainer maxWidth="4xl">
      <Page spacing="lg">
        <PageHeader
          title="Dev Tools"
          description="Developer-only diagnostics. Not linked from navigation, not for end users."
        />

        <DevSection title="Theme" description="Tarang is dark-only by design — there is no light theme to preview.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {COLOR_TOKENS.map((cls) => (
              <div key={cls} className="flex flex-col gap-1.5">
                <div className={`h-12 w-full rounded-lg border border-border ${cls}`} />
                <Mono>{cls}</Mono>
              </div>
            ))}
          </div>
        </DevSection>

        <DevSection title="Typography">
          <div className="flex flex-col gap-2">
            <Display>Display</Display>
            <Heading>Heading</Heading>
            <Title>Title</Title>
            <Body>Body — the default paragraph size.</Body>
            <Label as="p">Label</Label>
            <Caption>Caption — metadata and secondary text.</Caption>
            <Mono>00:00 Mono</Mono>
          </div>
        </DevSection>

        <DevSection title="Spacing">
          <div className="flex flex-wrap items-end gap-3">
            {SPACING_TOKENS.map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <div className={`w-4 bg-primary/60`} style={{ height: n * 4 }} />
                <Mono>{n}</Mono>
              </div>
            ))}
          </div>
        </DevSection>

        <DevSection title="Radius">
          <div className="flex flex-wrap gap-4">
            {RADIUS_TOKENS.map((cls) => (
              <div key={cls} className="flex flex-col items-center gap-1.5">
                <div className={`size-14 border border-border-strong bg-surface-2 ${cls}`} />
                <Mono>{cls}</Mono>
              </div>
            ))}
          </div>
        </DevSection>

        <DevSection title="Elevation">
          <div className="flex flex-wrap gap-6">
            {SHADOW_TOKENS.map((cls) => (
              <div key={cls} className="flex flex-col items-center gap-1.5">
                <div className={`size-14 rounded-lg bg-surface-2 ${cls}`} />
                <Mono>{cls}</Mono>
              </div>
            ))}
          </div>
        </DevSection>

        <DevSection title="Motion" description="Every shared variant from lib/motion-variants.ts, with a reduced-motion preview toggle.">
          <MotionPreview />
        </DevSection>

        <DevSection title="Safe area simulator">
          <SafeAreaSimulator />
        </DevSection>

        <DevSection title="Breakpoint simulator">
          <BreakpointSimulator />
        </DevSection>

        <DevSection title="Toast tester">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => toast.success("Success toast", "This is a success toast.")}>Success</Button>
            <Button size="sm" variant="destructive" onClick={() => toast.error("Error toast", "This is an error toast.")}>Error</Button>
            <Button size="sm" variant="secondary" onClick={() => toast.warning("Warning toast", "This is a warning toast.")}>Warning</Button>
            <Button size="sm" variant="outline" onClick={() => toast.info("Info toast", "This is an info toast.")}>Info</Button>
          </div>
        </DevSection>

        <DevSection title="Live-region announcer tester" description="Fires the same aria-live channel used for play/pause/seek/volume/queue announcements.">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                announceRef.current += 1;
                announce(`Test announcement ${announceRef.current}`);
                setPinging(true);
                setTimeout(() => setPinging(false), 600);
              }}
            >
              Announce
            </Button>
            {pinging && <Caption>Sent — check with a screen reader on.</Caption>}
          </div>
        </DevSection>

        <DevSection title="Dialog / Sheet tester">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Button size="sm" variant="secondary" onClick={() => setSheetOpen(true)}>Open Bottom Sheet</Button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog tester</DialogTitle>
              </DialogHeader>
              <Body>A real Dialog instance, opened from Dev Tools.</Body>
            </DialogContent>
          </Dialog>
          <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <BottomSheetContent>
              <BottomSheetHeader>
                <BottomSheetTitle>Bottom sheet tester</BottomSheetTitle>
              </BottomSheetHeader>
              <Body className="px-4 pb-4">A real BottomSheet instance, opened from Dev Tools.</Body>
            </BottomSheetContent>
          </BottomSheet>
        </DevSection>

        <DevSection title="Audio / Queue tester" description="Drives the real player store — actions here affect the real mini player.">
          <AudioTester />
        </DevSection>

        <DevSection title="Touch targets">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <IconButton size="sm" aria-label="Icon small — 32px visual, 44px hit area"><Play className="size-4" /></IconButton>
              <Caption>icon-sm</Caption>
            </div>
            <div className="flex flex-col items-center gap-1">
              <IconButton size="md" aria-label="Icon medium — 36px visual, 44px hit area"><Play className="size-4" /></IconButton>
              <Caption>icon (md)</Caption>
            </div>
            <div className="flex flex-col items-center gap-1">
              <IconButton size="lg" aria-label="Icon large — 44px"><Play className="size-4" /></IconButton>
              <Caption>icon-lg</Caption>
            </div>
          </div>
        </DevSection>
      </Page>
    </PageContainer>
  );
}

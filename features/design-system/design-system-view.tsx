"use client";

import { useState } from "react";
import { Heart, Plus, Search, Download, Music2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { PlayButton } from "@/components/ui/play-button";
import { FAB } from "@/components/ui/fab";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { PasswordInput } from "@/components/ui/password-input";
import { OTPInput } from "@/components/ui/otp-input";
import { TextArea } from "@/components/ui/textarea";
import { LinearProgress, CircularProgress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardArtwork, CardBody, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heading, Title, Display, Body, Label, Caption, Mono } from "@/components/ui/typography";
import { toast } from "@/lib/store/toast-store";
import { albums } from "@/data/albums";
import { Page, PageContainer, PageHeader } from "@/components/layout/page";
import { Section, SectionTitle, SectionDescription } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { HorizontalRail } from "@/components/layout/horizontal-rail";
import { StickyHeader } from "@/components/layout/sticky-header";

function DemoSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
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

function Swatch({ name, cls }: { name: string; cls: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-14 w-full rounded-lg border border-border ${cls}`} />
      <Mono>{name}</Mono>
    </div>
  );
}

const COLOR_TOKENS = [
  ["surface-0", "bg-surface-0"],
  ["surface-1", "bg-surface-1"],
  ["surface-2", "bg-surface-2"],
  ["surface-3", "bg-surface-3"],
  ["primary", "bg-primary"],
  ["accent-secondary", "bg-accent-secondary"],
  ["accent-success", "bg-accent-success"],
  ["accent-warning", "bg-accent-warning"],
  ["accent-danger", "bg-accent-danger"],
  ["border-strong", "bg-border-strong"],
] as const;

const RADIUS_TOKENS = [
  ["radius-sm", "rounded-sm"],
  ["radius-md", "rounded-md"],
  ["radius-lg", "rounded-lg"],
  ["radius-xl", "rounded-xl"],
  ["radius-2xl", "rounded-2xl"],
  ["radius-full", "rounded-full"],
] as const;

/**
 * Tarang's internal component playground — not linked from navigation.
 * Every primitive in `components/ui/` gets a live, interactive example here.
 */
export function DesignSystemView() {
  const [switchOn, setSwitchOn] = useState(true);
  const [chipSelected, setChipSelected] = useState(true);
  const [search, setSearch] = useState("lofi beats");
  const [otp, setOtp] = useState("123");
  const [dialogOpen, setDialogOpen] = useState(false);
  const demoAlbum = albums[0];

  return (
    <PageContainer maxWidth="4xl">
      <Page spacing="xl" className="py-8">
      <PageHeader
        title="Design System"
        description="Internal component playground — every Tarang UI primitive, live. Not linked from navigation."
      />

      <DemoSection title="Layout primitives" description="Page, Section, Grid, HorizontalRail, StickyHeader — the only layout building blocks used across the app.">
        <div className="flex flex-col gap-4">
          <Grid preset="settings">
            <div className="rounded-lg border border-border bg-surface-2 p-3"><Caption>Grid preset=&quot;settings&quot;</Caption></div>
            <div className="rounded-lg border border-border bg-surface-2 p-3"><Caption>grid-cols-1</Caption></div>
            <div className="rounded-lg border border-border bg-surface-2 p-3"><Caption>sm:grid-cols-3</Caption></div>
          </Grid>
          <StickyHeader className="rounded-lg border-border/60 bg-surface-2">
            <Caption className="px-3">StickyHeader — sticks to the top of its scroll container</Caption>
          </StickyHeader>
          <HorizontalRail title="HorizontalRail" animate={false}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex size-24 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2">
                <Caption>{i + 1}</Caption>
              </div>
            ))}
          </HorizontalRail>
        </div>
      </DemoSection>

      <DemoSection title="Typography">
        <div className="flex flex-col gap-2">
          <Display>Display — hero titles</Display>
          <Heading>Heading — page titles</Heading>
          <Title>Title — section headers</Title>
          <Body>Body — primary readable content</Body>
          <Label>Label — small uppercase eyebrow</Label>
          <Caption>Caption — secondary metadata</Caption>
          <Mono>Mono — 03:45 timecodes</Mono>
        </div>
      </DemoSection>

      <DemoSection title="Color tokens">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {COLOR_TOKENS.map(([name, cls]) => (
            <Swatch key={name} name={name} cls={cls} />
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Radius tokens">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {RADIUS_TOKENS.map(([name, cls]) => (
            <Swatch key={name} name={name} cls={`${cls} bg-surface-2`} />
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Elevation" description="Neutral shadow only — no colored glow, per the Design Constitution.">
        <div className="flex flex-wrap gap-4">
          <div className="flex size-20 items-center justify-center rounded-xl border border-border bg-surface-2 shadow-md shadow-black/20">
            <Caption>shadow-md</Caption>
          </div>
          <div className="flex size-20 items-center justify-center rounded-xl border border-border bg-surface-2 shadow-lg shadow-black/40">
            <Caption>shadow-lg</Caption>
          </div>
          <div className="flex size-20 items-center justify-center rounded-xl border border-border bg-surface-2 shadow-artwork-md">
            <Caption>artwork-md</Caption>
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Buttons" description="Primary, Secondary, Ghost, Outline, Destructive — plus loading and icon slots.">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button iconStart={<Plus className="size-4" />}>New Playlist</Button>
          <Button fullWidth className="max-w-52">
            Full width
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton aria-label="Search"><Search className="size-4" /></IconButton>
          <IconButton variant="primary" aria-label="Like"><Heart className="size-4" /></IconButton>
          <PlayButton variant="inline" label="Play demo" onPlay={() => toast.info("Playing")} />
          <FAB aria-label="Compose" icon={<Sparkles />} className="static" />
        </div>
      </DemoSection>

      <DemoSection title="Badges" description="Live, Explicit, Premium, Offline, New, Downloaded.">
        <div className="flex flex-wrap gap-2">
          <Badge variant="live">Live</Badge>
          <Badge variant="explicit">Explicit</Badge>
          <Badge variant="premium">Premium</Badge>
          <Badge variant="offline">Offline</Badge>
          <Badge variant="new">New</Badge>
          <Badge variant="downloaded">Downloaded</Badge>
        </div>
      </DemoSection>

      <DemoSection title="Chips">
        <div className="flex flex-wrap gap-2">
          <Chip selected={chipSelected} onClick={() => setChipSelected((v) => !v)}>
            Toggle me
          </Chip>
          <Chip selected={false}>Unselected</Chip>
          <Chip onRemove={() => toast.info("Removed")}>Dismissible tag</Chip>
          <Chip icon={<Music2 className="size-3.5" />}>With icon</Chip>
        </div>
      </DemoSection>

      <DemoSection title="Switches">
        <div className="flex items-center gap-3">
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} aria-label="Demo switch" />
          <Body>{switchOn ? "On" : "Off"}</Body>
        </div>
      </DemoSection>

      <DemoSection title="Progress" description="LinearProgress and CircularProgress — determinate only, no fake indeterminate stats.">
        <div className="flex max-w-sm flex-col gap-3">
          <LinearProgress value={0.65} aria-label="Demo progress" />
          <div className="flex items-center gap-4">
            <CircularProgress value={0.65} />
            <Spinner />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Inputs">
        <div className="grid max-w-sm gap-3">
          <Input placeholder="Default input" />
          <Input placeholder="With helper text" helperText="This is helper text." />
          <Input placeholder="Error state" state="error" helperText="Something went wrong." />
          <Input placeholder="Success state" state="success" helperText="Looks good." />
          <SearchInput value={search} onChange={setSearch} placeholder="Search…" />
          <PasswordInput placeholder="Password" />
          <TextArea placeholder="A longer note…" />
          <OTPInput value={otp} onChange={setOtp} length={6} />
        </div>
      </DemoSection>

      <DemoSection title="Cards" description="One shared Card primitive powers Album, Playlist, Artist, Track, Mood and Editorial cards.">
        {demoAlbum && (
          <Card>
            <CardArtwork src={demoAlbum.coverUrl} href="#" ariaLabel={demoAlbum.title}>
              <PlayButton label="Play" onPlay={() => toast.success("Playing", demoAlbum.title)} />
            </CardArtwork>
            <CardBody>
              <CardTitle>{demoAlbum.title}</CardTitle>
              <CardSubtitle>{demoAlbum.artistName}</CardSubtitle>
            </CardBody>
          </Card>
        )}
      </DemoSection>

      <DemoSection title="Toasts">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => toast.success("Saved successfully")}>
            Success
          </Button>
          <Button variant="secondary" onClick={() => toast.error("Something went wrong")}>
            Error
          </Button>
          <Button variant="secondary" onClick={() => toast.warning("Storage almost full")}>
            Warning
          </Button>
          <Button variant="secondary" onClick={() => toast.info("New songs added")}>
            Info
          </Button>
        </div>
      </DemoSection>

      <DemoSection title="Dialog">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Example dialog</DialogTitle>
            </DialogHeader>
            <Body>Shared overlay elevation, spacing and animation — no glassmorphism blur.</Body>
            <Button onClick={() => setDialogOpen(false)}>
              <Download className="size-4" aria-hidden />
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </DemoSection>
      </Page>
    </PageContainer>
  );
}

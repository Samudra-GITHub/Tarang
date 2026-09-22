"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Download, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VolumeProgress } from "@/components/ui/volume-progress";
import { FilterChip } from "@/components/ui/chip";
import { Switch } from "@/components/ui/switch";
import { Body, Caption } from "@/components/ui/typography";
import { initialFromName, useProfileStore } from "@/lib/store/profile-store";
import { useSettingsStore } from "@/lib/store/settings-store";
import { usePlayerStore } from "@/lib/store/player-store";
import { toast } from "@/lib/store/toast-store";
import {
  useVisualizerStore,
  VISUALIZER_STYLE_LABELS,
  type VisualizerStyle,
} from "@/lib/store/visualizer-store";
import { Page, PageContainer, PageHeader } from "@/components/layout/page";
import { Section, SectionTitle, SectionDescription } from "@/components/layout/section";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Section className="gap-4 rounded-lg border border-border bg-surface p-4 md:p-5">
      <div>
        <SectionTitle>{title}</SectionTitle>
        {description && <SectionDescription className="mt-0.5">{description}</SectionDescription>}
      </div>
      {children}
    </Section>
  );
}

export function SettingsView() {
  const name = useProfileStore((s) => s.name);
  const email = useProfileStore((s) => s.email);
  const setName = useProfileStore((s) => s.setName);
  const setEmail = useProfileStore((s) => s.setEmail);
  const signOut = useProfileStore((s) => s.signOut);

  const [nameDraft, setNameDraft] = useState(name);
  const [emailDraft, setEmailDraft] = useState(email);

  // The profile store rehydrates from localStorage asynchronously after this
  // component's first render, so the drafts above can briefly lock onto the
  // pre-rehydration default — resync once the real persisted values arrive
  // (and whenever they change from elsewhere, e.g. Sign out).
  useEffect(() => {
    setNameDraft(name);
  }, [name]);
  useEffect(() => {
    setEmailDraft(email);
  }, [email]);

  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  const visualizerStyle = useVisualizerStore((s) => s.style);
  const setVisualizerStyle = (style: VisualizerStyle) =>
    useVisualizerStore.setState({ style });

  const notifyTrending = useSettingsStore((s) => s.notifyTrending);
  const toggleNotifyTrending = useSettingsStore((s) => s.toggleNotifyTrending);

  return (
    <PageContainer maxWidth="2xl">
      <Page spacing="md">
      <PageHeader title="Settings" />

      <SectionCard title="Profile" description="Saved on this device — Tarang has no backend.">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-surface-2 text-lg font-medium">
              {initialFromName(nameDraft || name)}
            </AvatarFallback>
          </Avatar>
          <form
            className="flex min-w-0 flex-1 flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setName(nameDraft);
              setEmail(emailDraft);
              toast.success("Profile saved");
            }}
          >
            <Input
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              onBlur={() => setName(nameDraft)}
              placeholder="Your name"
              className="h-9"
              aria-label="Display name"
            />
            <Input
              value={emailDraft}
              onChange={(event) => setEmailDraft(event.target.value)}
              onBlur={() => setEmail(emailDraft)}
              placeholder="Email (optional)"
              type="email"
              className="h-9"
              aria-label="Email"
            />
          </form>
        </div>
        <Button
          variant="ghost"
          className="w-fit gap-2 self-start text-muted-foreground hover:text-destructive"
          onClick={() => {
            signOut();
            setNameDraft("Guest Listener");
            setEmailDraft("");
            toast.info("Signed out");
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </SectionCard>

      <SectionCard title="Playback">
        <div className="flex flex-col gap-2">
          <Body className="font-medium">Default volume</Body>
          <VolumeProgress volume={volume} onVolumeChange={setVolume} className="max-w-xs" />
        </div>

        <div className="flex flex-col gap-2">
          <Body className="font-medium">Waveform visualizer</Body>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(VISUALIZER_STYLE_LABELS) as VisualizerStyle[]).map((style) => (
              <FilterChip
                key={style}
                selected={visualizerStyle === style}
                onClick={() => setVisualizerStyle(style)}
              >
                {VISUALIZER_STYLE_LABELS[style]}
              </FilterChip>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notifications">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-2">
            <div>
              <Body id="notify-trending-label" className="font-medium">
                New viral songs
              </Body>
              <Caption className="block">Let me know when Trending Now shifts.</Caption>
            </div>
          </div>
          <Switch
            checked={notifyTrending}
            onCheckedChange={toggleNotifyTrending}
            aria-labelledby="notify-trending-label"
          />
        </div>
      </SectionCard>

      <SectionCard title="Downloads & Storage">
        <Button asChild variant="secondary" className="w-fit gap-2">
          <Link href="/downloads">
            <Download className="size-4" aria-hidden />
            Manage downloads
          </Link>
        </Button>
      </SectionCard>

      <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <User className="size-3.5" aria-hidden />
        Tarang · तरङ्ग — all preferences are stored on this device only.
      </div>
      </Page>
    </PageContainer>
  );
}

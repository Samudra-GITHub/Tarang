"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Bell, Download, LogOut, User, Volume2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { initialFromName, useProfileStore } from "@/lib/store/profile-store";
import { useSettingsStore } from "@/lib/store/settings-store";
import { usePlayerStore } from "@/lib/store/player-store";
import {
  useVisualizerStore,
  VISUALIZER_STYLE_LABELS,
  type VisualizerStyle,
} from "@/lib/store/visualizer-store";

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
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-5">
      <div>
        <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Settings</h1>

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
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </SectionCard>

      <SectionCard title="Playback">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Volume2 className="size-4 text-muted-foreground" aria-hidden />
            Default volume
          </div>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className="max-w-xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-foreground">Waveform visualizer</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(VISUALIZER_STYLE_LABELS) as VisualizerStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setVisualizerStyle(style)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  visualizerStyle === style
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground",
                )}
              >
                {VISUALIZER_STYLE_LABELS[style]}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notifications">
        <button
          type="button"
          onClick={toggleNotifyTrending}
          aria-pressed={notifyTrending}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
            notifyTrending
              ? "border-primary/40 bg-primary/5"
              : "border-border bg-surface hover:bg-surface-2",
          )}
        >
          <div className="flex items-center gap-2">
            <Bell
              className={cn("size-4", notifyTrending ? "text-primary" : "text-muted-foreground")}
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-foreground">New viral songs</p>
              <p className="text-xs text-muted-foreground">
                Let me know when Trending Now shifts.
              </p>
            </div>
          </div>
          <span
            className={cn(
              "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
              notifyTrending ? "bg-primary" : "bg-surface-2",
            )}
          >
            <span
              className={cn(
                "size-4 rounded-full bg-white transition-transform",
                notifyTrending ? "translate-x-4" : "translate-x-0",
              )}
            />
          </span>
        </button>
      </SectionCard>

      <SectionCard title="Downloads & Storage">
        <Button asChild variant="secondary" className="w-fit gap-2 rounded-full">
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
    </div>
  );
}

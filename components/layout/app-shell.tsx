import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { MiniPlayerFrame } from "@/components/layout/mini-player-frame";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NowPlayingView } from "@/features/player/now-playing-view";
import { QueueDrawer } from "@/features/player/queue-drawer";
import { AddToPlaylistDialog } from "@/features/library/add-to-playlist-dialog";
import { PageTransition } from "@/components/layout/page-transition";
import { SmartDownloadsSync } from "@/features/downloads/smart-downloads-sync";
import { CreditsSheet } from "@/features/player/credits-sheet";
import { YoutubePlayerMount } from "@/features/youtube/youtube-player-mount";
import { GlobalShortcuts } from "@/components/layout/global-shortcuts";
import { SongPopupDialog } from "@/features/home/song-popup-dialog";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <OfflineBanner />
          <main className="min-h-0 flex-1 overflow-y-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <MiniPlayerFrame />
      <MobileNav />
      <NowPlayingView />
      <QueueDrawer />
      <AddToPlaylistDialog />
      <SmartDownloadsSync />
      <CreditsSheet />
      <YoutubePlayerMount />
      <GlobalShortcuts />
      <SongPopupDialog />
    </div>
  );
}

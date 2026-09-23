import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { MiniPlayerFrame } from "@/components/layout/mini-player-frame";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NowPlayingView } from "@/features/player/now-playing-view";
import { QueueDrawer } from "@/features/player/queue-drawer";
import { AddToPlaylistDialog } from "@/features/library/add-to-playlist-dialog";
import { PageTransition } from "@/components/layout/page-transition";
import { YoutubePlayerMount } from "@/features/youtube/youtube-player-mount";
import { GlobalShortcuts } from "@/components/layout/global-shortcuts";
import { SongPopupDialog } from "@/features/home/song-popup-dialog";
import { ToastViewport } from "@/components/ui/toast";
import { ScrollContainer } from "@/components/layout/scroll-container";
import { LiveRegion } from "@/components/layout/live-region";
import { WallpaperBackground } from "@/components/decorative/wallpaper-background";

const SmartDownloadsSync = dynamic(() =>
  import("@/features/downloads/smart-downloads-sync").then((m) => m.SmartDownloadsSync),
);
const CreditsSheet = dynamic(() =>
  import("@/features/player/credits-sheet").then((m) => m.CreditsSheet),
);

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <WallpaperBackground />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <OfflineBanner />
          <ScrollContainer as="main">
            <PageTransition>{children}</PageTransition>
          </ScrollContainer>
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
      <ToastViewport />
      <LiveRegion />
    </div>
  );
}

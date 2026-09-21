"use client";

import { Disc3, Pin as PinIcon, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlbumCard } from "@/components/cards/album-card";
import { ArtistCard } from "@/components/cards/artist-card";
import { PinnedItemCard } from "@/components/cards/pinned-item-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useLibraryStore } from "@/lib/store/library-store";
import { usePinsStore } from "@/lib/store/pins-store";
import { albums } from "@/data/albums";
import { artists } from "@/data/artists";
import { PlaylistFolders } from "./playlist-folders";
import { LibrarySongsPanel } from "./library-songs-panel";
import { RecentlyAddedTimeline } from "./recently-added-timeline";

export function LibraryView() {
  const savedAlbumIds = useLibraryStore((state) => state.savedAlbumIds);
  const followedArtistIds = useLibraryStore((state) => state.followedArtistIds);
  const pins = usePinsStore((state) => state.pins);

  const savedAlbums = albums.filter((album) => savedAlbumIds.includes(album.id));
  const followedArtists = artists.filter((artist) => followedArtistIds.includes(artist.id));

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Your Library</h1>

      <Tabs defaultValue="playlists">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="pinned">Pinned</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="playlists" className="pt-4">
          <PlaylistFolders />
        </TabsContent>

        <TabsContent value="songs" className="pt-4">
          <LibrarySongsPanel />
        </TabsContent>

        <TabsContent value="albums" className="pt-4">
          {savedAlbums.length === 0 ? (
            <EmptyState
              icon={Disc3}
              title="No saved albums"
              description="Save albums from Home or Search to see them here."
              action={{ label: "Find albums", href: "/search" }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {savedAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="artists" className="pt-4">
          {followedArtists.length === 0 ? (
            <EmptyState
              icon={UserRound}
              title="No followed artists"
              description="Follow artists to keep up with what they release."
              action={{ label: "Find artists", href: "/search" }}
            />
          ) : (
            <div className="flex flex-wrap gap-4">
              {followedArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pinned" className="pt-4">
          {pins.length === 0 ? (
            <EmptyState
              icon={PinIcon}
              title="Nothing pinned yet"
              description="Pin albums, artists, playlists, or songs to keep them one tap away."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {pins.map((pin) => (
                <PinnedItemCard key={`${pin.kind}-${pin.id}`} pin={pin} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="pt-4">
          <RecentlyAddedTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
}

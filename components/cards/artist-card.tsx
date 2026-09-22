"use client";

import Link from "next/link";
import Image from "next/image";
import type { Artist } from "@/types/music";
import { Card } from "@/components/ui/card";
import { Body, Caption } from "@/components/ui/typography";

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Card width="sm" tiltDegrees={6} className="text-center">
      <Link href={`/artist/${artist.id}`} className="focus-visible:outline-2 focus-visible:outline-ring">
        <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full border border-border bg-surface-2 shadow-md shadow-black/20 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-black/35 sm:w-32">
          <Image
            src={artist.coverUrl}
            alt=""
            fill
            sizes="128px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
        <Body className="mt-2 truncate font-medium group-hover:underline">{artist.name}</Body>
        <Caption className="block truncate">{artist.genre}</Caption>
      </Link>
    </Card>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { Clock, Flame, Headphones } from "lucide-react";
import { useHistoryStore } from "@/lib/store/history-store";
import { StatTile } from "@/components/charts/stat-tile";
import { BarList } from "@/components/charts/bar-list";
import { MonthlyBarChart } from "@/components/charts/monthly-bar-chart";
import { ListeningJourney } from "./listening-journey";
import {
  computeListeningJourney,
  computeMonthlyHistory,
  computeStreak,
  computeTimeOfDayDistribution,
  computeTopAlbums,
  computeTopArtists,
  computeTopGenres,
  computeTotalHours,
} from "@/lib/stats";

export function StatsView() {
  const events = useHistoryStore((state) => state.events);
  const seedIfEmpty = useHistoryStore((state) => state.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  const totalHours = useMemo(() => computeTotalHours(events), [events]);
  const streak = useMemo(() => computeStreak(events), [events]);
  const topArtists = useMemo(() => computeTopArtists(events), [events]);
  const topAlbums = useMemo(() => computeTopAlbums(events), [events]);
  const topGenres = useMemo(() => computeTopGenres(events), [events]);
  const timeOfDay = useMemo(() => computeTimeOfDayDistribution(events), [events]);
  const monthly = useMemo(() => computeMonthlyHistory(events), [events]);
  const journey = useMemo(() => computeListeningJourney(events), [events]);

  if (events.length === 0) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Stats</h1>
        <p className="py-10 text-center text-sm text-muted-foreground">Loading your stats…</p>
      </div>
    );
  }

  const timeOfDayItems = [
    { key: "morning", label: "Morning", value: timeOfDay.morning },
    { key: "afternoon", label: "Afternoon", value: timeOfDay.afternoon },
    { key: "evening", label: "Evening", value: timeOfDay.evening },
    { key: "night", label: "Night", value: timeOfDay.night },
  ];

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Stats</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your listening, at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Hours listened" value={totalHours.toFixed(1)} icon={Clock} />
        <StatTile label="Day streak" value={String(streak)} icon={Flame} />
        <StatTile label="Total plays" value={events.length.toLocaleString()} icon={Headphones} />
      </div>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Top Artists</h2>
          <BarList
            items={topArtists.map(({ item, count }) => ({
              key: item.id,
              label: item.name,
              value: count,
              href: `/artist/${item.id}`,
            }))}
          />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Top Albums</h2>
          <BarList
            items={topAlbums.map(({ item, count }) => ({
              key: item.id,
              label: item.title,
              value: count,
              href: `/album/${item.id}`,
            }))}
          />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Top Genres</h2>
          <BarList
            items={topGenres.map(({ item, count }) => ({
              key: item,
              label: item,
              value: count,
            }))}
          />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Time of Day</h2>
          <BarList items={timeOfDayItems} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Monthly History</h2>
        <MonthlyBarChart data={monthly} />
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">Listening Journey</h2>
          <p className="text-sm text-muted-foreground">How your day sounds, hour by hour.</p>
        </div>
        <ListeningJourney entries={journey} />
      </section>
    </div>
  );
}

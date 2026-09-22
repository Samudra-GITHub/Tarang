"use client";

import { useEffect, useMemo } from "react";
import { Clock, Flame, Headphones } from "lucide-react";
import { useHistoryStore } from "@/lib/store/history-store";
import { StatTile } from "@/components/charts/stat-tile";
import { BarList } from "@/components/charts/bar-list";
import { MonthlyBarChart } from "@/components/charts/monthly-bar-chart";
import { ListeningJourney } from "./listening-journey";
import { Heading } from "@/components/ui/typography";
import { Page, PageContainer, PageHeader } from "@/components/layout/page";
import { Section, SectionTitle, SectionDescription } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
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
      <PageContainer>
        <Page spacing="md">
          <Heading>Stats</Heading>
          <p className="py-10 text-center text-sm text-muted-foreground">Loading your stats…</p>
        </Page>
      </PageContainer>
    );
  }

  const timeOfDayItems = [
    { key: "morning", label: "Morning", value: timeOfDay.morning },
    { key: "afternoon", label: "Afternoon", value: timeOfDay.afternoon },
    { key: "evening", label: "Evening", value: timeOfDay.evening },
    { key: "night", label: "Night", value: timeOfDay.night },
  ];

  return (
    <PageContainer>
      <Page spacing="md">
        <PageHeader title="Stats" description="Your listening, at a glance." />

        <Grid preset="settings">
          <StatTile label="Hours listened" value={totalHours.toFixed(1)} icon={Clock} />
          <StatTile label="Day streak" value={String(streak)} icon={Flame} />
          <StatTile label="Total plays" value={events.length.toLocaleString()} icon={Headphones} />
        </Grid>

        <Grid preset="panels" className="gap-8">
          <Section>
            <SectionTitle>Top Artists</SectionTitle>
            <BarList
              items={topArtists.map(({ item, count }) => ({
                key: item.id,
                label: item.name,
                value: count,
                href: `/artist/${item.id}`,
              }))}
            />
          </Section>

          <Section>
            <SectionTitle>Top Albums</SectionTitle>
            <BarList
              items={topAlbums.map(({ item, count }) => ({
                key: item.id,
                label: item.title,
                value: count,
                href: `/album/${item.id}`,
              }))}
            />
          </Section>

          <Section>
            <SectionTitle>Top Genres</SectionTitle>
            <BarList
              items={topGenres.map(({ item, count }) => ({
                key: item,
                label: item,
                value: count,
              }))}
            />
          </Section>

          <Section>
            <SectionTitle>Time of Day</SectionTitle>
            <BarList items={timeOfDayItems} />
          </Section>
        </Grid>

        <Section className="gap-4">
          <SectionTitle>Monthly History</SectionTitle>
          <MonthlyBarChart data={monthly} />
        </Section>

        <Section className="gap-4">
          <div>
            <SectionTitle>Listening Journey</SectionTitle>
            <SectionDescription>How your day sounds, hour by hour.</SectionDescription>
          </div>
          <ListeningJourney entries={journey} />
        </Section>
      </Page>
    </PageContainer>
  );
}

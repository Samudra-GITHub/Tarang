import { notFound } from "next/navigation";
import { moods } from "@/data/moods";
import { MoodDetailView } from "@/features/moods/mood-detail-view";

export default async function MoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mood = moods.find((m) => m.id === id);
  if (!mood) notFound();

  return <MoodDetailView mood={mood} />;
}

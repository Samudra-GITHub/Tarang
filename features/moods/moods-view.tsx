import { moods } from "@/data/moods";
import { MoodCard } from "./mood-card";

export function MoodsView() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Mood Spaces</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Immersive rooms for however you feel right now.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        {moods.map((mood) => (
          <MoodCard key={mood.id} mood={mood} />
        ))}
      </div>
    </div>
  );
}

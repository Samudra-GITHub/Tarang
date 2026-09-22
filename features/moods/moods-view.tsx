import { moods } from "@/data/moods";
import { MoodCard } from "./mood-card";
import { Page, PageContainer, PageHeader } from "@/components/layout/page";

export function MoodsView() {
  return (
    <PageContainer>
      <Page spacing="md">
        <PageHeader title="Mood Spaces" description="Immersive rooms for however you feel right now." />
        <div className="flex flex-wrap gap-5">
          {moods.map((mood) => (
            <MoodCard key={mood.id} mood={mood} />
          ))}
        </div>
      </Page>
    </PageContainer>
  );
}

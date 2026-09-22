import { Caption } from "@/components/ui/typography";
import { Page, PageContainer, PageHeader } from "@/components/layout/page";

export function PlaceholderPage({ title, note }: { title: string; note: string }) {
  return (
    <PageContainer>
      <Page spacing="md" className="gap-2">
        <PageHeader title={title} />
        <Caption>{note}</Caption>
      </Page>
    </PageContainer>
  );
}

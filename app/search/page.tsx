import { Suspense } from "react";
import { SearchView } from "@/features/search/search-view";
import { Page, PageContainer } from "@/components/layout/page";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <Page spacing="md" />
        </PageContainer>
      }
    >
      <SearchView />
    </Suspense>
  );
}

import { Suspense } from "react";
import { SearchView } from "@/features/search/search-view";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 md:px-6" />}>
      <SearchView />
    </Suspense>
  );
}

// app/(customer)/search/page.js
"use client";

import { SearchPageContent } from "@/components/customer/SearchPageContent";
import { Suspense } from "react";

// Loading component for suspense fallback
function SearchPageLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 bg-muted rounded-md w-64 mb-4 animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-96 animate-pulse" />
      </div>
      <div className="mb-8">
        <div className="flex gap-4 max-w-2xl">
          <div className="flex-1 h-12 bg-muted rounded-md animate-pulse" />
          <div className="w-24 h-12 bg-muted rounded-md animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  );
}

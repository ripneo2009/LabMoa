import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-4 py-16" aria-busy="true">
      <span className="sr-only">데이터를 불러오는 중입니다.</span>
      <div className="space-y-5">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </main>
  );
}


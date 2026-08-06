"use client"

// 검색 위저드 필터 상태 — URL 쿼리스트링에 저장해 서버 컴포넌트(app/search/page.tsx)가
// 곧바로 재조회하도록 한다. 필터는 공유 가능한 링크가 되고, 뒤로가기도 자연스럽게 동작한다.
import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Field } from "@/lib/constants/fields";
import type { Region } from "@/lib/constants/regions";
import type { SearchFilters } from "@/types/lab";

function parseCsv(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function useSearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: SearchFilters = useMemo(
    () => ({
      region: (searchParams.get("region") as Region | null) ?? null,
      fields: parseCsv(searchParams.get("fields")) as Field[],
      equipment: parseCsv(searchParams.get("equipment")),
      experimentText: searchParams.get("experiment") ?? "",
    }),
    [searchParams],
  );

  const update = useCallback(
    (next: Partial<SearchFilters>) => {
      const merged: SearchFilters = { ...filters, ...next };
      const params = new URLSearchParams();
      if (merged.region) params.set("region", merged.region);
      if (merged.fields.length) params.set("fields", merged.fields.join(","));
      if (merged.equipment.length) params.set("equipment", merged.equipment.join(","));
      if (merged.experimentText) params.set("experiment", merged.experimentText);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filters, router, pathname],
  );

  return { filters, update };
}

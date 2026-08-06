// 검색 페이지 — 지도가 전체 화면을 채우고, 위저드+검색+결과 목록은 그 위에 뜬 패널 하나로 합쳐진다
import { searchLabs } from "@/lib/queries/labs";
import { SearchResults } from "@/components/search";
import type { Field } from "@/lib/constants/fields";
import type { Region } from "@/lib/constants/regions";

interface SearchPageProps {
  searchParams: Promise<{
    region?: string;
    fields?: string;
    equipment?: string;
    experiment?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const region = (params.region as Region | undefined) ?? null;
  const fields = params.fields ? (params.fields.split(",") as Field[]) : [];
  const equipment = params.equipment ? params.equipment.split(",") : [];
  const experimentText = params.experiment ?? "";

  const labs = await searchLabs({ region, fields, equipment, experimentText });
  const hasFilters = Boolean(region) || fields.length > 0 || equipment.length > 0 || Boolean(experimentText);

  return <SearchResults labs={labs} hasFilters={hasFilters} />;
}

// 랜딩 페이지 — WordGlobeHeroSection(Originkit 템플릿, 실제 DB 통계) → ProblemCards → HowItWorks
import { HowItWorks, ProblemCards, WordGlobeHeroSection } from "@/components/landing";
import type { StatItem } from "@/components/charts";
import { getPlatformStats } from "@/lib/queries/stats";

// 정적 생성되지만 통계가 오래 고정되지 않도록 60초마다 재검증한다
export const revalidate = 60;

export default async function Home() {
  const stats = await getPlatformStats();
  const statItems: StatItem[] = [
    { label: "연계 연구실", value: stats.labCount, suffix: "곳" },
    { label: "수집 논문", value: stats.paperCount, suffix: "편" },
    { label: "평균 검토 소요일", value: stats.avgReviewDays, suffix: "일", decimals: 1 },
  ];

  return (
    <>
      <WordGlobeHeroSection stats={statItems} />
      <ProblemCards />
      <HowItWorks />
    </>
  );
}

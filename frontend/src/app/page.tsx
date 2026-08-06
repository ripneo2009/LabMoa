// 랜딩 페이지 — WordGlobeHeroSection(Originkit 템플릿, "연구실 찾기" link-preview가 히어로
// 우측 상단에 내장돼 있음) → ProblemCards
// "이렇게 진행돼요"(HowItWorks) 섹션은 피드백에 따라 페이지에서 뺐다.
import { ProblemCards, WordGlobeHeroSection } from "@/components/landing";

export default function Home() {
  return (
    <>
      <WordGlobeHeroSection />
      <ProblemCards />
    </>
  );
}

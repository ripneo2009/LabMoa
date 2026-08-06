"use client";

// 검색 결과 — 지도가 화면 전체(헤더 아래)를 채우고, 위저드+검색창+목록이 그 위에
// 하나의 떠 있는 패널로 겹쳐진다. 위저드를 별도 섹션으로 분리하지 않고 지도
// 오버레이 안에 접이식으로 넣어 "지도와 분리되지 않은 하나의 화면"을 만든다.
// hoveredLabId/selectedLabId를 이 컴포넌트가 부모로서 관리해 목록↔지도 마커를 동기화한다
// (§4.4 "hoveredLabId를 부모에서 관리"). query는 이미 매칭·정렬된 labs를 이름/기관/분야
// 태그 기준으로 즉시 한 번 더 필터링하는 클라이언트 사이드 텍스트 검색이다.
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, LoaderCircle, Search, Sparkles, SlidersHorizontal, X } from "lucide-react";

import { Button, Card, Input } from "@/components/ui";
import { DURATION, EASE } from "@/lib/constants/motion";
import type { LabSearchResult } from "@/types/lab";
import type { InstituteRecommendation, PaperRecommendation, RecommendedInstitute } from "@/types/recommendation";
import { AiRecommendationList } from "./AiRecommendationList";
import { AiPaperRecommendationList } from "./AiPaperRecommendationList";
import { LabResultList } from "./LabResultList";
import { LabMap } from "./LabMap";
import { SearchWizard } from "./SearchWizard";

export interface SearchResultsProps {
  labs: LabSearchResult[];
  /** 이미 지정된 검색 조건(지역/분야/장비/실험내용)이 있는지 — 없으면 위저드를 기본으로 펼쳐 보여준다 */
  hasFilters?: boolean;
}

function SearchResults({ labs, hasFilters = false }: SearchResultsProps) {
  const [hoveredLabId, setHoveredLabId] = React.useState<string | null>(null);
  const [selectedLabId, setSelectedLabId] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = React.useState(!hasFilters);
  const [aiRecommendation, setAiRecommendation] = React.useState<InstituteRecommendation | null>(null);
  const [paperRecommendation, setPaperRecommendation] = React.useState<PaperRecommendation | null>(null);
  const [isPaperSearching, setIsPaperSearching] = React.useState(false);
  const [selectedRecommendationId, setSelectedRecommendationId] = React.useState<string | null>(null);

  const recommendationCandidates = React.useMemo<RecommendedInstitute[]>(
    () => labs.map((lab) => ({
      id: lab.id,
      name: lab.name,
      description: lab.description,
      mapQuery: `${lab.name} ${lab.address}`,
      equipment: lab.equipment,
      address: lab.address,
      lat: lab.lat,
      lng: lab.lng,
    })),
    [labs],
  );

  const filteredLabs = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return labs;
    return labs.filter(
      (lab) =>
        lab.name.toLowerCase().includes(q) ||
        lab.org.toLowerCase().includes(q) ||
        lab.fieldTags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [labs, query]);

  const mapLabs = React.useMemo(
    () => aiRecommendation
      ? aiRecommendation.institutions.map((institute) => ({
          id: `institute-${institute.id}`,
          name: institute.name,
          mapQuery: institute.mapQuery,
          lat: institute.lat,
          lng: institute.lng,
        }))
      : filteredLabs,
    [aiRecommendation, filteredLabs],
  );

  async function searchWithAi(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isSearching) return;

    setIsSearching(true);
    setSearchError(null);
    setAiRecommendation(null);
    setPaperRecommendation(null);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery, candidates: recommendationCandidates }),
      });
      const data = (await response.json()) as Partial<InstituteRecommendation> & { error?: string };
      if (!response.ok || !data.text || !data.institutions?.length || !data.source) {
        throw new Error(data.error || "AI 추천을 불러오지 못했습니다.");
      }
      setAiRecommendation(data as InstituteRecommendation);
      setSelectedRecommendationId(data.institutions[0]?.id ?? null);
      setWizardOpen(false);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "AI 검색에 실패했습니다.");
    } finally {
      setIsSearching(false);
    }
  }

  async function searchPapers() {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isPaperSearching) return;

    setIsPaperSearching(true);
    setSearchError(null);
    setPaperRecommendation(null);
    setAiRecommendation(null);
    try {
      const response = await fetch("/api/recommend/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery }),
      });
      const data = (await response.json()) as Partial<PaperRecommendation> & { error?: string };
      if (!response.ok || !data.papers?.length || !data.source || !data.query) {
        throw new Error(data.error || "관련 논문을 불러오지 못했습니다.");
      }
      setPaperRecommendation(data as PaperRecommendation);
      setWizardOpen(false);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "논문 검색에 실패했습니다.");
    } finally {
      setIsPaperSearching(false);
    }
  }

  return (
    <div className="relative h-[calc(100svh-4rem)] w-full overflow-hidden">
      <LabMap
        labs={mapLabs}
        hoveredLabId={hoveredLabId}
        onSelectLab={(labId) => {
          setSelectedLabId(labId);
          if (labId.startsWith("institute-")) {
            setSelectedRecommendationId(labId.replace("institute-", ""));
          }
        }}
      />

      {/* Kakao HYBRID 지도가 내부적으로 z-index를 쓰는 SVG/컨트롤 레이어를 만들기 때문에
          기본 스태킹만으로는 이 패널이 뒤로 밀려 클릭이 지도로 새어나갈 수 있다.
          z-index를 명시해 항상 지도 위에 오도록 고정한다. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col gap-3 p-4 sm:max-w-sm sm:p-6">
        <form id="lab-ai-search" className="pointer-events-auto flex items-center gap-2" onSubmit={searchWithAi}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="연구실 이름·기관·분야로 검색"
            className="bg-card/95 backdrop-blur"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!query.trim() || isSearching}
            aria-label="AI로 검색"
            title="AI로 검색"
            className="shrink-0"
          >
            {isSearching ? <LoaderCircle className="animate-spin" /> : <Search />}
          </Button>
          {/* §3.3 "채움색 버튼은 화면당 1개" — 위저드 안의 "다음/검색 결과 보기"가 이미 solid이므로
              이 토글은 항상 outline으로 두고, 열림 상태는 테두리·아이콘 색으로만 구분한다. */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-pressed={wizardOpen}
            aria-label={
              wizardOpen ? "검색 조건 패널 닫기" : "검색 조건 설정 열기"
            }
            onClick={() => setWizardOpen((open) => !open)}
            className="shrink-0 bg-card/95 backdrop-blur aria-pressed:border-primary aria-pressed:text-primary"
          >
            {wizardOpen ? (
              <X className="size-4" />
            ) : (
              <SlidersHorizontal className="size-4" />
            )}
          </Button>
        </form>

        <div className="pointer-events-auto flex gap-2">
          <Button
            type="submit"
            form="lab-ai-search"
            size="sm"
            variant={paperRecommendation ? "outline" : "default"}
            disabled={!query.trim() || isSearching}
            className="flex-1"
          >
            <Search className="size-4" aria-hidden="true" /> 연구소 찾기
          </Button>
          <Button
            type="button"
            size="sm"
            variant={paperRecommendation ? "default" : "outline"}
            disabled={!query.trim() || isPaperSearching}
            onClick={searchPapers}
            className="flex-1 backdrop-blur"
          >
            {isPaperSearching ? <LoaderCircle className="size-4 animate-spin" /> : <BookOpen className="size-4" aria-hidden="true" />}
            논문·연구결과
          </Button>
        </div>

        {searchError && (
          <p role="alert" className="pointer-events-auto rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {searchError}
          </p>
        )}

        <AnimatePresence initial={false}>
          {wizardOpen && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.base, ease: EASE.out }}
              className="pointer-events-auto"
            >
              <SearchWizard
                candidates={recommendationCandidates}
                onRecommendationStart={() => setAiRecommendation(null)}
                onComplete={(recommendation) => {
                  setAiRecommendation(recommendation);
                  setSelectedRecommendationId(recommendation.institutions[0]?.id ?? null);
                  setWizardOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-auto min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-card/95 p-3 backdrop-blur">
          {paperRecommendation && (
            <AiPaperRecommendationList
              recommendation={paperRecommendation}
              onClose={() => setPaperRecommendation(null)}
            />
          )}
          {aiRecommendation && (
            <AiRecommendationList
              recommendation={aiRecommendation}
              selectedId={selectedRecommendationId}
              onSelect={setSelectedRecommendationId}
              onClose={() => setAiRecommendation(null)}
            />
          )}
          {aiRecommendation && (
            <Card className="hidden" aria-hidden="true">
              <div className="flex items-center gap-2 font-medium text-primary">
                <Sparkles className="size-4" aria-hidden="true" />
                {aiRecommendation.source === "gemini" ? "AI 추천" : "연구기관 추천"}
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {aiRecommendation.text}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="AI 추천 닫기"
                onClick={() => setAiRecommendation(null)}
                className="absolute right-2 top-2"
              >
                <X aria-hidden="true" />
              </Button>
            </Card>
          )}
          <LabResultList
            labs={filteredLabs}
            onHoverLab={setHoveredLabId}
            selectedLabId={selectedLabId}
          />
        </div>
      </div>
    </div>
  );
}

export { SearchResults };

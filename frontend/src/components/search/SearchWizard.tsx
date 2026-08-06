"use client";

// 검색 위저드 상태 컨테이너 — 3단계(지역/분야/실험내용)를 관리하고
// 값이 바뀔 때마다 URL 쿼리스트링에 반영해 결과 목록이 실시간으로 갱신되게 한다.
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Button, Card } from "@/components/ui";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { DURATION, EASE } from "@/lib/constants/motion";
import type { InstituteRecommendation, RecommendedInstitute } from "@/types/recommendation";
import { StepRegion } from "./StepRegion";
import { StepFields } from "./StepFields";
import { StepExperiment } from "./StepExperiment";
import { WizardProgress } from "./WizardProgress";

const TOTAL_STEPS = 3;

export interface SearchWizardProps {
  candidates?: RecommendedInstitute[];
  /** AI 추천이 시작될 때 이전 추천을 초기화하는 데 쓴다. */
  onRecommendationStart?: () => void;
  /** AI 추천이 완료되면 추천문을 전달한다. */
  onComplete?: (recommendation: InstituteRecommendation) => void;
}

interface RecommendResponse {
  text?: string;
  institutions?: RecommendedInstitute[];
  source?: "gemini" | "catalog";
  error?: string;
}

function SearchWizard({
  candidates = [],
  onRecommendationStart,
  onComplete,
}: SearchWizardProps = {}) {
  const { filters, update } = useSearchFilters();
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [isRecommending, setIsRecommending] = React.useState(false);
  const [recommendationError, setRecommendationError] = React.useState<string | null>(null);

  function goTo(nextStep: number) {
    setDirection(nextStep > step ? 1 : -1);
    setStep(Math.max(0, Math.min(TOTAL_STEPS - 1, nextStep)));
  }

  async function requestRecommendation() {
    setIsRecommending(true);
    setRecommendationError(null);
    onRecommendationStart?.();

    try {
      const query = [
        filters.region,
        filters.fields.join(", "),
        filters.equipment.join(", "),
        filters.experimentText,
      ].filter(Boolean).join(" / ");
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, candidates }),
      });
      const data = (await response.json()) as RecommendResponse;

      if (!response.ok || !data.text || !data.institutions?.length || !data.source) {
        throw new Error(data.error || "AI 추천을 불러오지 못했습니다.");
      }

      onComplete?.({
        text: data.text,
        institutions: data.institutions,
        source: data.source,
      });
    } catch (error) {
      setRecommendationError(
        error instanceof Error ? error.message : "AI 추천을 불러오지 못했습니다.",
      );
    } finally {
      setIsRecommending(false);
    }
  }

  return (
    <Card className="max-h-[calc(100svh-9rem)] overflow-hidden">
      <div className="flex max-h-[calc(100svh-9rem)] flex-col gap-4 p-5">
        <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        <div className="relative min-h-0 overflow-y-auto pr-1">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ x: direction * 32, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 32, opacity: 0 }}
              transition={{ duration: DURATION.base, ease: EASE.out }}
            >
              {step === 0 && (
                <StepRegion
                  value={filters.region}
                  onChange={(region) => update({ region })}
                />
              )}
              {step === 1 && (
                <StepFields
                  value={filters.fields}
                  onChange={(fields) => update({ fields })}
                />
              )}
              {step === 2 && (
                <StepExperiment
                  text={filters.experimentText}
                  onTextChange={(experimentText) => update({ experimentText })}
                  equipment={filters.equipment}
                  onEquipmentChange={(equipment) => update({ equipment })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-end justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
          >
            이전
          </Button>
          {step < TOTAL_STEPS - 1 ? (
            <Button type="button" onClick={() => goTo(step + 1)}>
              다음
            </Button>
          ) : (
            <Button
              type="button"
              onClick={requestRecommendation}
              disabled={isRecommending}
            >
              {isRecommending ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles aria-hidden="true" />
              )}
              {isRecommending ? "AI가 추천 중..." : "AI 추천 받기"}
            </Button>
          )}
        </div>
        {recommendationError && (
          <p role="alert" className="text-sm text-destructive">
            {recommendationError}
          </p>
        )}
      </div>
    </Card>
  );
}

export { SearchWizard };

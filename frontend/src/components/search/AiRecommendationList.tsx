"use client";

import Link from "next/link";
import { CalendarCheck, ChevronDown, FlaskConical, Sparkles, X } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { InstituteRecommendation } from "@/types/recommendation";

interface AiRecommendationListProps {
  recommendation: InstituteRecommendation;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onClose: () => void;
}

function AiRecommendationList({
  recommendation,
  selectedId,
  onSelect,
  onClose,
}: AiRecommendationListProps) {
  return (
    <section className="mb-4 flex flex-col gap-2" aria-live="polite">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" aria-hidden="true" />
          AI 추천 연구소
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="AI 추천 닫기" onClick={onClose}>
          <X aria-hidden="true" />
        </Button>
      </div>

      {recommendation.institutions.map((institute) => {
        const selected = selectedId === institute.id;
        return (
          <Card key={institute.id} className="gap-0 overflow-hidden border-primary/25 bg-primary/5">
            <button
              type="button"
              onClick={() => onSelect(selected ? null : institute.id)}
              className="flex w-full items-center justify-between gap-3 p-3 text-left"
              aria-expanded={selected}
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{institute.name}</span>
                {institute.address && (
                  <span className="block truncate text-xs text-muted-foreground">{institute.address}</span>
                )}
              </span>
              <ChevronDown
                className={`size-4 shrink-0 transition-transform ${selected ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {selected && (
              <div className="border-t border-primary/15 p-3">
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{institute.description}</p>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
                  <FlaskConical className="size-4 text-primary" aria-hidden="true" />
                  구비 실험 장비
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {institute.equipment?.length ? (
                    institute.equipment.map((item) => (
                      <Badge key={item} variant="secondary">{item}</Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">등록된 장비 정보가 없습니다.</span>
                  )}
                </div>
                <Button asChild className="mt-4 w-full">
                  <Link href={`/labs/${institute.id}/reserve`}>
                    <CalendarCheck aria-hidden="true" />
                    예약 신청
                  </Link>
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </section>
  );
}

export { AiRecommendationList };

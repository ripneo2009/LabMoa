"use client";

import { BookOpen, ExternalLink, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui";
import type { PaperRecommendation } from "@/types/recommendation";

interface Props {
  recommendation: PaperRecommendation;
  onClose: () => void;
}

function AiPaperRecommendationList({ recommendation, onClose }: Props) {
  return (
    <section className="space-y-3" aria-label="논문 및 연구결과 추천">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 font-semibold text-primary">
            <BookOpen className="size-4" aria-hidden="true" />
            논문·연구결과 추천
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            OpenAlex 실제 논문 · {recommendation.source === "gemini" ? "AI 초록 요약" : "초록 발췌"}
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="논문 추천 닫기">
          <X aria-hidden="true" />
        </Button>
      </div>

      {recommendation.papers.map((paper, index) => (
        <article key={paper.id} className="space-y-2 rounded-lg border border-border bg-background/70 p-3">
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-primary">{index + 1}</span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold leading-snug">{paper.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {paper.authors.length ? paper.authors.join(", ") : "저자 정보 없음"}
              </p>
              <p className="text-xs text-muted-foreground">{paper.journal} · {paper.publishedAt}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {paper.tags.map((tag) => <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{tag}</span>)}
          </div>
          <div className="rounded-md bg-muted/60 p-2.5">
            <div className="mb-1 flex items-center gap-1 text-xs font-medium text-primary">
              <Sparkles className="size-3" aria-hidden="true" /> 연구 요약
            </div>
            <p className="text-xs leading-relaxed">{paper.summary}</p>
          </div>
          <a href={paper.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            논문 원문 정보 보기 <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </article>
      ))}
    </section>
  );
}

export { AiPaperRecommendationList };

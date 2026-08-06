"use client"

// 검색 결과 카드 — 랩 요약 정보 + 매칭 게이지 + 상세보기 (View Transitions API로 상세 페이지와 공유 요소 전환)
import * as React from "react";

import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { MatchGauge } from "@/components/charts";
import { useViewTransition } from "@/hooks/useViewTransition";
import { cn } from "@/lib/utils";
import type { LabSearchResult } from "@/types/lab";

export interface LabResultCardProps {
  lab: LabSearchResult;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  /** 지도 마커 클릭으로 이 카드가 선택됐는지 — 강조 테두리 + 스크롤 인입에 쓴다 */
  selected?: boolean;
}

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

function LabResultCard({ lab, onHoverStart, onHoverEnd, selected = false }: LabResultCardProps) {
  const { navigate } = useViewTransition();
  const href = `/labs/${lab.id}`;
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selected) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selected]);

  return (
    <Card
      ref={cardRef}
      clickable
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={cn(selected && "border-primary")}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {/* 상세 페이지 헤더의 <h1>과 같은 view-transition-name을 공유한다 (§4.4) */}
            <CardTitle style={{ viewTransitionName: `lab-title-${lab.id}` } as React.CSSProperties}>
              {lab.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {lab.org} · {lab.region}
            </p>
          </div>
          <Badge variant="outline">{lab.safetyLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {lab.fieldTags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>시간당 {formatCurrency(lab.hourlyRate)}</span>
          <span>최근 논문 {lab.recentPaperCount}편</span>
          {lab.mentorDegree && <span>멘토 {lab.mentorDegree}</span>}
        </div>
        <MatchGauge score={lab.matchScore} reasons={lab.matchReasons} />
      </CardContent>
      <CardFooter className="justify-end bg-transparent p-0 px-4 pb-4">
        <Button type="button" variant="outline" size="sm" onClick={() => navigate(href)}>
          상세보기
        </Button>
      </CardFooter>
    </Card>
  );
}

export { LabResultCard };

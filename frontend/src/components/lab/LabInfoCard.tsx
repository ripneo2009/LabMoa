// 랩 상세 히어로에 뜨는 정보 카드 — 이름, 소속, 주소, 안전등급 배지, 시간당 대여비
import { Badge } from "@/components/ui";
import type { Lab } from "@/types/lab";

export interface LabInfoCardProps {
  lab: Lab;
}

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

function LabInfoCard({ lab }: LabInfoCardProps) {
  return (
    <div className="pointer-events-auto flex max-w-sm flex-col gap-3 rounded-xl border border-border bg-card/95 p-5 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {/* 검색 카드와 공유하는 View Transition 대상 요소 (§4.4) */}
          <h1
            className="text-2xl font-semibold text-foreground"
            style={{ viewTransitionName: `lab-title-${lab.id}` } as React.CSSProperties}
          >
            {lab.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lab.org} · {lab.address}
          </p>
        </div>
        <Badge variant="outline">{lab.safetyLevel}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        시간당 대여비 <span className="font-medium text-foreground">{formatCurrency(lab.hourlyRate)}</span>
      </p>
    </div>
  );
}

export { LabInfoCard };

// 통계 카운터 그룹 — 0부터 1200ms 카운트업, 200ms stagger. 뷰포트 진입 시 1회만 실행(Reveal).
import { Counter, Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

export interface StatCounterProps {
  stats: StatItem[];
  /** 어두운 배경(예: 히어로 3D 장면) 위에 놓일 때는 "light"로 밝은 글자색을 쓴다 */
  tone?: "dark" | "light";
}

const STAGGER_DELAY = 0.2;

function StatCounter({ stats, tone = "dark" }: StatCounterProps) {
  return (
    <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={i * STAGGER_DELAY}>
          <div className="flex flex-col items-center gap-1 text-center">
            <dd
              className={cn(
                "text-3xl font-semibold",
                tone === "light" ? "text-white" : "text-foreground",
              )}
            >
              <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
            </dd>
            <dt className={cn("text-sm", tone === "light" ? "text-white/70" : "text-muted-foreground")}>
              {stat.label}
            </dt>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}

export { StatCounter };

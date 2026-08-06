"use client"

// 대여비/재료비 스택 바 — 좌→우 scaleX 확장(600ms), 총액은 Counter로 카운트업.
// (Phase 8 차트 스펙 중 하나지만, 예약 비용 요약(Phase 7)이 곧바로 필요로 해 앞당겨 구현했다.)
import { motion } from "motion/react"

import { Counter } from "@/components/motion"
import { cn } from "@/lib/utils"

export interface CostBreakdownBarProps {
  rental: number
  material: number
  total: number
  className?: string
}

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`
}

function CostBreakdownBar({ rental, material, total, className }: CostBreakdownBarProps) {
  const rentalRatio = total > 0 ? rental / total : 0.5
  const materialRatio = total > 0 ? material / total : 0.5

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full origin-left bg-primary"
          style={{ width: `${rentalRatio * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className="h-full origin-left bg-brand"
          style={{ width: `${materialRatio * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-primary" aria-hidden />
          대여비 {formatCurrency(rental)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-brand" aria-hidden />
          재료비 {formatCurrency(material)}
        </span>
      </div>
      <p className="text-lg font-semibold text-foreground">
        총액 ₩<Counter value={total} />
      </p>
      {/* 표 형태 대체 텍스트 */}
      <table className="sr-only">
        <caption>예약 비용 내역</caption>
        <tbody>
          <tr>
            <th scope="row">대여비</th>
            <td>{rental}</td>
          </tr>
          <tr>
            <th scope="row">재료비</th>
            <td>{material}</td>
          </tr>
          <tr>
            <th scope="row">총액</th>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export { CostBreakdownBar }

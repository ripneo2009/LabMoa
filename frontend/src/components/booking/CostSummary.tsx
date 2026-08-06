"use client"

// 예약 비용 요약 — CostBreakdownBar + 항목별 재료비 펼쳐보기
import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { CostBreakdownBar } from "@/components/charts"
import { calcTotal } from "@/lib/domain/cost"
import { DURATION, EASE } from "@/lib/constants/motion"
import type { MaterialItem } from "@/types/proposal"

export interface CostSummaryProps {
  hours: number
  hourlyRate: number
  materials: MaterialItem[]
}

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`
}

function CostSummary({ hours, hourlyRate, materials }: CostSummaryProps) {
  const [open, setOpen] = React.useState(false)
  const { rental, material, total, breakdown } = calcTotal(hours, hourlyRate, materials)

  return (
    <motion.div layout className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <CostBreakdownBar rental={rental} material={material} total={total} />

      {breakdown.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="self-start text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            항목별 재료비 {open ? "숨기기 ▲" : "펼쳐보기 ▼"}
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: DURATION.base, ease: EASE.out }}
                className="flex flex-col gap-1 text-xs text-muted-foreground"
              >
                {breakdown.map((item) => (
                  <li key={item.name} className="flex justify-between">
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}

export { CostSummary }

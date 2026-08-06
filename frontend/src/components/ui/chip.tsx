"use client"

// 선택형 태그 칩 — 검색 위저드의 지역/분야/장비 다중 선택 등에 사용 (shadcn 프리미티브 아님)
import type { HTMLMotionProps } from "motion/react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { SPRING } from "@/lib/constants/motion"

export interface ChipProps extends Omit<HTMLMotionProps<"button">, "onClick"> {
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
}

function Chip({
  selected = false,
  onSelectedChange,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <motion.button
      type="button"
      data-slot="chip"
      data-selected={selected}
      aria-pressed={selected}
      onClick={() => onSelectedChange?.(!selected)}
      // 선택 시 scale 0.94 → 1 spring (§3 Chip 규칙)
      animate={{ scale: selected ? [0.94, 1] : 1 }}
      transition={{ type: "spring", stiffness: SPRING.stiffness, damping: SPRING.damping }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-sm font-medium outline-none transition-colors duration-(--dur-instant) focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-foreground hover:border-primary/40",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export { Chip }

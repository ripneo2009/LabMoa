"use client"

// 검색 위저드 진행바 — scaleX로 채워지고, 단계 숫자는 crossfade된다
import { AnimatePresence, motion } from "motion/react"

import { DURATION, EASE } from "@/lib/constants/motion"

const STEP_LABELS = ["지역", "분야", "실험 내용"] as const

export interface WizardProgressProps {
  currentStep: number
  totalSteps: number
}

function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
            className="font-medium text-foreground"
          >
            {currentStep + 1} / {totalSteps} · {STEP_LABELS[currentStep]}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full origin-left rounded-full bg-primary"
          animate={{ scaleX: (currentStep + 1) / totalSteps }}
          initial={false}
          transition={{ duration: DURATION.base, ease: EASE.out }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  )
}

export { WizardProgress }

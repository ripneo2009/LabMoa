"use client"

// 연구실 상세 탭 셸 — 탭 선택 상태만 관리하고, 각 탭의 실제 내용은 부모(서버 컴포넌트)가
// 미리 렌더링해 넘겨준다. 밑줄은 layoutId="tab-underline"으로 부드럽게 이동한다.
import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { SPRING } from "@/lib/constants/motion"

const TABS = ["연구 분야", "최근 논문", "보유 장비"] as const
type LabTab = (typeof TABS)[number]

export interface LabTabsProps {
  fieldsContent: React.ReactNode
  papersContent: React.ReactNode
  equipmentContent: React.ReactNode
}

function LabTabs({ fieldsContent, papersContent, equipmentContent }: LabTabsProps) {
  const [active, setActive] = React.useState<LabTab>("연구 분야")

  const contentByTab: Record<LabTab, React.ReactNode> = {
    "연구 분야": fieldsContent,
    "최근 논문": papersContent,
    "보유 장비": equipmentContent,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 border-b border-border" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors duration-(--dur-fast) ease-(--ease-out)",
              active === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
            {active === tab && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: SPRING.stiffness, damping: SPRING.damping }}
              />
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel">{contentByTab[active]}</div>
    </div>
  )
}

export { LabTabs }

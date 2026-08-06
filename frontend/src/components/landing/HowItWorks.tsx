"use client"

// 4스텝 다이어그램 — 선이 각 스텝에 도달하면 카드가 활성화된다(scale 1.02 + border).
// 카드 활성화는 한 번 켜지면 위로 스크롤해도 꺼지지 않는다(§4.4).
import * as React from "react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"

import { cn } from "@/lib/utils"
import { ScrollPathLine } from "./ScrollPathLine"

const STEPS = [
  { title: "연구실 찾기", description: "지역·분야를 입력하면 매칭도 높은 연구실을 보여줘요." },
  { title: "계획서 작성", description: "실험 아이디어를 항목별로 정리해서 제출해요." },
  { title: "멘토 검토", description: "항목별 코멘트를 받으며 안전하게 다듬어요." },
  { title: "예약 후 실험", description: "일정과 비용을 확인하고 실험을 진행해요." },
]

function HowItWorks() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.75", "end 0.4"] })
  const [active, setActive] = React.useState<boolean[]>(() => STEPS.map(() => false))

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive((prev) => prev.map((was, i) => was || progress >= (i + 1) / STEPS.length))
  })

  return (
    <section ref={containerRef} className="container-app flex flex-col gap-16 py-24">
      <h2 className="text-center text-2xl font-semibold text-foreground">이렇게 진행돼요</h2>
      <div className="relative mx-auto flex max-w-md flex-col gap-12">
        <ScrollPathLine progress={scrollYProgress} />
        {STEPS.map((step, i) => (
          <div key={step.title} className="relative flex gap-4 pl-10">
            <span
              className="absolute left-4 top-1 size-3 -translate-x-1/2 rounded-full bg-primary"
              aria-hidden
            />
            <motion.div
              animate={{ scale: active[i] ? 1.02 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "flex-1 rounded-xl border p-4 transition-colors duration-300",
                active[i] ? "border-primary" : "border-border",
              )}
            >
              <p className="text-xs font-medium text-primary">STEP {i + 1}</p>
              <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { HowItWorks }

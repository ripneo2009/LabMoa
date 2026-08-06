"use client"

// 전역 클릭 이펙트 — Originkit clickeffects(cursor 카테고리)를 그대로 가져와 사이트
// 어디를 클릭하든 반응하게 한다. document 레벨 클릭 리스너를 쓰므로 뷰포트를 꽉 채우는
// position:fixed 래퍼 안에 두면 좌표 계산이 스크롤 위치와 무관하게 항상 맞는다.
// 래퍼 자체는 pointer-events:none이라 실제 버튼·링크 클릭을 가로채지 않는다.
// prefers-reduced-motion에서는 아예 렌더하지 않는다(§4.3).
import * as React from "react"

import MouseEffects from "@/components/originkit/ui/clickeffects"

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mql.matches)
    const update = () => setReduced(mql.matches)
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return reduced
}

function GlobalClickEffects() {
  const reducedMotion = useReducedMotion()
  if (reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      <MouseEffects color="#0B5FFF" interactionMode="sniper" showLabel={false} />
    </div>
  )
}

export { GlobalClickEffects }

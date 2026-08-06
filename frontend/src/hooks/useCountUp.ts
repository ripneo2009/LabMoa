"use client"

// 0(또는 직전 값)에서 목표값까지 easeOutExpo로 카운트업하는 훅 (Counter 컴포넌트가 사용).
// prefersReducedMotion이 true면 애니메이션 없이 즉시 목표값을 반환한다.
import { useEffect, useRef, useState } from "react";
import { DURATION, easeOutExpo } from "@/lib/constants/motion";

export function useCountUp(value: number, inView: boolean, prefersReducedMotion: boolean): number {
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion) {
      setDisplay(value);
      displayRef.current = value;
      return;
    }

    let frame: number;
    const durationMs = DURATION.count * 1000;
    const start = performance.now();
    const from = displayRef.current;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const next = from + (value - from) * easeOutExpo(progress);
      setDisplay(next);
      displayRef.current = next;
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, value, prefersReducedMotion]);

  return display;
}

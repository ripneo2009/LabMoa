"use client"

// motion의 useInView + prefers-reduced-motion 여부를 함께 제공하는 래퍼.
// 여러 차트가 각자 matchMedia를 중복 구현하던 것을 여기로 모았다.
import { useInView as useMotionInView } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

export interface UseInViewResult {
  inView: boolean;
  prefersReducedMotion: boolean;
}

export function useInView(ref: RefObject<Element | null>, options?: { once?: boolean }): UseInViewResult {
  const inView = useMotionInView(ref, options);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return { inView, prefersReducedMotion };
}

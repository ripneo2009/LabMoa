"use client"

// 뷰포트 폭에 따라 stagger 간격을 고르는 훅 — 데스크톱 60ms / 모바일(<768px) 40ms (§4.1)
import { useEffect, useState } from "react";
import { STAGGER } from "@/lib/constants/motion";

export function useResponsiveStagger(): number {
  const [stagger, setStagger] = useState<number>(STAGGER.desktop);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setStagger(mql.matches ? STAGGER.mobile : STAGGER.desktop);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return stagger;
}

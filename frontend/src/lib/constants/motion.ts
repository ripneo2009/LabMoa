// §4.2 모션 토큰의 JS(motion 라이브러리)용 단일 소스.
// globals.css의 CSS 변수(ms 단위)와 값은 동일하되, motion 라이브러리는 초 단위를 사용하므로 변환해 둔다.
export const DURATION = {
  instant: 0.12,
  fast: 0.18,
  base: 0.26,
  slow: 0.4,
  page: 0.5,
  count: 1.2,
} as const;

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const STAGGER = {
  desktop: 0.06,
  mobile: 0.04,
} as const;

export const SPRING = {
  stiffness: 260,
  damping: 26,
} as const;

/** 뷰포트 폭에 따라 stagger 간격을 고른다 (모바일 40ms, 그 외 60ms). */
export function getStagger(viewportWidth: number): number {
  return viewportWidth < 768 ? STAGGER.mobile : STAGGER.desktop;
}

/** Counter 카운트업 전용 easeOutExpo. t=0→1 구간에서 급감속하는 곡선. */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

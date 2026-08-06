"use client"

// View Transitions API로 감싼 라우터 네비게이션. 미지원 브라우저에서는 즉시 전환된다.
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function useViewTransition() {
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      if (typeof document === "undefined" || !("startViewTransition" in document)) {
        router.push(href);
        return;
      }

      const transition = document.startViewTransition(() => {
        return new Promise<void>((resolve) => {
          router.push(href);
          // Next.js RSC 네비게이션 완료를 감지하는 공식 API가 없어, 다음 두 프레임 뒤
          // DOM이 갱신되었다고 가정하고 진행한다. 원격 DB(예: Neon) 지연이나 dev 모드의
          // 최초 라우트 컴파일 지연으로 실제 갱신이 이보다 늦어지면 브라우저가 전환 자체를
          // "타임아웃"으로 중단시킬 수 있는데, 이때도 router.push는 이미 실행된 뒤라 페이지
          // 이동 자체는 정상이다 — 크로스페이드 연출만 스킵되므로 조용히 무시한다.
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      });
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
      transition.updateCallbackDone.catch(() => {});
    },
    [router],
  );

  return { navigate };
}

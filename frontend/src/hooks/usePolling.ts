"use client"

// 일정 주기로 fetcher를 재호출하는 범용 폴링 훅 — 채팅 메시지 갱신(3초)에 사용한다
import { useCallback, useEffect, useRef, useState } from "react";

export interface UsePollingResult<T> {
  data: T | null;
  error: string | null;
  refetch: () => void;
}

export function usePolling<T>(
  fetcher: () => Promise<T>,
  intervalMs: number,
  deps: React.DependencyList = [],
): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "새 데이터를 불러오지 못했습니다.");
      }
    }

    tickRef.current = tick;
    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, ...deps]);

  const refetch = useCallback(() => {
    tickRef.current();
  }, []);

  return { data, error, refetch };
}

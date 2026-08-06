// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

// Editorial word-globe hero (원본: https://github.com/moleeforx-del/word-globe-hero).
// 지구본 자리에는 Originkit의 globe(3D 회전 지구본, three.js) — 텍스트 파티클(pixeldrift →
// dust-text-reveal) 여러 차례 실험 끝에 "글자 말고 지구본으로" 요청을 받아 다시 실제
// 지구본으로 되돌렸다. dots 방식으로 대륙을 그리고, 대전 좌표에 마커를 찍어 "대전"이라는
// 실제 장소감을 지구본 자체로 드러낸다 — 드래그로 회전, 호버 시 자동회전 정지(stopOnHover)
// 가 기본 내장돼 있어 별도 인터랙션 래퍼 없이도 충분히 화려하다.
// 원본은 자체 상단 네비게이션(header)이 있었지만, 이미 로그인 상태를 아는 전역
// Header(layout.tsx)가 모든 페이지에 떠 있어 중복이라 걷어냈다 — 그 자리(74px)는
// wave-pattern 배경 여백으로 그대로 남는다.
// 배경에는 대전 도심 항공사진을 흐리게 깔아 "대전"이라는 실제 장소감을 한 번 더 준다 —
// 그 위에 §3.2 팔레트 톤(밝은 배경)의 스크림을 얹어 지구본·헤드라인의 명도 대비를 지킨다.
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import Globe from "@/components/originkit/ui/globe";
import { FadeUp } from "@/components/motion";
import { DURATION } from "@/lib/constants/motion";
import type { StatItem } from "@/components/charts";

// public/ 정적 파일은 import가 아니라 URL 문자열로 참조한다 (webpack 모듈 그래프 밖).
const HERO_PHOTO_SRC = "/hero/daejeon-aerial.png";

// Globe의 dots/markerConfig는 객체 리터럴이라 매 렌더마다 새 참조가 생기면 내부
// useEffect(WebGL 씬 생성)가 불필요하게 다시 돌아 통째로 재마운트된다 — 검색 지도(LabMap)
// GLOBE_DOTS 상수와 같은 이유로 모듈 스코프 상수로 고정한다.
const GLOBE_DOTS = { color: "#0B5FFF", size: 6, density: 7, allDots: false };
// 대전 좌표 — LabMap.tsx의 DAEJEON_CENTER와 동일한 값.
const GLOBE_MARKERS = {
  markers: [{ lat: 36.3504, lng: 127.3845 }],
  color: "#FFFFFF",
  size: 60,
};

export interface WordGlobeHeroProps {
  stats: StatItem[];
}

/** prefers-reduced-motion 여부 — globe의 자동회전(speed)을 0으로 눌러 정지시키는 데 쓴다.
 * 드래그 회전은 사용자가 직접 조작하는 인터랙션이라 reduced-motion과 무관하게 그대로 둔다. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const update = () => setReduced(mql.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function WordGlobeHero({ stats }: WordGlobeHeroProps) {
  const [labStat, paperStat] = stats;
  const reducedMotion = useReducedMotion();

  return (
    <div className="h09-hero-shell">
      <div className="h09-photo-bg" aria-hidden="true">
        <Image
          src={HERO_PHOTO_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="h09-photo-bg-img"
        />
      </div>
      <div className="h09-photo-scrim" aria-hidden="true" />
      <div className="h09-content-rails" aria-hidden="true" />
      <div className="h09-wave-pattern" aria-hidden="true" />

      <div className="h09-globe-stage">
        <Globe
          fill="dots"
          dots={GLOBE_DOTS}
          oceanColor="#1B3A6B"
          outlineColor="#0B5FFF"
          showOutline
          outlineWidth={1}
          graticuleColor="rgba(255, 255, 255, 0.18)"
          showGrid
          markerConfig={GLOBE_MARKERS}
          initialLatitude={30}
          initialLongitude={127}
          speed={reducedMotion ? 0 : 2}
          direction="left"
          smoothing={8}
          dragSpeed={5}
          stopOnHover
          scale={8}
          detail={6}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <section className="h09-hero-content">
        <FadeUp className="h09-headline-block" delay={0}>
          <div className="h09-headline-copy">
            <h1>
              고등학생의 연구를,
              <br />
              현실로 만듭니다
            </h1>
          </div>
          <div className="h09-actions" id="get-started">
            <Link className="h09-button h09-button-dark" href="/search">
              연구실 찾기
            </Link>
            <Link className="h09-button h09-button-light" href="/signup">
              회원가입
            </Link>
          </div>
        </FadeUp>

        <FadeUp className="h09-details-block" delay={DURATION.base}>
          <p>
            대전의 실제 연구실과 연구자가 고등학생의 연구 아이디어를 검증하고
            실현시켜주는 플랫폼입니다.
          </p>
          <div className="h09-stats">
            <div>
              <strong>
                {labStat?.value ?? 0}
                {labStat?.suffix ?? ""}
              </strong>
              <span>{labStat?.label ?? "연계 연구실"}</span>
            </div>
            <div>
              <strong>
                {paperStat?.value ?? 0}
                {paperStat?.suffix ?? ""}
              </strong>
              <span>{paperStat?.label ?? "수집 논문"}</span>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

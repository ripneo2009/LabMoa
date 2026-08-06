// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

// Editorial word-globe hero (원본: https://github.com/moleeforx-del/word-globe-hero).
// 지구본 자리는 여러 차례 바뀌었다: 회전 텍스트 구체 → 파티클 타이포그래피(pixeldrift →
// dust-text-reveal) → 3D 지구본(globe, three.js) → 지금은 Originkit textmorph(구이 블러+스케일
// 모핑)로 "LabMoa"와 "IN DAEJEON"이 서로 녹아들며 전환된다.
// textmorph는 vendor 구현상 CSS `animation: ... infinite`로 무한 반복되는데, 이는 §4.3
// "무한 루프 전면 금지"를 정면으로 어긴다. 컴포넌트 자체에 "N번만 돌고 멈춤" 옵션이 없어서,
// 한 바퀴(LabMoa→IN DAEJEON→LabMoa)를 돈 뒤 정확히 LabMoa가 다시 완전히 보이는
// 순간에 정적 텍스트로 갈아끼우는 방식으로 규정을 지켰다 — 애니메이션 자체는 vendor 그대로,
// 반복 횟수만 유한하게 자른 것이라 "그대로 적용" 취지를 최대한 해치지 않는다.
// 헤드라인·설명문·통계·CTA 버튼은 전부 뺐다(피드백에 따라 "이 글씨는 모두 지워줘") — 페이지의
// 유일한 h1은 이제 TextMorph/정착 텍스트가 맡는다(tag="h1"), 그래야 랜딩 페이지에 제목이
// 하나도 없는 접근성 회귀가 생기지 않는다. 정착된 "LabMoa" 텍스트를 클릭하면 replayToken이
// 바뀌면서 TextMorph가 key로 강제 재마운트되어 모핑을 처음부터 다시 재생한다(정지 상태로 계속
// 있는 텍스트가 아니라는 걸 알리려 pointer 커서를 준다). reduced-motion에서는 애초에 애니메이션이
// 없으므로 클릭 핸들러 자체를 안 붙인다.
// 원본은 자체 상단 네비게이션(header)이 있었지만, 이미 로그인 상태를 아는 전역
// Header(layout.tsx)가 모든 페이지에 떠 있어 중복이라 걷어냈다 — 그 자리(74px)는
// wave-pattern 배경 여백으로 그대로 남는다.
// 배경에는 대전 도심 항공사진을 흐리게 깔아 "대전"이라는 실제 장소감을 준다 — 그 위에
// §3.2 팔레트 톤(밝은 배경)의 스크림을 얹어 텍스트의 명도 대비를 지킨다.
// "연구실 찾기"는 헤더의 상시 노출 solid 버튼 하나로 통일했다 — 한때 이 히어로 우측
// 상단에 Originkit link-preview(호버 시 /search 스크린샷 미리보기)로도 띄워봤지만
// 헤더 버튼과 중복이라 뺐다.
import * as React from "react";
import Image from "next/image";
import localFont from "next/font/local";

import TextMorph from "@/components/originkit/ui/textmorph";

// public/ 정적 파일은 import가 아니라 URL 문자열로 참조한다 (webpack 모듈 그래프 밖).
const HERO_PHOTO_SRC = "/hero/daejeon-aerial.png";

// CDN(@import) 대신 로컬 폰트 파일을 next/font/local로 셀프호스팅 — 외부 네트워크 의존
// 없이, preload·자동 font-display: swap까지 딸려온다. TextMorph는 캔버스가 아니라 실제
// DOM에 순수 문자열 font-family를 꽂는 방식이라 여기서 만든 고유 클래스명을 그대로 넘긴다.
const pretendardBold = localFont({
  src: "../../../../fonts/Pretendard-Bold.woff2",
  weight: "700",
  display: "swap",
});

const MORPH_WORDS = "LabMoa\nIN DAEJEON";
// §3.2 --color-text 톤 — 파란색이 아닌 검정 계열로.
const MORPH_COLOR = "#111827";
// morph(전환 소요시간) + hold(한 단어가 완전히 보이는 유지시간).
const MORPH_DURATION = 1;
const MORPH_HOLD = 1.2;
const MORPH_WORD_COUNT = 2;
const MORPH_SLOT = MORPH_DURATION + MORPH_HOLD;
const MORPH_CYCLE = MORPH_SLOT * MORPH_WORD_COUNT;
// LabMoa → IN DAEJEON → LabMoa, 정확히 한 바퀴 돈 뒤 LabMoa가 완전히 보이는
// 시점(morph 완료 + hold 완료)에 정적 텍스트로 전환해 무한 루프를 끊는다.
const MORPH_SETTLE_MS = (MORPH_CYCLE + MORPH_DURATION + MORPH_HOLD) * 1000;

/** prefers-reduced-motion 여부 — 이 경우 모핑 애니메이션을 아예 건너뛰고 처음부터
 * 정적 "LabMoa"를 보여준다. */
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

export function WordGlobeHero() {
  const reducedMotion = useReducedMotion();
  const [morphSettled, setMorphSettled] = React.useState(false);
  // replayToken을 바꾸면 아래 effect가 다시 돌면서 정착 상태를 풀고 새 타이머를 건다.
  // TextMorph에도 이 값을 key로 줘서 강제 재마운트시켜야 내부 CSS 애니메이션(useId 기반
  // keyframe 이름 포함)이 처음부터 다시 재생된다.
  const [replayToken, setReplayToken] = React.useState(0);

  React.useEffect(() => {
    if (reducedMotion) {
      setMorphSettled(true);
      return;
    }
    setMorphSettled(false);
    const timer = setTimeout(() => setMorphSettled(true), MORPH_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion, replayToken]);

  const handleReplay = reducedMotion
    ? undefined
    : () => setReplayToken((token) => token + 1);

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

      <div className="h09-globe-stage h09-morph-stage">
        {morphSettled ? (
          <h1
            className={`h09-morph-settled ${pretendardBold.className}`}
            onClick={handleReplay}
            role={handleReplay ? "button" : undefined}
            tabIndex={handleReplay ? 0 : undefined}
            onKeyDown={
              handleReplay
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleReplay();
                    }
                  }
                : undefined
            }
            aria-label={handleReplay ? "LabMoa — 클릭하면 애니메이션 다시 재생" : undefined}
            style={{ cursor: handleReplay ? "pointer" : "default" }}
          >
            LabMoa
          </h1>
        ) : (
          <TextMorph
            key={replayToken}
            words={MORPH_WORDS}
            color={MORPH_COLOR}
            font={{ fontFamily: pretendardBold.style.fontFamily, fontWeight: 700 }}
            transition={{
              type: "tween",
              duration: MORPH_DURATION,
              delay: MORPH_HOLD,
              ease: "easeInOut",
            }}
            tag="h1"
          />
        )}
      </div>
    </div>
  );
}

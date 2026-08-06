// 랩 상세 히어로 — 검색 페이지와 같은 "큰 시각요소(지도) + 그 위에 뜬 카드" 구조.
// 이 랩의 위치를 지도로 보여주고, 이름·소속·안전등급·대여비 정보 카드를 지도 위에 겹쳐 띄운다.
import { LabMap } from "@/components/search";
import { LabInfoCard } from "./LabInfoCard";
import type { Lab } from "@/types/lab";

export interface LabLocationHeroProps {
  lab: Lab;
}

function LabLocationHero({ lab }: LabLocationHeroProps) {
  return (
    <div className="relative h-[45vh] min-h-80 w-full overflow-hidden border-b border-border">
      <LabMap labs={[lab]} hoveredLabId={null} />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end p-4 sm:p-6">
        <LabInfoCard lab={lab} />
      </div>
    </div>
  );
}

export { LabLocationHero };

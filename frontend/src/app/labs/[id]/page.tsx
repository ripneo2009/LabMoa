// 연구실 상세 페이지 — 지도 히어로(§ 검색 페이지와 동일한 "큰 시각요소 + 떠있는 카드" 구조)
// + 3탭(연구 분야/최근 논문/보유 장비) + 우측 멘토 사이드바
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui";
import { EquipmentGrid, LabLocationHero, LabTabs, MentorSidebar, PaperList } from "@/components/lab";
import { getLabById } from "@/lib/queries/labs";
import { getPapersByLabId } from "@/lib/queries/papers";

interface LabDetailPageProps {
  params: Promise<{ id: string }>;
}

// 연구실 정보는 자주 바뀌지 않으므로 60초 ISR로 캐싱해 매 요청마다 원격 DB를 타지 않게 한다
export const revalidate = 60;

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const { id } = await params;
  // 서로 의존관계가 없는 두 조회를 병렬로 실행해 원격 DB 왕복 지연을 절반으로 줄인다
  const [lab, { papers, lastUpdatedAt }] = await Promise.all([
    getLabById(id),
    getPapersByLabId(id),
  ]);
  if (!lab) notFound();

  return (
    <>
      <LabLocationHero lab={lab} />
      <div className="container-app flex flex-col gap-8 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <LabTabs
            fieldsContent={
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {lab.fieldTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{lab.description}</p>
                <p className="text-sm text-muted-foreground">{lab.materialPolicy}</p>
              </div>
            }
            papersContent={
              <PaperList
                labId={lab.id}
                papers={papers}
                lastUpdatedAt={lastUpdatedAt}
                canSync={Boolean(lab.openalexInstitutionId)}
              />
            }
            equipmentContent={<EquipmentGrid equipment={lab.equipment} />}
          />
          <MentorSidebar labId={lab.id} mentors={lab.mentors} />
        </div>
      </div>
    </>
  );
}

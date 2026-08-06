// 연구실 등록 신청 — 발표 "추후 계획" 슬라이드용 목업. 제출 동작 없음.
import { Badge, Input, Textarea } from "@/components/ui";

export default function LabRegisterPage() {
  return (
    <div className="container-app flex max-w-2xl flex-col gap-6 py-10">
      <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/5 px-4 py-3">
        <Badge variant="warning">준비 중인 기능</Badge>
        <p className="text-sm text-muted-foreground">
          연구실 직접 등록은 아직 개발 중이에요. 지금은 화면 구성만 미리 볼 수 있어요.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">연구실 등록 신청</h1>
        <p className="text-sm text-muted-foreground">교수·연구책임자가 직접 연구실을 등록할 수 있어요.</p>
      </div>

      <fieldset disabled className="flex flex-col gap-6 opacity-70">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">연구실 정보</label>
          <Input placeholder="연구실명" />
          <Input placeholder="소속 기관" />
          <Input placeholder="주소" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">세부 전공</label>
          <Input placeholder="예: 촉매화학, 분자세포생물학" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">대표 논문 DOI</label>
          <Textarea placeholder="한 줄에 하나씩 DOI를 입력해 주세요" rows={3} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">개방 가능 시간대</label>
          <Input placeholder="예: 평일 09:00 ~ 18:00" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">수용 인원</label>
          <Input type="number" placeholder="동시에 지도 가능한 학생 수" />
        </div>
      </fieldset>
    </div>
  );
}

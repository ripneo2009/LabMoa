// 계획서의 한 항목(섹션) — 읽기 전용 표시와 편집 폼 양쪽에서 재사용한다.
// fieldKey가 있으면 검토 코멘트가 인라인으로 앵커링될 수 있는 항목이다.
import type { ReviewTargetField } from "@/types/proposal";

export interface ProposalSectionProps {
  title: string;
  fieldKey?: ReviewTargetField;
  children: React.ReactNode;
}

function ProposalSection({ title, fieldKey, children }: ProposalSectionProps) {
  return (
    <section
      id={fieldKey ? `proposal-section-${fieldKey}` : undefined}
      className="flex flex-col gap-2"
    >
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

export { ProposalSection };

// 검색 결과 리스트 — 처음 8개만 stagger 애니메이션, 나머지는 즉시 렌더(성능)
import { StaggerItem, StaggerList } from "@/components/motion";
import type { LabSearchResult } from "@/types/lab";
import { EmptyResult } from "./EmptyResult";
import { LabResultCard } from "./LabResultCard";

const ANIMATED_COUNT = 8;

export interface LabResultListProps {
  labs: LabSearchResult[];
  onHoverLab?: (labId: string | null) => void;
  selectedLabId?: string | null;
}

function LabResultList({ labs, onHoverLab, selectedLabId = null }: LabResultListProps) {
  if (labs.length === 0) {
    return <EmptyResult />;
  }

  const animated = labs.slice(0, ANIMATED_COUNT);
  const rest = labs.slice(ANIMATED_COUNT);

  return (
    <div className="flex flex-col gap-4">
      <StaggerList className="flex flex-col gap-4">
        {animated.map((lab) => (
          <StaggerItem key={lab.id}>
            <LabResultCard
              lab={lab}
              onHoverStart={() => onHoverLab?.(lab.id)}
              onHoverEnd={() => onHoverLab?.(null)}
              selected={lab.id === selectedLabId}
            />
          </StaggerItem>
        ))}
      </StaggerList>
      {rest.map((lab) => (
        <LabResultCard
          key={lab.id}
          lab={lab}
          onHoverStart={() => onHoverLab?.(lab.id)}
          onHoverEnd={() => onHoverLab?.(null)}
          selected={lab.id === selectedLabId}
        />
      ))}
    </div>
  );
}

export { LabResultList };

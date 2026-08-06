// 위저드 1단계 — 대전 5개 구 중 하나를 선택한다
import { Chip } from "@/components/ui";
import { REGIONS, type Region } from "@/lib/constants/regions";

export interface StepRegionProps {
  value: Region | null;
  onChange: (region: Region | null) => void;
}

function StepRegion({ value, onChange }: StepRegionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">어느 구에서 찾으시나요?</p>
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((region) => (
          <Chip
            key={region}
            selected={value === region}
            onSelectedChange={(selected) => onChange(selected ? region : null)}
          >
            {region}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export { StepRegion };

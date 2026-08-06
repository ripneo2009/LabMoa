// 위저드 3단계 — 실험 내용 설명 + 필요한 장비 태그 다중 선택
import { Chip, Textarea } from "@/components/ui";
import { EQUIPMENT } from "@/lib/constants/equipment";

export interface StepExperimentProps {
  text: string;
  onTextChange: (text: string) => void;
  equipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

function StepExperiment({
  text,
  onTextChange,
  equipment,
  onEquipmentChange,
}: StepExperimentProps) {
  function toggle(item: string, selected: boolean) {
    onEquipmentChange(
      selected ? [...equipment, item] : equipment.filter((e) => e !== item),
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <label htmlFor="experiment-text" className="text-sm font-medium text-foreground">
          어떤 실험을 하고 싶으신가요?
        </label>
        <Textarea
          id="experiment-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="예: 온도에 따른 촉매 반응 수율 변화를 측정해보고 싶어요."
          rows={4}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">필요한 장비가 있다면 선택해 주세요</p>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((item) => (
            <Chip
              key={item}
              selected={equipment.includes(item)}
              onSelectedChange={(selected) => toggle(item, selected)}
            >
              {item}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

export { StepExperiment };

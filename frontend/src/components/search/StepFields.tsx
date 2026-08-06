// 위저드 2단계 — 관심 분야 태그를 다중 선택한다
import { Chip } from "@/components/ui";
import { FIELDS, type Field } from "@/lib/constants/fields";

export interface StepFieldsProps {
  value: Field[];
  onChange: (fields: Field[]) => void;
}

function StepFields({ value, onChange }: StepFieldsProps) {
  function toggle(field: Field, selected: boolean) {
    onChange(selected ? [...value, field] : value.filter((f) => f !== field));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">
        관심 있는 분야를 모두 선택해 주세요
      </p>
      <div className="flex flex-wrap gap-2">
        {FIELDS.map((field) => (
          <Chip
            key={field}
            selected={value.includes(field)}
            onSelectedChange={(selected) => toggle(field, selected)}
          >
            {field}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export { StepFields };

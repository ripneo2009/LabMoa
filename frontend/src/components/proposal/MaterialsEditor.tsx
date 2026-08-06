// 필요 재료 목록 편집기 — 이름/단가/수량 행을 추가·삭제한다
import { Button, Input } from "@/components/ui";
import type { MaterialItem } from "@/types/proposal";

export interface MaterialsEditorProps {
  items: MaterialItem[];
  onChange: (items: MaterialItem[]) => void;
}

function MaterialsEditor({ items, onChange }: MaterialsEditorProps) {
  function update(index: number, patch: Partial<MaterialItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item.name}
            onChange={(e) => update(i, { name: e.target.value })}
            placeholder="재료명"
            className="flex-1"
          />
          <Input
            type="number"
            value={item.unitPrice}
            onChange={(e) => update(i, { unitPrice: Number(e.target.value) })}
            placeholder="단가"
            className="w-24"
          />
          <Input
            type="number"
            value={item.qty}
            onChange={(e) => update(i, { qty: Number(e.target.value) })}
            placeholder="수량"
            className="w-20"
          />
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            삭제
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => onChange([...items, { name: "", unitPrice: 0, qty: 1 }])}
      >
        + 재료 추가
      </Button>
    </div>
  );
}

export { MaterialsEditor };

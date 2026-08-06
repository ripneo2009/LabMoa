// 보유 장비 탭 콘텐츠 — 장비 태그를 그리드로 나열
export interface EquipmentGridProps {
  equipment: string[];
}

function EquipmentGrid({ equipment }: EquipmentGridProps) {
  if (equipment.length === 0) {
    return <p className="text-sm text-muted-foreground">등록된 장비 정보가 없어요.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {equipment.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-border px-3 py-2.5 text-sm text-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export { EquipmentGrid };

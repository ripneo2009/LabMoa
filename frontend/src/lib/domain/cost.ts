// 예약 비용(대여비/재료비) 계산 (§7). React/Prisma/Next.js에 의존하지 않는 순수 함수만 둔다.
import type { MaterialItem } from "@/types/proposal";

export interface MaterialBreakdownItem extends MaterialItem {
  subtotal: number;
}

export interface CostSummary {
  rental: number;
  material: number;
  total: number;
  breakdown: MaterialBreakdownItem[];
}

/** 사용 시간과 시간당 대여료로 대여비를 계산한다. */
export function calcRentalFee(hours: number, hourlyRate: number): number {
  return Math.round(hours * hourlyRate);
}

/** 재료 목록(단가 × 수량)의 합계를 계산한다. */
export function calcMaterialFee(items: MaterialItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

/**
 * 대여비 + 재료비 총액과 항목별 내역을 계산한다.
 * @param hours 사용 시간
 * @param hourlyRate 시간당 대여료
 * @param items 필요 재료 목록
 * @returns 대여비/재료비/총액과 항목별 소계 내역
 */
export function calcTotal(
  hours: number,
  hourlyRate: number,
  items: MaterialItem[],
): CostSummary {
  const rental = calcRentalFee(hours, hourlyRate);
  const breakdown: MaterialBreakdownItem[] = items.map((item) => ({
    ...item,
    subtotal: item.unitPrice * item.qty,
  }));
  const material = breakdown.reduce((sum, item) => sum + item.subtotal, 0);

  return { rental, material, total: rental + material, breakdown };
}

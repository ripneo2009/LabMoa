// Tailwind 클래스 병합 헬퍼 (shadcn/ui 컴포넌트 전반에서 사용)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

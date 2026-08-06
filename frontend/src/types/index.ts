// 공용 타입 배럴 — User/Role 등 도메인 전반에서 쓰이는 타입 + lab/proposal/booking 재노출
export type Role = "student" | "mentor" | "admin";

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  org: string | null;
  phone: string | null;
}

export * from "./lab";
export * from "./proposal";
export * from "./booking";

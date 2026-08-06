// 비밀번호 해시/검증 — bcryptjs 래퍼. 이 파일 밖에서는 평문 비밀번호를 다루지 않는다.
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/** 평문 비밀번호를 bcrypt 해시로 변환한다. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** 평문 비밀번호가 저장된 해시와 일치하는지 검증한다. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

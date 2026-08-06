// 로그인 세션 — userId를 담은 서명된 JWT를 httpOnly 쿠키로 저장한다. 별도 세션 테이블 없이
// jose로 서명/검증만 하는 가벼운 방식이며, AUTH_SECRET이 유출되지 않는 한 위조할 수 없다.
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "eumlab-session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30일

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET 환경변수가 설정되지 않았습니다.");
  return new TextEncoder().encode(secret);
}

/** 로그인 성공 시 세션 쿠키를 발급한다. */
export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** 현재 요청의 세션 쿠키에서 userId를 읽는다. 없거나 위조/만료됐으면 null. */
export async function readSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.userId === "string" ? payload.userId : null;
  } catch {
    return null;
  }
}

/** 로그아웃 — 세션 쿠키를 지운다. */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

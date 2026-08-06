"use server";

import { redirect } from "next/navigation";

import { createSession, clearSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { verifyGoogleIdToken } from "@/lib/firebase/auth";
import { createMentorAccount } from "@/lib/repositories/accounts.repository";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleUid,
  linkGoogleIdentity,
} from "@/lib/repositories/users.repository";
import type { MentorDegree } from "@/types/lab";

export interface SignUpStudentInput { name: string; email: string; password: string }
export interface SignUpMentorInput {
  name: string; email: string; password: string; labId: string;
  degree: MentorDegree; field: string; bio: string;
}
export interface LogInInput { email: string; password: string }

const MIN_PASSWORD_LENGTH = 8;

function validateSignupInput(name: string, email: string, password: string): string | null {
  if (!name.trim()) return "이름을 입력해주세요.";
  if (!email.trim() || !email.includes("@")) return "올바른 이메일을 입력해주세요.";
  if (password.length < MIN_PASSWORD_LENGTH) return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`;
  return null;
}

export async function signUpStudent(input: SignUpStudentInput): Promise<{ error: string } | undefined> {
  const validationError = validateSignupInput(input.name, input.email, input.password);
  if (validationError) return { error: validationError };
  if (await findUserByEmail(input.email)) return { error: "이미 가입된 이메일입니다." };
  const user = await createUser({
    role: "student",
    name: input.name.trim(),
    email: input.email,
    passwordHash: await hashPassword(input.password),
    googleUid: null,
    org: null,
    phone: null,
  });
  await createSession(user.id);
  redirect("/search");
}

export async function signUpMentor(input: SignUpMentorInput): Promise<{ error: string } | undefined> {
  const validationError = validateSignupInput(input.name, input.email, input.password);
  if (validationError) return { error: validationError };
  if (!input.labId) return { error: "소속 연구실을 선택해주세요." };
  if (!input.bio.trim()) return { error: "소개를 입력해주세요." };
  if (await findUserByEmail(input.email)) return { error: "이미 가입된 이메일입니다." };
  const { user } = await createMentorAccount(
    {
      role: "mentor", name: input.name.trim(), email: input.email,
      passwordHash: await hashPassword(input.password), org: null, phone: null,
      googleUid: null,
    },
    {
      labId: input.labId, degree: input.degree, field: input.field.trim(),
      bio: input.bio.trim(), researchKeywords: [], responseRate: 100,
    },
  );
  await createSession(user.id);
  redirect("/mentor");
}

export async function logIn(input: LogInInput): Promise<{ error: string } | undefined> {
  const user = await findUserByEmail(input.email);
  if (!user?.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }
  await createSession(user.id);
  redirect(user.role === "mentor" ? "/mentor" : "/search");
}

export type GoogleLoginResult = { error: string } | { redirectTo: "/search" | "/mentor" };

export async function logInWithGoogle(idToken: string): Promise<GoogleLoginResult> {
  if (!idToken || idToken.length > 20_000) return { error: "Google 인증 정보가 올바르지 않습니다." };
  try {
    const identity = await verifyGoogleIdToken(idToken);
    let user = await findUserByGoogleUid(identity.uid);
    if (!user) {
      user = await findUserByEmail(identity.email);
      if (user) {
        await linkGoogleIdentity(user.id, identity.uid);
      } else {
        user = await createUser({
          role: "student",
          name: identity.name,
          email: identity.email,
          passwordHash: null,
          googleUid: identity.uid,
          org: null,
          phone: null,
        });
      }
    }
    await createSession(user.id);
    return { redirectTo: user.role === "mentor" ? "/mentor" : "/search" };
  } catch {
    return { error: "Google 로그인에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }
}

export async function logOut(): Promise<void> {
  await clearSession();
  redirect("/");
}

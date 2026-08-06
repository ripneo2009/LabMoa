import { findMentorByUserId } from "@/lib/repositories/mentors.repository";
import { findUserById } from "@/lib/repositories/users.repository";
import type { Role } from "@/types";
import { readSessionUserId } from "./session";

export interface CurrentUser {
  id: string;
  role: Role;
  name: string;
  email: string;
  mentorId: string | null;
  labId: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = await readSessionUserId();
  if (!userId) return null;
  const user = await findUserById(userId);
  if (!user) return null;
  const mentor = user.role === "mentor" ? await findMentorByUserId(user.id) : null;
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    mentorId: mentor?.id ?? null,
    labId: mentor?.labId ?? null,
  };
}


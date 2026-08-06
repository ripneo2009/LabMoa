"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { calcTotal } from "@/lib/domain/cost";
import { createBookingUnlessOverlapping } from "@/lib/repositories/bookings.repository";
import { findLabById } from "@/lib/repositories/labs.repository";
import { findProposalById } from "@/lib/repositories/proposals.repository";

export interface CreateBookingInput {
  proposalId: string;
  date: string;
  startTime: string;
  endTime: string;
}

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function hoursBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

export async function createBooking(input: CreateBookingInput): Promise<string> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new Error("예약 날짜 형식이 올바르지 않습니다.");
  if (!TIME_PATTERN.test(input.startTime) || !TIME_PATTERN.test(input.endTime)) {
    throw new Error("예약 시간 형식이 올바르지 않습니다.");
  }
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const proposal = await findProposalById(input.proposalId);
  if (!proposal || proposal.studentId !== user.id) throw new Error("본인 계획서만 예약할 수 있습니다.");
  if (proposal.status !== "approved") throw new Error("승인된 계획서만 예약할 수 있습니다.");
  const lab = await findLabById(proposal.labId);
  if (!lab) throw new Error("연구실을 찾을 수 없습니다.");
  const hours = hoursBetween(input.startTime, input.endTime);
  if (hours <= 0) throw new Error("종료 시간은 시작 시간보다 늦어야 합니다.");
  const day = new Date(`${input.date}T00:00:00.000Z`);
  if (Number.isNaN(day.getTime())) throw new Error("예약 날짜가 올바르지 않습니다.");
  const { rental, material, total } = calcTotal(hours, lab.hourlyRate, proposal.neededMaterials);
  const booking = await createBookingUnlessOverlapping({
    proposalId: proposal.id,
    labId: proposal.labId,
    studentId: proposal.studentId,
    date: day,
    startTime: input.startTime,
    endTime: input.endTime,
    rentalFee: rental,
    materialFee: material,
    totalFee: total,
    status: "confirmed",
  });
  if (!booking) throw new Error("이미 예약된 시간대입니다.");
  revalidatePath(`/proposals/${proposal.id}/booking`);
  return booking.id;
}

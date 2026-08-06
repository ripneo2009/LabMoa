import {
  findBookingsByLabId,
  findBookingsByStudentId,
  findLatestBookingByProposalId,
} from "@/lib/repositories/bookings.repository";
import { findLabById } from "@/lib/repositories/labs.repository";
import { findProposalById } from "@/lib/repositories/proposals.repository";
import type { Booking, BookingWithContext } from "@/types/booking";
import type { BookingRecord } from "@/lib/repositories/models";

function toBooking(row: BookingRecord): Booking {
  return {
    id: row.id,
    proposalId: row.proposalId,
    date: row.date.toDate().toISOString(),
    startTime: row.startTime,
    endTime: row.endTime,
    rentalFee: row.rentalFee,
    materialFee: row.materialFee,
    totalFee: row.totalFee,
    status: row.status,
  };
}

export async function getBookingByProposalId(proposalId: string): Promise<Booking | null> {
  const row = await findLatestBookingByProposalId(proposalId);
  return row ? toBooking(row) : null;
}

export async function getBookedSlotsForLab(labId: string): Promise<Booking[]> {
  return (await findBookingsByLabId(labId)).map(toBooking);
}

export async function getBookingsByStudentId(studentId: string): Promise<BookingWithContext[]> {
  const rows = await findBookingsByStudentId(studentId);
  return Promise.all(
    rows.map(async (row) => {
      const [proposal, lab] = await Promise.all([
        findProposalById(row.proposalId),
        findLabById(row.labId),
      ]);
      return {
        ...toBooking(row),
        labName: lab?.name ?? "알 수 없는 연구실",
        proposalTitle: proposal?.title || "(제목 없음)",
      };
    }),
  );
}


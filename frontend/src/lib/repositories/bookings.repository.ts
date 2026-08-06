import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import { recordFromSnapshot } from "./firestore-helpers";
import type { BookingRecord } from "./models";

const bookings = firestore.collection("bookings");

export async function findLatestBookingByProposalId(proposalId: string): Promise<BookingRecord | null> {
  const snapshot = await bookings
    .where("proposalId", "==", proposalId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();
  return snapshot.empty ? null : recordFromSnapshot<BookingRecord>(snapshot.docs[0], "bookings");
}

export async function findBookingsByLabId(labId: string): Promise<BookingRecord[]> {
  const snapshot = await bookings.where("labId", "==", labId).orderBy("date", "asc").get();
  return snapshot.docs.map((doc) => recordFromSnapshot<BookingRecord>(doc, "bookings"));
}

export async function findBookingsByLabAndDate(labId: string, date: Date): Promise<BookingRecord[]> {
  const timestamp = Timestamp.fromDate(date);
  const snapshot = await bookings
    .where("labId", "==", labId)
    .where("date", "==", timestamp)
    .get();
  return snapshot.docs.map((doc) => recordFromSnapshot<BookingRecord>(doc, "bookings"));
}

export async function findBookingsByStudentId(studentId: string): Promise<BookingRecord[]> {
  const snapshot = await bookings
    .where("studentId", "==", studentId)
    .orderBy("date", "desc")
    .get();
  return snapshot.docs.map((doc) => recordFromSnapshot<BookingRecord>(doc, "bookings"));
}

export async function createBookingUnlessOverlapping(
  input: Omit<BookingRecord, "id" | "date" | "createdAt" | "updatedAt"> & { date: Date },
): Promise<BookingRecord | null> {
  const reference = bookings.doc();
  const bookingDate = Timestamp.fromDate(input.date);
  const dateQuery = bookings
    .where("labId", "==", input.labId)
    .where("date", "==", bookingDate);
  const created = await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(dateQuery);
    const overlaps = snapshot.docs
      .map((doc) => recordFromSnapshot<BookingRecord>(doc, "bookings"))
      .some((booking) => booking.startTime < input.endTime && input.startTime < booking.endTime);
    if (overlaps) return false;
    const now = FieldValue.serverTimestamp();
    transaction.create(reference, { ...input, date: bookingDate, createdAt: now, updatedAt: now });
    return true;
  });
  return created ? recordFromSnapshot<BookingRecord>(await reference.get(), "bookings") : null;
}

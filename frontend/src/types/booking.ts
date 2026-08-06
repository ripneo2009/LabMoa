// 예약/비용 도메인 타입
export type BookingStatus = "pending" | "confirmed" | "done";

export interface Booking {
  id: string;
  proposalId: string;
  date: string;
  startTime: string;
  endTime: string;
  rentalFee: number;
  materialFee: number;
  totalFee: number;
  status: BookingStatus;
}

/** "내 예약 내역" 목록에 쓰는, 연구실·계획서 정보를 곁들인 예약. */
export interface BookingWithContext extends Booking {
  labName: string;
  proposalTitle: string;
}

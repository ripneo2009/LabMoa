import { LabReservationFlow } from "@/components/booking/LabReservationFlow";
import { getLabById } from "@/lib/queries/labs";

interface ReservePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function ReservePage({ params, searchParams }: ReservePageProps) {
  const { id } = await params;
  const { name } = await searchParams;
  const lab = await getLabById(id).catch(() => null);
  const labName = name?.trim() || lab?.name || "선택한 연구소";
  const contacts = lab?.mentors.map((mentor) => ({
    id: mentor.id,
    name: mentor.name,
    subtitle: `${mentor.degree} · ${mentor.field}`,
  })) ?? [];

  return (
    <main className="container-app max-w-5xl py-10">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">예약 신청</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">{labName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          안전교육 확인 후 날짜, 시간, 실험 내용을 입력하고 연구소 담당자와 상담할 수 있습니다.
        </p>
      </div>
      <LabReservationFlow labId={id} labName={labName} contacts={contacts} />
    </main>
  );
}

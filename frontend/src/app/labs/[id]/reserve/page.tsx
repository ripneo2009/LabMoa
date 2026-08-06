import { notFound } from "next/navigation";

import { SafetyTrainingGate } from "@/components/booking/SafetyTrainingGate";
import { getLabById } from "@/lib/queries/labs";

interface ReservePageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservePage({ params }: ReservePageProps) {
  const { id } = await params;
  const lab = await getLabById(id);
  if (!lab) notFound();

  return (
    <main className="container-app max-w-3xl py-10">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">예약 신청</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">{lab.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          안전교육을 이수한 뒤 연구계획서 작성 및 예약 절차를 진행할 수 있습니다.
        </p>
      </div>
      <SafetyTrainingGate labId={lab.id} labName={lab.name} />
    </main>
  );
}

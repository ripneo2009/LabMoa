// 전역 푸터 — 저작권 및 서비스 태그라인
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-app flex flex-col gap-1 py-8 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">LabMoa</p>
        <p>대전 지역사회 문제 해결 해커톤 출품작 — 고등학생과 연구실을 잇습니다.</p>
        <Link href="/labs/register" className="w-fit hover:text-foreground hover:underline">
          연구실 등록 신청 (준비 중)
        </Link>
        <p>&copy; {new Date().getFullYear()} LabMoa.</p>
      </div>
    </footer>
  );
}

export { Footer };

// 회원가입 페이지 — 멘토 가입 시 소속 연구실을 고를 수 있도록 목록을 미리 조회한다
import Link from "next/link";

import { SignupForm } from "@/components/auth";
import { getAllLabOptions } from "@/lib/queries/labs";

export default async function SignupPage() {
  const labOptions = await getAllLabOptions();

  return (
    <div className="container-app flex max-w-sm flex-col gap-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-foreground">회원가입</h1>
        <p className="text-sm text-muted-foreground">학생 또는 멘토로 LabBridge에 가입하세요.</p>
      </div>
      <SignupForm labOptions={labOptions} />
      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-primary underline-offset-2 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}

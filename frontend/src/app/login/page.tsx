// 로그인 페이지
import Link from "next/link";

import { LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <div className="container-app flex max-w-sm flex-col gap-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-foreground">로그인</h1>
        <p className="text-sm text-muted-foreground">LabBridge 계정으로 로그인하세요.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-primary underline-offset-2 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}

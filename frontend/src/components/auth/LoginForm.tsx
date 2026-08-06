"use client";

// 로그인 폼 — 실패 시 서버 액션이 { error }를 반환하고, 성공 시 액션 내부 redirect()로 이동한다.
import * as React from "react";

import { Button, Input } from "@/components/ui";
import { logIn } from "@/lib/actions/auth.actions";
import { AuthDivider, GoogleLoginButton } from "./GoogleLoginButton";

function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await logIn({ email, password });
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <GoogleLoginButton />
      <AuthDivider />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-foreground">
          이메일
        </label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-sm font-medium text-foreground">
          비밀번호
        </label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}

export { LoginForm };

"use client";

import * as React from "react";
import { FirebaseError } from "firebase/app";
import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import { logInWithGoogle } from "@/lib/actions/auth.actions";
import { getGoogleAuthClient } from "@/lib/firebase/client";
import { getErrorMessage } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.37l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.12-1.32.31-1.92V7.46H3.04A10 10 0 0 0 2 12c0 1.63.39 3.17 1.04 4.54l3.35-2.62Z" />
      <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.46l3.35 2.62C7.18 7.71 9.39 5.95 12 5.95Z" />
    </svg>
  );
}

function googleErrorMessage(error: unknown): string | null {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") return null;
    if (error.code === "auth/popup-blocked") return "팝업이 차단되었습니다. 브라우저에서 팝업을 허용해주세요.";
    if (error.code === "auth/unauthorized-domain") return "현재 도메인이 Firebase 승인 도메인에 등록되지 않았습니다.";
    if (error.code === "auth/operation-not-allowed") return "Firebase Console에서 Google 로그인을 활성화해주세요.";
    if (error.code === "auth/network-request-failed") return "네트워크 연결을 확인한 뒤 다시 시도해주세요.";
  }
  return getErrorMessage(error, "Google 로그인에 실패했습니다.");
}

function GoogleLoginButton() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleGoogleLogin() {
    setPending(true);
    setError(null);
    let auth: ReturnType<typeof getGoogleAuthClient>["auth"] | null = null;
    try {
      const client = getGoogleAuthClient();
      auth = client.auth;
      const credential = await signInWithPopup(client.auth, client.provider);
      const result = await logInWithGoogle(await credential.user.getIdToken());
      if ("error" in result) throw new Error(result.error);
      await signOut(client.auth);
      router.replace(result.redirectTo);
      router.refresh();
    } catch (caught) {
      if (auth) await signOut(auth).catch(() => undefined);
      setError(googleErrorMessage(caught));
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={pending}
        onClick={handleGoogleLogin}
        className="w-full gap-2.5 bg-background"
      >
        <GoogleIcon />
        {pending ? "Google 계정 확인 중…" : "Google로 계속하기"}
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function AuthDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">또는</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export { AuthDivider, GoogleLoginButton };


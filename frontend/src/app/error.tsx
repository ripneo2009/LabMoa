"use client";

import { useEffect } from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-16">
      <Card className="w-full">
        <CardHeader><CardTitle>데이터를 불러오지 못했습니다</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">잠시 후 다시 시도해주세요. 문제가 계속되면 Firebase 설정을 확인해주세요.</p>
          <Button onClick={reset}>다시 시도</Button>
        </CardContent>
      </Card>
    </main>
  );
}


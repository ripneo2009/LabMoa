"use client";

// 회원가입 폼 — 학생/멘토 탭으로 나뉘고, 멘토는 소속 연구실·학위·분야·소개를 추가로 받아
// User+Mentor를 함께 만든다. 실패 시 서버 액션이 { error }를 반환한다.
import * as React from "react";

import { Button, Input, Tabs, TabsList, TabsTrigger, Textarea } from "@/components/ui";
import { signUpMentor, signUpStudent } from "@/lib/actions/auth.actions";
import type { LabOption } from "@/lib/queries/labs";
import type { MentorDegree } from "@/types/lab";
import { AuthDivider, GoogleLoginButton } from "./GoogleLoginButton";

export interface SignupFormProps {
  labOptions: LabOption[];
}

const DEGREES: MentorDegree[] = ["석사", "박사", "박사후"];

function SignupForm({ labOptions }: SignupFormProps) {
  const [role, setRole] = React.useState<"student" | "mentor">("student");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [labId, setLabId] = React.useState(labOptions[0]?.id ?? "");
  const [degree, setDegree] = React.useState<MentorDegree>("석사");
  const [field, setField] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result =
      role === "student"
        ? await signUpStudent({ name, email, password })
        : await signUpMentor({ name, email, password, labId, degree, field, bio });

    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Tabs value={role} onValueChange={(value) => setRole(value as "student" | "mentor")}>
        <TabsList className="w-full">
          <TabsTrigger value="student">학생으로 가입</TabsTrigger>
          <TabsTrigger value="mentor">멘토로 가입</TabsTrigger>
        </TabsList>
      </Tabs>

      {role === "student" && (
        <>
          <GoogleLoginButton />
          <p className="-mt-2 text-center text-xs text-muted-foreground">
            Google 신규 계정은 학생 회원으로 가입됩니다.
          </p>
          <AuthDivider />
        </>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-name" className="text-sm font-medium text-foreground">
          이름
        </label>
        <Input id="signup-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          이메일
        </label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          비밀번호 (8자 이상)
        </label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {role === "mentor" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-lab" className="text-sm font-medium text-foreground">
              소속 연구실
            </label>
            <select
              id="signup-lab"
              required
              value={labId}
              onChange={(e) => setLabId(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {labOptions.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name} · {lab.org}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-degree" className="text-sm font-medium text-foreground">
              학위
            </label>
            <select
              id="signup-degree"
              required
              value={degree}
              onChange={(e) => setDegree(e.target.value as MentorDegree)}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {DEGREES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-field" className="text-sm font-medium text-foreground">
              연구 분야
            </label>
            <Input
              id="signup-field"
              placeholder="예: 촉매화학"
              required
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-bio" className="text-sm font-medium text-foreground">
              소개
            </label>
            <Textarea
              id="signup-bio"
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="고등학생에게 어떤 도움을 줄 수 있는지 간단히 소개해주세요."
            />
          </div>
        </>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "가입 중..." : "가입하기"}
      </Button>
    </form>
  );
}

export { SignupForm };

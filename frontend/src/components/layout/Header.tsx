"use client"

// 전역 헤더 — 흰 배경 + 하단 border로 고정 노출한다(랜딩 히어로가 Originkit 템플릿의 밝은
// 배경으로 바뀌면서, 예전의 "스크롤 전 투명/흰 글씨" 트릭은 더 이상 필요 없다).
// 왼쪽 끝에 대전광역시 마크 + 구분선을 둬 "대전시-LabMoa" 공공 협력 로크업으로 보이게
// 하고, 로고 텍스트도 두껍게 키워 빈 헤더가 아래 히어로와 분리돼 보이는 느낌을 줄였다.
// container-app(1120px 중앙 정렬) 대신 자체 padding을 써서 화면 진짜 왼쪽 끝에 붙인다 —
// 랜딩 히어로/검색 지도처럼 아래 컨텐츠가 풀블리드로 화면 끝까지 채우는 페이지와 헤더의
// 좌측 시작선이 어긋나 "분리된 느낌"이 든다는 피드백에 따른 것.
// 로그인 상태(user)는 layout.tsx가 서버에서 getCurrentUser()로 조회해 prop으로 내려준다.
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui"
import { logOut } from "@/lib/actions/auth.actions"
import type { CurrentUser } from "@/lib/auth/current-user"

export interface HeaderProps {
  user: CurrentUser | null
}

function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/daejeon-mark.jpg"
            alt="대전광역시"
            width={112}
            height={30}
            priority
            className="h-7 w-auto object-contain"
          />
          <span className="h-6 border-l border-border" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight text-brand">LabMoa</span>
        </Link>
        <nav className="flex items-center gap-2">
          {/* §3.3 "채움색 버튼은 화면당 1개" — 헤더에서는 이 버튼만 solid로 두고
              나머지는 ghost/outline. "잘 보이도록" 피드백에 따라 항상 맨 앞에 둔다. */}
          <Button asChild variant="default" size="sm">
            <Link href="/search">연구실 찾기</Link>
          </Button>
          {user && (
            <>
              {user.role === "mentor" ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/mentor">멘토 대시보드</Link>
                </Button>
              ) : (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/my/bookings">내 예약</Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <form action={logOut}>
                <Button type="submit" variant="ghost" size="sm">
                  로그아웃
                </Button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export { Header }

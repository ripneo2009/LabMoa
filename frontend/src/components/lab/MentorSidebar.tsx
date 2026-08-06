// 우측 sticky 사이드바 — 멘토 프로필 + 연구계획서 제출 CTA
import Link from "next/link";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { Mentor } from "@/types/lab";

export interface MentorSidebarProps {
  labId: string;
  mentors: Mentor[];
}

function MentorSidebar({ labId, mentors }: MentorSidebarProps) {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:h-fit">
      {mentors.map((mentor) => (
        <Card key={mentor.id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <CardTitle>{mentor.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{mentor.field}</p>
              </div>
              <Badge variant="outline">{mentor.degree}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm leading-6 text-muted-foreground">{mentor.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.researchKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">응답률 {mentor.responseRate}%</p>
          </CardContent>
        </Card>
      ))}

      <Button asChild>
        <Link href={`/proposals/new?labId=${labId}`}>연구계획서 제출하기</Link>
      </Button>
    </aside>
  );
}

export { MentorSidebar };

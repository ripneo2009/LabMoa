// 논문 카드 — 제목/저널/발행일/태그. 카드 전체를 클릭하면 원본 출처로 이동한다.
// 실제 DOI/URL이 있으면 그곳으로, 없는(플레이스홀더) 논문은 제목으로 Google Scholar 검색으로 대체한다.
import { Badge } from "@/components/ui";
import type { Paper } from "@/types/lab";

export interface PaperCardProps {
  paper: Paper;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function scholarSearchUrl(title: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
}

function PaperCard({ paper }: PaperCardProps) {
  const sourceUrl = paper.url ?? paper.doi ?? scholarSearchUrl(paper.title);
  const hasRealSource = Boolean(paper.url ?? paper.doi);

  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/paper flex flex-col gap-2 rounded-lg border border-border p-4 transition-[transform,border-color] duration-(--dur-fast) ease-(--ease-out) hover:-translate-y-[3px] hover:border-primary/20"
    >
      <h3 className="text-sm font-medium text-foreground">{paper.title}</h3>
      <p className="text-xs text-muted-foreground">
        {paper.journal} · {formatDate(paper.publishedAt)}
      </p>
      {paper.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <span className="text-xs font-medium text-primary underline-offset-4 group-hover/paper:underline">
        {hasRealSource ? "원문 보기 ↗" : "Google Scholar에서 찾기 ↗"}
      </span>
    </a>
  );
}

export { PaperCard };

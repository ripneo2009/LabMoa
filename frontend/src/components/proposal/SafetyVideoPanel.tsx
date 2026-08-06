// 계획서 작성/검토 화면 우측에 붙는 안전 교육 영상 패널 — YouTube 임베드 + 출처 표기
const VIDEO_ID = "AYjKryCJAao";
const VIDEO_SOURCE_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

function SafetyVideoPanel() {
  return (
    <aside className="flex flex-col gap-2 lg:sticky lg:top-24 lg:self-start">
      <h2 className="text-sm font-medium text-foreground">안전 교육 영상</h2>
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
          title="실험 안전 교육 영상"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-muted-foreground">
        출처:{" "}
        <a
          href={VIDEO_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          YouTube
        </a>
      </p>
    </aside>
  );
}

export { SafetyVideoPanel };

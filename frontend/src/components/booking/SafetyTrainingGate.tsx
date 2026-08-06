"use client";

import * as React from "react";
import { CheckCircle2, LockKeyhole, PlayCircle } from "lucide-react";

import { Button, Card } from "@/components/ui";

const VIDEO_ID = "AYjKryCJAao";

interface YouTubePlayer {
  destroy: () => void;
  playVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
}

interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: { onReady: () => void; onStateChange: (event: { data: number }) => void };
    },
  ) => YouTubePlayer;
  PlayerState: { PLAYING: number; ENDED: number };
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeNamespace> | null = null;

function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return youtubeApiPromise;
}

interface SafetyTrainingGateProps {
  labName: string;
  onContinue: () => void;
}

function SafetyTrainingGate({ labName, onContinue }: SafetyTrainingGateProps) {
  const playerHostRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<YouTubePlayer | null>(null);
  const watchedSecondsRef = React.useRef(new Set<number>());
  const [ready, setReady] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [message, setMessage] = React.useState("영상을 재생하면 다음 단계가 열립니다.");

  React.useEffect(() => {
    let player: YouTubePlayer | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !playerHostRef.current) return;
      player = new YT.Player(playerHostRef.current, {
        videoId: VIDEO_ID,
        playerVars: { rel: 0, playsinline: 1, origin: window.location.origin },
        events: {
          onReady: () => {
            setReady(true);
            timer = setInterval(() => {
              if (!player || player.getPlayerState() !== YT.PlayerState.PLAYING) return;
              const duration = player.getDuration();
              const current = player.getCurrentTime();
              if (!duration || !Number.isFinite(current)) return;
              watchedSecondsRef.current.add(Math.floor(current));
              setProgress(Math.min(100, Math.round((watchedSecondsRef.current.size / duration) * 100)));
            }, 500);
          },
          onStateChange: ({ data }) => {
            if (data === YT.PlayerState.PLAYING) {
              setProgress(100);
              setCompleted(true);
              setMessage("안전교육 영상 재생을 확인했습니다.");
              return;
            }
            if (!player || data !== YT.PlayerState.ENDED) return;
            const duration = player.getDuration();
            const watchedRatio = duration ? watchedSecondsRef.current.size / duration : 0;
            if (watchedRatio >= 0.9) {
              setProgress(100);
              setCompleted(true);
              setMessage("안전교육 시청이 완료되었습니다.");
            } else {
              setMessage("건너뛴 구간이 있습니다. 영상을 처음부터 끝까지 시청해주세요.");
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      player?.destroy();
      playerRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Card className="gap-4 p-5">
        <div className="flex items-start gap-3">
          {completed ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          ) : (
            <PlayCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          )}
          <div>
            <h2 className="font-medium text-foreground">필수 안전교육</h2>
            <p className="mt-1 text-sm text-muted-foreground">{labName} 예약 전 반드시 시청해야 합니다.</p>
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
          <div ref={playerHostRef} className="h-full w-full" />
          {!completed && (
            <button
              type="button"
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 text-white"
              aria-label="안전교육 영상 재생"
              onClick={() => {
                playerRef.current?.playVideo();
                setProgress(100);
                setCompleted(true);
                setMessage("안전교육 영상 재생을 확인했습니다.");
              }}
            >
              <span className="sr-only">영상 재생 후 예약 절차 열기</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{message}</span>
            <span className="shrink-0 tabular-nums">{progress}%</span>
          </div>
        </div>
      </Card>

      <Button
        type="button"
        size="lg"
        disabled={!ready || !completed}
        onClick={onContinue}
      >
        {!completed && <LockKeyhole aria-hidden="true" />}
        {completed ? "예약 절차 계속하기" : "안전교육 시청 필요"}
      </Button>
    </div>
  );
}

export { SafetyTrainingGate };

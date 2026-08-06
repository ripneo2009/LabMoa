// 말풍선 하나 — 내가 보낸 메시지는 오른쪽/Accent, 상대 메시지는 왼쪽/중립색
import { cn, formatTime } from "@/lib/utils";
import type { Message } from "@/types/proposal";

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-6",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {message.content}
      </div>
      <span className="px-1 text-[11px] text-muted-foreground">{formatTime(message.createdAt)}</span>
    </div>
  );
}

export { MessageBubble };

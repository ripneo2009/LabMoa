"use client"

// 계획서 단위 1:1 채팅 스레드 — 3초 폴링으로 새 메시지를 받아오고 최하단에 자동 스크롤한다.
import * as React from "react"

import { usePolling } from "@/hooks/usePolling"
import type { Message } from "@/types/proposal"
import { MessageBubble } from "./MessageBubble"
import { ChatInput } from "./ChatInput"

export interface ChatThreadProps {
  proposalId: string
  currentUserId: string
  initialMessages: Message[]
  otherPersonName: string
  otherPersonSubtitle: string
}

const POLL_INTERVAL_MS = 3000

async function fetchMessages(proposalId: string): Promise<Message[]> {
  const res = await fetch(`/api/messages?proposalId=${proposalId}`)
  if (!res.ok) throw new Error("메시지를 불러오지 못했습니다.")
  const data = (await res.json()) as { messages: Message[] }
  return data.messages
}

function ChatThread({ proposalId, currentUserId, initialMessages, otherPersonName, otherPersonSubtitle }: ChatThreadProps) {
  const { data: polled, error, refetch } = usePolling(() => fetchMessages(proposalId), POLL_INTERVAL_MS, [proposalId])
  const messages = polled ?? initialMessages
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length])

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-border">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground">{otherPersonName}</p>
        <p className="text-xs text-muted-foreground">{otherPersonSubtitle}</p>
      </div>

      {/* flex 자식은 min-height:auto가 기본값이라 overflow-y-auto만으로는 스크롤되지 않고
          바깥 h-[70vh] 밖으로 늘어난다 — min-h-0으로 명시적으로 눌러줘야 스크롤이 실제로 걸린다 */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {error && <p role="alert" className="mb-3 text-center text-xs text-destructive">{error} 자동으로 다시 시도합니다.</p>}
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              아직 대화가 없어요. 먼저 메시지를 보내보세요.
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput proposalId={proposalId} onSent={refetch} />
    </div>
  )
}

export { ChatThread }

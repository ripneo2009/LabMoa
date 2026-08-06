"use client"

// 메시지 입력창 — Enter로 전송(Shift+Enter는 줄바꿈)
import * as React from "react"

import { Button, Textarea } from "@/components/ui"
import { sendMessage } from "@/lib/actions/message.actions"
import { getErrorMessage } from "@/lib/utils"

export interface ChatInputProps {
  proposalId: string
  onSent?: () => void
}

function ChatInput({ proposalId, onSent }: ChatInputProps) {
  const [value, setValue] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSend() {
    const content = value.trim()
    if (!content || pending) return
    setPending(true)
    setError(null)
    setValue("")
    try {
      await sendMessage(proposalId, content)
      onSent?.()
    } catch (caught) {
      setValue(content)
      setError(getErrorMessage(caught, "메시지를 보내지 못했습니다."))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border p-3">
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      <div className="flex items-end gap-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
        placeholder="메시지를 입력하세요"
        rows={1}
        className="max-h-32 flex-1 resize-none overflow-y-auto"
      />
      <Button type="button" size="sm" disabled={pending || !value.trim()} onClick={handleSend}>
        {pending ? "전송 중…" : "전송"}
      </Button>
      </div>
    </div>
  )
}

export { ChatInput }

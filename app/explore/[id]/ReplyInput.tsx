'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CornerUpLeft } from "lucide-react"
import { IComment } from '@/models/comment'

type ReplyInputProps = {
  onSubmit: (replyText: string) => void
  replyingTo?: string
  setReplyCommentId: Function
}

export default function ReplyInput({ onSubmit, replyingTo, setReplyCommentId,}: ReplyInputProps) {
  const [reply, setReply] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    onSubmit(reply)
    setReply("")
    setReplyCommentId(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      {replyingTo && (
        <span className="text-xs text-muted-foreground">
            Replying to <strong>@{replyingTo}</strong>
        </span>
      )}
      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write your reply..."
        className="min-h-[60px]"
      />
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          size="sm"
          className="flex items-center gap-1 bg-accent-foreground"
          disabled={!reply.trim()}
        >
          <CornerUpLeft size={16} />
          Reply
        </Button>
        <Button
          size="sm"
          className="flex items-center gap-1 bg-transparent text-white border-1 hover:bg-white hover:text-gray-700"
          onClick={() => setReplyCommentId("")}
        >
            Cancel
        </Button>
      </div>
    </form>
  )
}

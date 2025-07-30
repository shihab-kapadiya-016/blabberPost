'use client';

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CommentInputProps = {
  onSubmit: (comment: string) => void;
  isLoading?: boolean;
};

export default function CommentInput({ onSubmit, isLoading }: CommentInputProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment.trim());
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <Input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 bg-background"
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading || !comment.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}

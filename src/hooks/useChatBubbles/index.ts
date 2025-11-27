"use client";
import { useMemo } from "react";
import type { ChatBubble, QuestionThread } from "@/types";

export function useChatBubbles(
  selectedThread: QuestionThread | null,
  currentUserName: string | null | undefined
) {
  return useMemo(() => {
    if (!selectedThread) return [];

    const bubbles: ChatBubble[] = [
      {
        id: `${selectedThread.id}-question`,
        sender: "user",
        content: selectedThread.content,
        timestamp: selectedThread.createdAt,
        senderLabel: selectedThread.authorName || currentUserName || "Anda",
      },
    ];

    if (selectedThread.replies && selectedThread.replies.length > 0) {
      selectedThread.replies.forEach((reply) => {
        const isStaff =
          reply.responderRole === "admin" || reply.responderRole === "owner";

        bubbles.push({
          id: reply.id,
          sender: isStaff ? "admin" : "user",
          content: reply.content,
          timestamp: reply.createdAt,
          senderLabel:
            reply.responderName ||
            (reply.responderRole === "owner" ? "owner" : "admin"),
          replyId: reply.id,
        });
      });
    }

    return bubbles;
  }, [selectedThread, currentUserName]);
}

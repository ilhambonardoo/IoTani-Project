import { QuestionMessage, ChatBubble, QuestionThread } from "@/types";

export const formatChatBubbles = (
  message: QuestionThread | QuestionMessage | null
): ChatBubble[] => {
  if (!message) return [];

  const bubbles: ChatBubble[] = [
    {
      id: `${message.id}-question`,
      sender: message.authorRole as "user" | "admin" | "owner",
      content: message.content,
      timestamp: message.createdAt,
      senderLabel: message.authorName || "Pengguna",
    },
  ];

  message.replies?.forEach((reply) => {
    bubbles.push({
      id: reply.id,
      sender: (reply.responderRole || "admin") as "user" | "admin" | "owner",
      content: reply.content,
      timestamp: reply.createdAt,
      senderLabel: reply.responderName || reply.responderRole || "Admin",
      replyId: reply.id,
    });
  });

  return bubbles;
};

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
      senderLabel: message.authorName || (message.authorRole === "user" ? "User" : message.authorRole === "admin" ? "Admin" : "Owner"),
    },
  ];

  // Sort replies by timestamp before adding to bubbles
  const sortedReplies = [...(message.replies || [])].sort((a, b) => {
    // Parse timestamp - handle both YYYY-MM-DD and ISO string formats
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    // If dates are equal (same day), use fallback comparison
    if (aTime === bTime && aTime > 0) {
      // If same date, maintain original order (use index as tiebreaker)
      return 0;
    }
    return aTime - bTime; // Sort ascending (oldest first)
  });

  sortedReplies.forEach((reply) => {
    let senderLabel = reply.responderName;
    
    if (!senderLabel || senderLabel.trim() === "" || senderLabel.trim() === "User") {
      const role = reply.responderRole || "admin";
      if (!senderLabel || senderLabel.trim() === "") {
        senderLabel = role === "user" ? "User" : role === "admin" ? "Admin" : "Owner";
      }
    }
    
    bubbles.push({
      id: reply.id,
      sender: (reply.responderRole || "admin") as "user" | "admin" | "owner",
      content: reply.content,
      timestamp: reply.createdAt,
      senderLabel: senderLabel,
      replyId: reply.id,
    });
  });

  // Sort all bubbles by timestamp to ensure correct order
  bubbles.sort((a, b) => {
    // Parse timestamp - handle both YYYY-MM-DD and ISO string formats
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    // If dates are equal (same day), maintain order (question first, then replies in order)
    if (aTime === bTime && aTime > 0) {
      // Question bubble should come first if same timestamp
      if (a.id.includes("-question") && !b.id.includes("-question")) return -1;
      if (!a.id.includes("-question") && b.id.includes("-question")) return 1;
      return 0;
    }
    return aTime - bTime; // Sort ascending (oldest first)
  });

  return bubbles;
};

import { getUser } from "@/lib/firebase/service";
import { getQuestions } from "@/lib/firebase/service";
import { NextResponse } from "next/server";

interface QuestionMessage {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
  createdAt: string;
  replies?: Array<{
    id: string;
    responderName: string;
    responderRole?: string;
    content: string;
    createdAt: string;
  }>;
}

export async function GET() {
  try {
    // Get all users
    const users = await getUser();
    
    // Calculate stats
    const totalUsers = users.length;
    // Active users: all users except admin and owner (regular users)
    const activeUsers = users.filter(
      (user) => user.role === "user"
    ).length;
    
    // Get all messages for admin
    const messagesRes = await getQuestions("admin", undefined);
    const messages: QuestionMessage[] = Array.isArray(messagesRes.data) ? messagesRes.data : [];
    
    const totalMessages = messages.length;
    // Pending messages: messages without replies (unanswered messages)
    const pendingMessages = messages.filter(
      (msg: QuestionMessage) => !msg.replies || msg.replies.length === 0
    ).length;

    return NextResponse.json(
      {
        status: true,
        data: {
          totalUsers,
          activeUsers,
          totalMessages,
          pendingMessages,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        status: false,
        message: "Gagal mengambil statistik dashboard",
      },
      { status: 500 }
    );
  }
}


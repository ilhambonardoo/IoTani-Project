import { getUser, getQuestions } from "@/lib/db/firebase/service";
import { NextResponse } from "next/server";
import type { QuestionMessage, DashboardStats } from "@/types";

export async function GET() {
  try {
    const users = await getUser();

    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.role === "user").length;

    const messagesRes = await getQuestions("admin", undefined);
    const messages: QuestionMessage[] = Array.isArray(messagesRes.data)
      ? messagesRes.data
      : [];

    const totalMessages = messages.length;
    const pendingMessages = messages.filter(
      (msg: QuestionMessage) => !msg.replies || msg.replies.length === 0
    ).length;

    const stats: DashboardStats = {
      totalUsers,
      activeUsers,
      totalMessages,
      pendingMessages,
    };

    return NextResponse.json(
      {
        status: true,
        data: stats,
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

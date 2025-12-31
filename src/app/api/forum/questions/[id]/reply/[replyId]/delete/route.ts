import { deleteQuestionReply } from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { ExtendedToken } from "@/types";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; replyId: string }> }
): Promise<NextResponse> {
  try {
    const { id: questionId, replyId } = await params;

    if (!questionId || !replyId) {
      return NextResponse.json(
        {
          status: false,
          message: "ID pertanyaan atau balasan tidak ditemukan",
        },
        { status: 400 }
      );
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const deletedByRole = (token as ExtendedToken)?.role || "user";

    const res = await deleteQuestionReply(questionId, replyId, deletedByRole);
    return NextResponse.json(
      { status: res.status, message: res.message },
      { status: res.statusCode }
    );
  } catch {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

import { deleteQuestionReply } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
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

    const res = await deleteQuestionReply(questionId, replyId);
    return NextResponse.json(
      { status: res.status, message: res.message },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API DELETE reply:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

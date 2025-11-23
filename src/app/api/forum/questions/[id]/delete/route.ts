import { deleteQuestion } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id: questionId } = await params;
    if (!questionId) {
      return NextResponse.json(
        { status: false, message: "ID pertanyaan tidak ditemukan" },
        { status: 400 }
      );
    }

    const res = await deleteQuestion(questionId);
    return NextResponse.json(
      { status: res.status, message: res.message },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API DELETE question:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

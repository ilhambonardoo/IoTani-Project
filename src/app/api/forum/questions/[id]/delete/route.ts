import { deleteQuestion } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const questionId = params.id;
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

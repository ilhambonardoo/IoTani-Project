import { deleteQuestion } from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type {ExtendedToken} from "@/types";

export async function DELETE(
  request: NextRequest,
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

    // Ambil role dari session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const deletedByRole = (token as ExtendedToken)?.role || "user";

    const res = await deleteQuestion(questionId, deletedByRole);
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

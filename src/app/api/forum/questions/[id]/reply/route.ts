import {
  addQuestionReply,
  getQuestionReplies,
} from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
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

    const res = await getQuestionReplies(questionId);
    return NextResponse.json(
      { status: res.status, message: res.message, data: res.data },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API GET reply:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
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

    const body = await request.json();
    const { content, responderName, responderRole } = body || {};

    if (!content || !responderName) {
      return NextResponse.json(
        {
          status: false,
          message: "Nama penjawab dan isi balasan wajib diisi",
        },
        { status: 400 }
      );
    }

    const res = await addQuestionReply(questionId, {
      content,
      responderName,
      responderRole,
    });
    return NextResponse.json(
      { status: res.status, message: res.message },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API POST reply:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}






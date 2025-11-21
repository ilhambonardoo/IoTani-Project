import { addQuestion, getQuestions } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const recipientRole = request.nextUrl.searchParams.get("recipientRole");
    const authorRole = request.nextUrl.searchParams.get("authorRole");
    
    const res = await getQuestions(
      recipientRole || undefined,
      authorRole || undefined
    );
    return NextResponse.json(
      {
        status: res.status,
        message: res.message,
        data: res.data,
      },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API GET questions: ", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, authorName, authorEmail, authorRole, recipientRole } = body || {};

    if (!title || !content || !category || !authorName) {
      return NextResponse.json(
        {
          status: false,
          message: "Nama, judul, kategori, dan pertanyaan wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!recipientRole) {
      return NextResponse.json(
        {
          status: false,
          message: "Penerima pesan wajib dipilih",
        },
        { status: 400 }
      );
    }

    const res = await addQuestion({
      title,
      content,
      category,
      authorName,
      authorEmail,
      authorRole: authorRole || "user",
      recipientRole,
    });

    return NextResponse.json(
      { status: res.status, message: res.message, data: res.data },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API POST questions: ", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}


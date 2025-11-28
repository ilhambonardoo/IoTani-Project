import { addQuestion, getQuestions } from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type {ExtendedToken} from "@/types";

export async function GET(request: NextRequest) {
  try {
    const recipientRole = request.nextUrl.searchParams.get("recipientRole");
    const authorRole = request.nextUrl.searchParams.get("authorRole");
    
    // Ambil role dari session untuk filtering deletedForRoles
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const viewerRole = (token as ExtendedToken)?.role || undefined;
    
    const res = await getQuestions(
      recipientRole || undefined,
      authorRole || undefined,
      viewerRole
    );
    return NextResponse.json(
      {
        status: res.status,
        message: res.message,
        data: res.data,
      },
      { status: res.statusCode }
    );
  } catch {
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

    // Validasi field wajib
    if (!title || !content || !category) {
      return NextResponse.json(
        {
          status: false,
          message: "Judul, kategori, dan pertanyaan wajib diisi",
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

    // Ambil informasi user dari session jika tidak ada di body
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const finalAuthorName = authorName || (token as ExtendedToken)?.fullName  || (token as ExtendedToken)?.email || "User";
    const finalAuthorEmail = authorEmail || (token as ExtendedToken)?.email || "";
    const finalAuthorRole = authorRole || (token as ExtendedToken)?.role || "user";

    const res = await addQuestion({
      title,
      content,
      category,
      authorName: finalAuthorName,
      authorEmail: finalAuthorEmail,
      authorRole: finalAuthorRole,
      recipientRole,
    });

    return NextResponse.json(
      { status: res.status, message: res.message, data: res.data },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error in POST /api/forum/questions:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}


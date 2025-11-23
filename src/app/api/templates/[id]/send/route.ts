import { sendTemplateToUsers } from "@/lib/firebase/service-templates";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id: templateId } = await params;
    if (!templateId) {
      return NextResponse.json(
        { status: false, message: "ID template tidak ditemukan" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { targetRole, senderName, senderRole } = body || {};

    if (!targetRole || !senderName || !senderRole) {
      return NextResponse.json(
        {
          status: false,
          message: "Target role, nama pengirim, dan role pengirim wajib diisi",
        },
        { status: 400 }
      );
    }

    const res = await sendTemplateToUsers(
      templateId,
      targetRole,
      senderName,
      senderRole
    );
    return NextResponse.json(
      { status: res.status, message: res.message, data: res.data },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API POST send template:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

import { deleteContent } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Parameter id wajib diisi" },
        { status: 400 }
      );
    }

    const res = await deleteContent(id);
    return NextResponse.json(
      { status: res.status, message: res.message },
      { status: res.statusCode }
    );
  } catch {
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}








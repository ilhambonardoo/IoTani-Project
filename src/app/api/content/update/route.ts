import { updateContent } from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    const { id, title, content, category } = req || {};

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Id konten wajib diisi" },
        { status: 400 }
      );
    }

    if (!title || !content || !category) {
      return NextResponse.json(
        {
          status: false,
          message: "Title, content, dan category tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await updateContent(id, { title, content, category });
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








import { addContent } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    if (!req.title || !req.body) {
      return NextResponse.json(
        {
          status: "error",
          message: "Title, content, dan category tidak boleh kosong",
        },
        { status: 400 }
      );
    }
    const res = await addContent(req);
    return NextResponse.json(
      { status: res.status, message: res.message || null },
      { status: res.statusCode }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan pada server",
        error,
      },
      { status: 500 }
    );
  }
}

import { addContent } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { title, content, category } = req || {};

    if (!title || !content || !category) {
      return NextResponse.json(
        {
          status: false,
          message: "Title, content, dan category tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await addContent({ title, content, category });
    return NextResponse.json(
      {
        status: res.status,
        message: res.message || null,
        data: res.data,
      },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API route ADD: ", error);
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}

import { addChili } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { name, description, imageUrl, characteristics, uses } = req || {};

    if (!name || !description) {
      return NextResponse.json(
        {
          status: false,
          message: "Nama dan deskripsi tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await addChili({ 
      name, 
      description, 
      imageUrl: imageUrl || "",
      characteristics: characteristics || "",
      uses: uses || ""
    });
    return NextResponse.json(
      {
        status: res.status,
        message: res.message || null,
        data: res.data,
      },
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


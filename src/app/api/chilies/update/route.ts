import { updateChili } from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    const { id, name, description, imageUrl, characteristics, uses } = req || {};

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "ID tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    if (!name || !description) {
      return NextResponse.json(
        {
          status: false,
          message: "Nama dan deskripsi tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await updateChili(id, {
      name,
      description,
      imageUrl: imageUrl || "",
      characteristics: characteristics || "",
      uses: uses || "",
    });

    return NextResponse.json(
      {
        status: res.status,
        message: res.message || null,
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


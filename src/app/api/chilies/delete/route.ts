import { deleteChili } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "ID tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await deleteChili(id);

    return NextResponse.json(
      {
        status: res.status,
        message: res.message || null,
      },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API route DELETE CHILI: ", error);
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}


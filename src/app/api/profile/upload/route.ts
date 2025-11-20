import { uploadProfileImage } from "@/lib/firebase/service-profile";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json(
        {
          status: false,
          message: "File tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          status: false,
          message: "User ID tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await uploadProfileImage(file, userId);
    return NextResponse.json(
      {
        status: res.status,
        message: res.message,
        data: res.data,
      },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API POST upload profile:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}


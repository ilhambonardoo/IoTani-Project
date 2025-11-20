import { deleteProfileImage } from "@/lib/firebase/service-profile";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const avatarUrl = searchParams.get("avatarUrl");

    if (!avatarUrl) {
      return NextResponse.json(
        {
          status: false,
          message: "Avatar URL tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await deleteProfileImage(avatarUrl);
    return NextResponse.json(
      {
        status: res.status,
        message: res.message,
      },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API DELETE profile image:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}


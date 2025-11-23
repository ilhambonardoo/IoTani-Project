import { getUserProfile, updateUserProfile } from "@/lib/firebase/service-profile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          status: false,
          message: "Email tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await getUserProfile(email);
    return NextResponse.json(
      {
        status: res.status,
        message: res.message,
        data: res.data,
      },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API GET profile:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, fullName, phone, location, bio, avatarUrl, instagram } = body || {};

    if (!email) {
      return NextResponse.json(
        {
          status: false,
          message: "Email tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await updateUserProfile(email, {
      fullName,
      phone,
      location,
      bio,
      avatarUrl,
      instagram,
    });

    return NextResponse.json(
      {
        status: res.status,
        message: res.message,
      },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API PUT profile:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}


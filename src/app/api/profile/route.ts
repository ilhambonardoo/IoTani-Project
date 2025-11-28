import {
  getUserProfile,
  updateUserProfile,
} from "@/lib/db/firebase/service-profile";
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

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, fullName, phone, location, bio, avatarUrl, instagram } =
      body || {};

    if (!email) {
      return NextResponse.json(
        {
          status: false,
          message: "Email tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (instagram !== undefined) updateData.instagram = instagram;

    const res = await updateUserProfile(email, updateData);

    return NextResponse.json(
      {
        status: res.status,
        message: res.message,
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

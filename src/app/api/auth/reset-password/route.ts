import {
  verifyResetToken,
  markTokenAsUsed,
  updatePasswordByEmail,
} from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    // Validation
    if (!token) {
      return NextResponse.json(
        {
          status: false,
          message: "Token wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          status: false,
          message: "Password dan konfirmasi password wajib diisi",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          status: false,
          message: "Password dan konfirmasi password tidak cocok",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          status: false,
          message: "Password minimal 6 karakter",
        },
        { status: 400 }
      );
    }

    // Verify token
    const tokenVerification = await verifyResetToken(token);

    if (!tokenVerification.status || !tokenVerification.data) {
      return NextResponse.json(
        {
          status: false,
          message: tokenVerification.message || "Token tidak valid atau sudah kedaluwarsa",
        },
        { status: 400 }
      );
    }

    const { email, tokenDocId } = tokenVerification.data;

    // Update password
    const updateResult = await updatePasswordByEmail(email, password);

    if (!updateResult.status) {
      return NextResponse.json(
        {
          status: false,
          message: updateResult.message || "Gagal mengupdate password",
        },
        { status: 500 }
      );
    }

    // Mark token as used (don't wait for this, but try to do it)
    try {
      await markTokenAsUsed(tokenDocId);
    } catch {
      // Don't fail the request if marking token as used fails
    }

    return NextResponse.json(
      {
        status: true,
        message: "Password berhasil direset. Silakan login dengan password baru Anda.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan. Silakan coba lagi nanti.",
      },
      { status: 500 }
    );
  }
}


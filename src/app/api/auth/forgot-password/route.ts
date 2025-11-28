import { checkEmailExists, saveResetToken } from "@/lib/db/firebase/service";
import { sendResetPasswordEmail } from "@/lib/api/email/service-email";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          status: false,
          message: "Email wajib diisi",
        },
        { status: 400 }
      );
    }
    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      const resetToken = randomBytes(32).toString("hex");

      try {
        await saveResetToken(email, resetToken);

        try {
          await sendResetPasswordEmail(email, resetToken);
        } catch {}
      } catch {}
    }

    return NextResponse.json(
      {
        status: true,
        message:
          "Jika email terdaftar, link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.",
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

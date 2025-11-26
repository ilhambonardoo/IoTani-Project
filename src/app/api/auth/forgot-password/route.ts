import { checkEmailExists, saveResetToken } from "@/lib/firebase/service";
import { sendResetPasswordEmail } from "@/lib/email/service-email";
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

    // Check if email exists
    const emailExists = await checkEmailExists(email);

    // SECURITY: Always return the same response to prevent email enumeration
    // Only send email if email exists, but don't reveal this to the user
    if (emailExists) {
      // Generate secure random token
      const resetToken = randomBytes(32).toString("hex");

      // Save token to database
      try {
        await saveResetToken(email, resetToken);

        // Send reset password email
        try {
          await sendResetPasswordEmail(email, resetToken);
        } catch {
          // Continue anyway - we still want to return success message
        }
      } catch {
        // Continue anyway - we still want to return success message
      }
    }

    // Always return the same success message regardless of email existence
    // This prevents attackers from knowing which emails are registered
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

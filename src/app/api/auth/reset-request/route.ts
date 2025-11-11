import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/firebase/service";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, message: "Email diperlukan" }, { status: 400 });

    const { ok, token } = await createPasswordResetToken(email);

    // TODO: send email using your provider with link:
    // `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`
    // For development, we just return success (and token for debugging if needed)
    return NextResponse.json({ ok, token: process.env.NODE_ENV === "development" ? token : undefined });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Gagal memproses permintaan" }, { status: 500 });
  }
}



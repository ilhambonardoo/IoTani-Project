import { NextResponse } from "next/server";
import { resetPasswordByToken } from "@/lib/firebase/service";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ ok: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    const result = await resetPasswordByToken(token, newPassword);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Gagal memproses permintaan" }, { status: 500 });
  }
}



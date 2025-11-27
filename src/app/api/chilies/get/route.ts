import { getChilies } from "@/lib/db/firebase/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getChilies();

    return NextResponse.json(
      { status: res.status, message: "Data berhasil diambil", data: res.data },
      { status: res.statusCode }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada API" },
      { status: 500 }
    );
  }
}


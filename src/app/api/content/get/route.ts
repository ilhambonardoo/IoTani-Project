import { getContents } from "@/lib/firebase/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getContents();

    return NextResponse.json(
      { status: res.status, message: "Data berhasil diambil", data: res.data },
      { status: res.statusCode }
    );
  } catch (e) {
    console.error("Error di API route GET: ", e);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan pada API" },
      { status: 500 }
    );
  }
}

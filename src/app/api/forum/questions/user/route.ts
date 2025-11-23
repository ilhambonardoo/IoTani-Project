import { getQuestionsByAuthorEmail } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { status: false, message: "Parameter email wajib diisi" },
        { status: 400 }
      );
    }

    const res = await getQuestionsByAuthorEmail(email);
    return NextResponse.json(
      { status: res.status, message: res.message, data: res.data },
      { status: res.statusCode }
    );
  } catch (error) {
    console.error("Error di API GET user questions: ", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}








import {
  addContent,
  getContents,
  updateContent,
  deleteContent,
} from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getContents();

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

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { title, content, category } = req || {};

    if (!title || !content || !category) {
      return NextResponse.json(
        {
          status: false,
          message: "Title, content, dan category tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await addContent({ title, content, category });
    return NextResponse.json(
      {
        status: res.status,
        message: res.message || null,
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

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    const { id, title, content, category } = req || {};

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Id konten wajib diisi" },
        { status: 400 }
      );
    }

    if (!title || !content || !category) {
      return NextResponse.json(
        {
          status: false,
          message: "Title, content, dan category tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await updateContent(id, { title, content, category });
    return NextResponse.json(
      { status: res.status, message: res.message },
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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Parameter id wajib diisi" },
        { status: 400 }
      );
    }

    const res = await deleteContent(id);
    return NextResponse.json(
      { status: res.status, message: res.message },
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

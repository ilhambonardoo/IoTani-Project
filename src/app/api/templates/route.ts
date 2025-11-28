import {
  createTemplate,
  getTemplates,
  deleteTemplate,
  updateTemplate,
} from "@/lib/db/firebase/service-templates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const res = await getTemplates();
    return NextResponse.json(
      { status: res.status, message: res.message, data: res.data },
      { status: res.statusCode }
    );
  } catch {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, title, content, category } = body || {};

    if (!name || !title || !content) {
      return NextResponse.json(
        {
          status: false,
          message: "Nama, judul, dan konten template wajib diisi",
        },
        { status: 400 }
      );
    }

    const res = await createTemplate({
      name,
      title,
      content,
      category: category || "Umum",
    });
    return NextResponse.json(
      { status: res.status, message: res.message, data: res.data },
      { status: res.statusCode }
    );
  } catch {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id: templateId, name, title, content, category } = body || {};

    if (!templateId) {
      return NextResponse.json(
        { status: false, message: "ID template tidak ditemukan" },
        { status: 400 }
      );
    }

    const res = await updateTemplate(templateId, {
      name,
      title,
      content,
      category,
    });
    return NextResponse.json(
      { status: res.status, message: res.message },
      { status: res.statusCode }
    );
  } catch {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id: templateId } = body || {};

    if (!templateId) {
      return NextResponse.json(
        { status: false, message: "ID template tidak ditemukan" },
        { status: 400 }
      );
    }

    const res = await deleteTemplate(templateId);
    return NextResponse.json(
      { status: res.status, message: res.message },
      { status: res.statusCode }
    );
  } catch {
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

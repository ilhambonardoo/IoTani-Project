import {
  getChilies,
  addChili,
  updateChili,
  deleteChili,
} from "@/lib/db/firebase/service";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { name, description, imageUrl, characteristics, uses } = req || {};

    if (!name || !description) {
      return NextResponse.json(
        {
          status: false,
          message: "Nama dan deskripsi tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await addChili({
      name,
      description,
      imageUrl: imageUrl || "",
      characteristics: characteristics || "",
      uses: uses || "",
    });
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
    const { id, name, description, imageUrl, characteristics, uses } =
      req || {};

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "ID tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    if (!name || !description) {
      return NextResponse.json(
        {
          status: false,
          message: "Nama dan deskripsi tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await updateChili(id, {
      name,
      description,
      imageUrl: imageUrl || "",
      characteristics: characteristics || "",
      uses: uses || "",
    });

    return NextResponse.json(
      {
        status: res.status,
        message: res.message || null,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "ID tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const res = await deleteChili(id);

    return NextResponse.json(
      {
        status: res.status,
        message: res.message || null,
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

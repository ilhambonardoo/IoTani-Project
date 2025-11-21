import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "chilies";

    if (!file) {
      return NextResponse.json(
        {
          status: false,
          message: "File tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          status: false,
          message: "File harus berupa gambar",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          status: false,
          message: "Ukuran file maksimal 5MB",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const uploadDir = join(process.cwd(), "public", folder);

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const url = `/${folder}/${filename}`;

    return NextResponse.json(
      {
        status: true,
        message: "Gambar berhasil diupload",
        data: { url },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error di API POST upload chili image:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}


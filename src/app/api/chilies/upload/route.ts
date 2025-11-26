import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/client";

// Force dynamic rendering to prevent build-time analysis errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "chilies";

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

    // Initialize Supabase client (using admin for server-side upload)
    const supabase = getSupabaseAdmin();

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${sanitizedFileName}`;
    const filePath = `${folder}/${filename}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    // Bucket name should match the folder or use a default bucket
    const bucketName = "IoTani_Bucket";

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false, // Don't overwrite existing files
      });

    if (uploadError) {
      // More detailed error message
      let errorMessage = "Gagal mengupload file ke storage";
      if (uploadError.message?.includes("Bucket not found")) {
        errorMessage = `Bucket "${bucketName}" tidak ditemukan. Pastikan bucket sudah dibuat di Supabase Dashboard → Storage dan policy sudah di-set.`;
      } else if (
        uploadError.message?.includes("new row violates row-level security")
      ) {
        errorMessage =
          "Akses ditolak. Pastikan bucket policy mengizinkan upload. Gunakan Service Role Key untuk server-side upload.";
      }

      return NextResponse.json(
        {
          status: false,
          message: errorMessage,
          error: uploadError.message,
          bucketName: bucketName,
        },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const url = urlData.publicUrl;

    // Debug: Log the uploaded URL

    return NextResponse.json(
      {
        status: true,
        message: "Gambar berhasil diupload",
        data: { url },
      },
      { status: 200 }
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

"use server";

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "./init";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const firestore = getFirestore(app);

type ServiceResponse<T = unknown> = {
  status: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  error?: unknown;
};

export interface ProfileData {
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  instagram?: string;
  fullName?: string;
  email?: string;
}

// GET USER PROFILE
export async function getUserProfile(
  email: string
): Promise<ServiceResponse<ProfileData>> {
  try {
    const q = query(collection(firestore, "auth"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        status: false,
        statusCode: 404,
        message: "User tidak ditemukan",
      };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Normalize avatarUrl - empty string means use default initials
    let avatarUrl = userData.avatarUrl || "";

    // Fix old paths to empty string (use initials instead)
    if (avatarUrl === "/icons/people.png" || avatarUrl === "/icon/people.png") {
      avatarUrl = "";
      // Auto-update database
      try {
        const docRef = doc(firestore, "auth", userDoc.id);
        await updateDoc(docRef, {
          avatarUrl: "",
        });
      } catch (error) {
        console.warn("Failed to update avatarUrl in database:", error);
      }
    }

    return {
      status: true,
      statusCode: 200,
      data: {
        phone: userData.phone || "",
        location: userData.location || "",
        bio: userData.bio || "",
        avatarUrl: avatarUrl,
        instagram: userData.instagram || "",
        fullName: userData.fullName || "",
        email: userData.email || "",
      },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Gagal mengambil data profile",
      error,
    };
  }
}

// UPLOAD PROFILE IMAGE
export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<ServiceResponse<{ url: string }>> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        status: false,
        statusCode: 400,
        message: "File harus berupa gambar",
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        status: false,
        statusCode: 400,
        message: "Ukuran file maksimal 5MB",
      };
    }

    // Convert email to safe filename
    const safeUserId = userId.replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${safeUserId}_${timestamp}.${fileExtension}`;

    // Create profiles directory if it doesn't exist
    const profilesDir = join(process.cwd(), "public", "profiles");
    try {
      await mkdir(profilesDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's okay
      return {
        status: false,
        statusCode: 500,
        message: "Gagal membuat direktori untuk menyimpan foto",
        error,
      };
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save file to public/profiles folder
    const filePath = join(profilesDir, fileName);
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/profiles/${fileName}`;

    return {
      status: true,
      statusCode: 200,
      message: "Foto berhasil diupload",
      data: { url: publicUrl },
    };
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Gagal mengupload foto",
      error,
    };
  }
}

// DELETE PROFILE IMAGE
export async function deleteProfileImage(
  avatarUrl: string
): Promise<ServiceResponse> {
  try {
    // Only delete if it's a profile image (starts with /profiles/)
    if (!avatarUrl || !avatarUrl.startsWith("/profiles/")) {
      return {
        status: true,
        statusCode: 200,
        message: "Foto bukan dari upload profile, tidak perlu dihapus",
      };
    }

    // Extract filename from URL
    const fileName = avatarUrl.split("/profiles/")[1];
    if (!fileName) {
      return {
        status: false,
        statusCode: 400,
        message: "URL foto tidak valid",
      };
    }

    // Get file path
    const filePath = join(process.cwd(), "public", "profiles", fileName);

    // Check if file exists
    if (!existsSync(filePath)) {
      return {
        status: true,
        statusCode: 200,
        message: "File sudah tidak ada",
      };
    }

    // Delete file
    await unlink(filePath);

    return {
      status: true,
      statusCode: 200,
      message: "Foto berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Gagal menghapus foto",
      error,
    };
  }
}

// UPDATE USER PROFILE
export async function updateUserProfile(
  email: string,
  data: Partial<ProfileData>
): Promise<ServiceResponse> {
  try {
    const q = query(collection(firestore, "auth"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        status: false,
        statusCode: 404,
        message: "User tidak ditemukan",
      };
    }

    const userDoc = snapshot.docs[0];
    const docRef = doc(firestore, "auth", userDoc.id);

    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 200,
      message: "Profile berhasil diperbarui",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Gagal memperbarui profile",
      error,
    };
  }
}

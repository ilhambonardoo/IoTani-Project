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
      } catch {
        // Continue even if update fails
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
  file: Partial<ProfileData>,
  email: string
): Promise<ServiceResponse> {
  try {
    // Find user by email (same pattern as getUserProfile)
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
    const currentData = userDoc.data();
    const oldAvatarUrl = currentData.avatarUrl || "";
    const newImageUrl = file.avatarUrl || "";

    // Delete old profile image from Supabase if exists
    if (
      oldAvatarUrl &&
      newImageUrl &&
      oldAvatarUrl !== newImageUrl &&
      oldAvatarUrl.includes("supabase.co")
    ) {
      const { getSupabaseAdmin } = await import("@/lib/supabase/client");
      const supabase = getSupabaseAdmin();
      const bucketName = "IoTani_Bucket";

      const urlParts = oldAvatarUrl.split("/IoTani_Bucket/");
      if (urlParts.length >= 2) {
        const filePath = urlParts[1];
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);
        if (deleteError) {
          // Continue even if deletion fails
        }
      }
    }

    // Update database with new avatarUrl
    await updateDoc(docRef, {
      avatarUrl: newImageUrl,
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 200,
      message: "Foto profile berhasil diupdate",
    };
  } catch (error) {
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
    if (!avatarUrl || avatarUrl === "") {
      return {
        status: false,
        statusCode: 400,
        message: "Avatar URL tidak boleh kosong",
      };
    }

    // Check if it's a Supabase URL
    if (avatarUrl.includes("supabase.co")) {
      const { getSupabaseAdmin } = await import("@/lib/supabase/client");
      const supabase = getSupabaseAdmin();
      const bucketName = "IoTani_Bucket";

      const urlParts = avatarUrl.split("/IoTani_Bucket/");

      if (urlParts.length >= 2) {
        const filePath = urlParts[1];

        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (deleteError) {
          return {
            status: false,
            statusCode: 500,
            message: "Gagal menghapus file fisik di storage",
            error: deleteError,
          };
        }
      } else {
        return {
          status: false,
          statusCode: 400,
          message: "Format URL tidak valid",
        };
      }

      return {
        status: true,
        statusCode: 200,
        message: "Foto profil berhasil dihapus",
      };
    }

    // If it's not a Supabase URL, just return success
    return {
      status: true,
      statusCode: 200,
      message: "Tidak ada foto Supabase yang perlu dihapus",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Terjadi kesalahan internal",
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

    // Filter out undefined values to avoid Firestore errors
    const updateData: Record<string, string | ReturnType<typeof serverTimestamp>> = {
      updatedAt: serverTimestamp(),
    };
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ProfileData];
      if (value !== undefined) {
        updateData[key] = value as string;
      }
    });

    await updateDoc(docRef, updateData);

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

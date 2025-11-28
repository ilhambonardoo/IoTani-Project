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
import type { ServiceResponse, ProfileData } from "@/types";

const firestore = getFirestore(app);

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
    let avatarUrl = userData.avatarUrl || "";

    if (avatarUrl === "/icons/people.png" || avatarUrl === "/icon/people.png") {
      avatarUrl = "";
      try {
        const docRef = doc(firestore, "auth", userDoc.id);
        await updateDoc(docRef, {
          avatarUrl: "",
        });
      } catch {}
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

    if (
      oldAvatarUrl &&
      newImageUrl &&
      oldAvatarUrl !== newImageUrl &&
      oldAvatarUrl.includes("supabase.co")
    ) {
      const { getSupabaseAdmin } = await import("@/lib/db/supabase/client");
      const supabase = getSupabaseAdmin();
      const bucketName = "IoTani_Bucket";

      const urlParts = oldAvatarUrl.split("/IoTani_Bucket/");
      if (urlParts.length >= 2) {
        const filePath = urlParts[1];
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);
        if (deleteError) {
        }
      }
    }

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
      const { getSupabaseAdmin } = await import("@/lib/db/supabase/client");
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

    const updateData: Record<
      string,
      string | ReturnType<typeof serverTimestamp>
    > = {
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

"use server";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { app } from "./init";
import type { ServiceResponse, ChiliPayload } from "@/types";
import { formatDateFromTimestamp } from "./utils";

const firestore = getFirestore(app);

// MANAGEMENT CABAI
export async function addChili(data: ChiliPayload): Promise<ServiceResponse> {
  try {
    const chiliCollection = collection(firestore, "chilies");

    const docRef = await addDoc(chiliCollection, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 201,
      message: "Berhasil menambahkan cabai",
      data: { id: docRef.id },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak bisa menambahkan cabai",
      error,
    };
  }
}

export async function updateChili(
  id: string,
  data: Partial<ChiliPayload>
): Promise<ServiceResponse> {
  try {
    const docRef = doc(firestore, "chilies", id);
    const chiliDoc = await getDoc(docRef);

    if (!chiliDoc.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "Cabai tidak ditemukan",
      };
    }

    const currentData = chiliDoc.data();
    const oldImageUrl = currentData.imageUrl;
    const newImageUrl = data.imageUrl;

    if (
      oldImageUrl &&
      newImageUrl &&
      oldImageUrl !== newImageUrl &&
      oldImageUrl.includes("supabase.co")
    ) {
      try {
        const { getSupabaseAdmin } = await import("@/lib/db/supabase/client");
        const supabase = getSupabaseAdmin();
        const bucketName = "IoTani_Bucket";

        const urlParts = oldImageUrl.split("/IoTani_Bucket/");
        if (urlParts.length >= 2) {
          const filePath = urlParts[1];
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

          if (deleteError) {
          }
        }
      } catch {}
    }

    // Update document in Firestore
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 200,
      message: "Cabai berhasil diperbarui",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak bisa memperbarui cabai",
      error,
    };
  }
}

export async function deleteChili(id: string): Promise<ServiceResponse> {
  try {
    // Get chili data first to delete image from storage
    const docRef = doc(firestore, "chilies", id);
    const chiliDoc = await getDoc(docRef);

    if (!chiliDoc.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "Cabai tidak ditemukan",
      };
    }

    const chiliData = chiliDoc.data();
    const imageUrl = chiliData.imageUrl;

    // Delete image from Supabase Storage if exists
    if (imageUrl && imageUrl.includes("supabase.co")) {
      try {
        const { getSupabaseAdmin } = await import("@/lib/db/supabase/client");
        const supabase = getSupabaseAdmin();
        const bucketName = "IoTani_Bucket";

        // Extract file path from URL
        const urlParts = imageUrl.split("/IoTani_Bucket/");
        if (urlParts.length >= 2) {
          const filePath = urlParts[1];
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

          if (deleteError) {
          }
        }
      } catch {
        return {
          status: false,
          statusCode: 500,
          message: "Gagal menghapus gambar cabai dari penyimpanan",
        };
      }
    }

    await deleteDoc(docRef);

    return {
      status: true,
      statusCode: 200,
      message: "Cabai berhasil dihapus",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak bisa menghapus cabai",
      error,
    };
  }
}

export async function getChilies(): Promise<
  ServiceResponse<
    Array<{
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
      characteristics?: string;
      uses?: string;
      createdAt: string;
      updatedAt: string;
    }>
  >
> {
  try {
    const q = query(
      collection(firestore, "chilies"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const chilies: Array<{
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
      characteristics?: string;
      uses?: string;
      createdAt: string;
      updatedAt: string;
    }> = [];
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      chilies.push({
        id: docSnapshot.id,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl || "",
        characteristics: data.characteristics || "",
        uses: data.uses || "",
        createdAt: formatDateFromTimestamp(
          (data.createdAt as Timestamp) ?? undefined
        ),
        updatedAt: formatDateFromTimestamp(
          (data.updatedAt as Timestamp) ??
            (data.updateAt as Timestamp | undefined)
        ),
      });
    });
    return {
      status: true,
      statusCode: 200,
      data: chilies,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Terjadi kesalahan pada saat mengambil data cabai",
      error,
    };
  }
}

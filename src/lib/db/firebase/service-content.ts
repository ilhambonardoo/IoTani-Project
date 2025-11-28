"use server";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { app } from "./init";
import type { ServiceResponse, ContentPayload } from "@/types";
import { formatDateFromTimestamp } from "./utils";

const firestore = getFirestore(app);

// MANAGEMENT KONTEN
export async function addContent(
  data: ContentPayload
): Promise<ServiceResponse> {
  try {
    const contentCollection = collection(firestore, "content");

    const docRef = await addDoc(contentCollection, {
      ...data,
      author: data.role || "Admin",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 201,
      message: "Berhasil menambahkan content",
      data: { id: docRef.id },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak bisa menambahkan content",
      error,
    };
  }
}

export async function updateContent(
  id: string,
  data: Partial<ContentPayload>
): Promise<ServiceResponse> {
  try {
    const docRef = doc(firestore, "content", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 200,
      message: "Konten berhasil diperbarui",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak bisa memperbarui konten",
      error,
    };
  }
}

export async function deleteContent(id: string): Promise<ServiceResponse> {
  try {
    const docRef = doc(firestore, "content", id);
    await deleteDoc(docRef);

    return {
      status: true,
      statusCode: 200,
      message: "Konten berhasil dihapus",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak bisa menghapus konten",
      error,
    };
  }
}

export async function getContents(): Promise<
  ServiceResponse<
    Array<{
      id: string;
      title: string;
      category: string;
      content: string;
      author?: string;
      createdAt: string;
      updatedAt: string;
    }>
  >
> {
  try {
    const q = query(
      collection(firestore, "content"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const contents: Array<{
      id: string;
      title: string;
      category: string;
      content: string;
      author?: string;
      createdAt: string;
      updatedAt: string;
    }> = [];
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      contents.push({
        id: docSnapshot.id,
        title: data.title,
        category: data.category,
        content: data.content,
        author: data.author || "admin",
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
      data: contents,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Terjadi kesalahan pada saat mengambil data",
      error,
    };
  }
}


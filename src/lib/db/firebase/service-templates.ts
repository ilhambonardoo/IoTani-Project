"use server";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  updateDoc,
  serverTimestamp,
  Timestamp,
  query,
  where,
} from "firebase/firestore";

import { app } from "./init";
import type { ServiceResponse, TemplatePayload, Template } from "@/types";

const firestore = getFirestore(app);

// CREATE TEMPLATE
export async function createTemplate(
  data: TemplatePayload
): Promise<ServiceResponse> {
  try {
    const templatesCollection = collection(firestore, "templates");

    const docRef = await addDoc(templatesCollection, {
      ...data,
      category: data.category || "Umum",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 201,
      message: "Template berhasil dibuat",
      data: { id: docRef.id },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak bisa membuat template",
      error,
    };
  }
}

export async function getTemplates(): Promise<
  ServiceResponse<Template[]>
> {
  try {
    const templatesCollection = collection(firestore, "templates");
    const snapshot = await getDocs(templatesCollection);
    const templates: Template[] = [];

    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      templates.push({
        id: docSnapshot.id,
        name: data.name as string,
        title: data.title as string,
        content: data.content as string,
        category: (data.category as string) || "Umum",
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString().split("T")[0]
            : (data.createdAt as string) || "-",
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString().split("T")[0]
            : (data.updatedAt as string) || "-",
      });
    });

    return {
      status: true,
      statusCode: 200,
      data: templates,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Gagal mengambil templates",
      error,
    };
  }
}

// GET TEMPLATE BY ID
export async function getTemplateById(templateId: string): Promise<
  ServiceResponse<{
    id: string;
    name: string;
    title: string;
    content: string;
    category: string;
  }>
> {
  try {
    const templateDoc = doc(firestore, "templates", templateId);
    const snapshot = await getDoc(templateDoc);

    if (!snapshot.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "Template tidak ditemukan",
      };
    }

    const data = snapshot.data()!;
    return {
      status: true,
      statusCode: 200,
      data: {
        id: templateId,
        name: data.name,
        title: data.title,
        content: data.content,
        category: data.category || "Umum",
      },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Gagal mengambil template",
      error,
    };
  }
}

// UPDATE TEMPLATE
export async function updateTemplate(
  templateId: string,
  data: Partial<TemplatePayload>
): Promise<ServiceResponse> {
  try {
    const templateDoc = doc(firestore, "templates", templateId);
    await updateDoc(templateDoc, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 200,
      message: "Template berhasil diperbarui",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Gagal memperbarui template",
      error,
    };
  }
}

// DELETE TEMPLATE
export async function deleteTemplate(
  templateId: string
): Promise<ServiceResponse> {
  try {
    const templateDoc = doc(firestore, "templates", templateId);
    await deleteDoc(templateDoc);

    return {
      status: true,
      statusCode: 200,
      message: "Template berhasil dihapus",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Gagal menghapus template",
      error,
    };
  }
}

// SEND TEMPLATE MESSAGE TO USERS
export async function sendTemplateToUsers(
  templateId: string,
  targetRole: "user" | "admin" | "owner" | "all",
  senderName: string,
  senderRole: string
): Promise<
  ServiceResponse<{
    sentCount: number;
    failedCount: number;
  }>
> {
  try {
    // Get template
    const templateDoc = doc(firestore, "templates", templateId);
    const templateSnapshot = await getDoc(templateDoc);

    if (!templateSnapshot.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "Template tidak ditemukan",
      };
    }

    const template = templateSnapshot.data();

    // Get users based on target role
    let usersQuery;
    if (targetRole === "all") {
      usersQuery = query(collection(firestore, "auth"));
    } else {
      usersQuery = query(
        collection(firestore, "auth"),
        where("role", "==", targetRole)
      );
    }

    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      fullName: doc.data().fullName,
      role: doc.data().role || "user",
    }));

    // Send message to each user
    let sentCount = 0;
    let failedCount = 0;

    for (const user of users) {
      try {
        // Create a new question as template message
        await addDoc(collection(firestore, "questions"), {
          title: template.title,
          content: template.content,
          category: template.category || "Umum",
          authorName: senderName,
          authorEmail: user.email,
          authorRole: senderRole || "admin", // System message
          recipientRole: user.role,
          createdAt: serverTimestamp(),
          isTemplateMessage: true,
          templateId: templateId,
        });
        sentCount++;
      } catch {
        failedCount++;
      }
    }

    return {
      status: true,
      statusCode: 200,
      message: `Template berhasil dikirim ke ${sentCount} pengguna`,
      data: {
        sentCount,
        failedCount,
      },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Gagal mengirim template",
      error,
    };
  }
}

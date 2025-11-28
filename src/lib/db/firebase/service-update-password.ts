"use server";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { app } from "./init";
import bcrypt from "bcrypt";
import type { ServiceResponse } from "@/types";

const firestore = getFirestore(app);

// FORGOT PASSWORD & RESET PASSWORD
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const q = query(collection(firestore, "auth"), where("email", "==", email));

    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0;
  } catch {
    return false;
  }
}

export async function saveResetToken(
  email: string,
  token: string
): Promise<ServiceResponse> {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await addDoc(collection(firestore, "password_resets"), {
      email,
      token,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      used: false,
    });

    return {
      status: true,
      statusCode: 200,
      message: "Reset token saved successfully",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Failed to save reset token",
      error,
    };
  }
}

export async function verifyResetToken(token: string): Promise<
  ServiceResponse<{
    email: string;
    tokenDocId: string;
  }>
> {
  try {
    const q = query(
      collection(firestore, "password_resets"),
      where("token", "==", token),
      where("used", "==", false)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        status: false,
        statusCode: 400,
        message: "Token tidak valid atau sudah digunakan",
      };
    }

    const tokenData = snapshot.docs[0].data();
    const expiresAt = tokenData.expiresAt as Timestamp;

    if (expiresAt.toDate() < new Date()) {
      return {
        status: false,
        statusCode: 400,
        message: "Token sudah kedaluwarsa",
      };
    }

    return {
      status: true,
      statusCode: 200,
      message: "Token valid",
      data: {
        email: tokenData.email as string,
        tokenDocId: snapshot.docs[0].id,
      },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Failed to verify reset token",
      error,
    };
  }
}

export async function markTokenAsUsed(
  tokenDocId: string
): Promise<ServiceResponse> {
  try {
    const tokenDoc = doc(firestore, "password_resets", tokenDocId);
    await updateDoc(tokenDoc, {
      used: true,
    });

    return {
      status: true,
      statusCode: 200,
      message: "Token marked as used",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Failed to mark token as used",
      error,
    };
  }
}

export async function updatePasswordByEmail(
  email: string,
  newPassword: string
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
    const userDocRef = doc(firestore, "auth", userDoc.id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateDoc(userDocRef, {
      password: hashedPassword,
    });

    return {
      status: true,
      statusCode: 200,
      message: "Password berhasil diupdate",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Gagal mengupdate password",
      error,
    };
  }
}


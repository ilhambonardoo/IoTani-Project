"use server";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { app } from "./init";
import bcrypt from "bcrypt";
import type { UserData, FirestoreTimestamp } from "@/types";

const firestore = getFirestore(app);

// Internal helper function to convert Firestore Timestamp to ISO string
const convertTimestamp = (timestamp: FirestoreTimestamp): string | null => {
  if (!timestamp) return null;
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toISOString();
  }
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return null;
};

// Internal helper function to sanitize user data (remove Timestamps or convert them)
const sanitizeUserData = (
  data: UserData
): Omit<UserData, "updatedAt" | "createdAt"> & {
  updatedAt?: string | null;
  createdAt?: string | null;
} => {
  const { updatedAt, createdAt, ...rest } = data;
  const result: Omit<UserData, "updatedAt" | "createdAt"> & {
    updatedAt?: string | null;
    createdAt?: string | null;
  } = {
    ...rest,
  };
  
  if (updatedAt) {
    result.updatedAt = convertTimestamp(updatedAt as FirestoreTimestamp);
  }
  
  if (createdAt) {
    result.createdAt = convertTimestamp(createdAt as FirestoreTimestamp);
  }
  
  return result;
};

// MANAGEMENT USER

export async function deleteUserAdmin(id: string) {
  try {
    const useDoc = doc(firestore, "auth", id);
    await deleteDoc(useDoc);
    return { status: true, message: "User delete successfully" };
  } catch (error) {
    return { status: false, message: "Error deleting user", error };
  }
}

export async function updateUserAdmin(
  id: string,
  newfullName: string,
  newEmail: string,
  newPassword: string
) {
  try {
    const useDoc = doc(firestore, "atuh", id);
    const hashedPassoword = await bcrypt.hash(newPassword, 10);
    await updateDoc(useDoc, {
      fullName: newfullName,
      email: newEmail,
      password: hashedPassoword,
    });
    return { status: true, message: "User role update " };
  } catch (error) {
    return { status: false, message: "Error updating user role", error };
  }
}

export async function addUserAdmin(data: {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}) {
  const q = query(
    collection(firestore, "auth"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const users = snapshot.docs.map((doc) => {
    const userData = doc.data() as UserData;
    return {
      id: doc.id,
      ...sanitizeUserData(userData),
    };
  });

  if (users.length > 0) {
    return {
      status: false,
      statusCode: 400,
      message: "Email already registered",
    };
  } else {
    data.role = data.role || "user";
    data.password = await bcrypt.hash(data.password, 10);
    try {
      await addDoc(collection(firestore, "auth"), data);
      return {
        status: true,
        statusCode: 200,
        message: "User added successfully",
      };
    } catch (error) {
      return {
        status: false,
        statusCode: 400,
        message: "Failed to add user",
        error,
      };
    }
  }
}

export async function getUser() {
  const useCollection = collection(firestore, "auth");
  const useSnapshot = await getDocs(useCollection);

  const userList = useSnapshot.docs.map((doc) => ({
    id: doc.id,
    fullName: doc.data().fullName || "No Name",
    email: doc.data().email || "no-email@example.com",
    role: doc.data().role || "user",
  }));

  return userList;
}


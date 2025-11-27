"use server";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { app } from "./init";
import bcrypt from "bcrypt";
import type { GoogleUserPayload, FirestoreTimestamp, UserData } from "@/types";

const firestore = getFirestore(app);


// AUTHENTICATION
export async function register(data: {
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
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (users.length > 0) {
    return {
      status: false,
      statusCode: 400,
      message: "Email already registed",
    };
  } else {
    data.role = "user";
    data.password = await bcrypt.hash(data.password, 10);
    try {
      await addDoc(collection(firestore, "auth"), data);
      return { status: true, statusCode: 200, message: "Register successfull" };
    } catch (error) {
      return {
        status: false,
        statusCode: 400,
        message: "Register failed",
        error,
      };
    }
  }
}

export async function login(data: { email: string }) {
  const q = query(
    collection(firestore, "auth"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => {
    const userData = doc.data() as UserData;
    return {
      id: doc.id,
      ...sanitizeUserData(userData),
    };
  });

  if (user) {
    return user[0];
  } else {
    return null;
  }
}

// LOGIN WITH GOOGLE
export async function loginWithGoogle(data: GoogleUserPayload) {
  const q = query(
    collection(firestore, "auth"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => {
    const userData = doc.data() as UserData;
    return {
      id: doc.id,
      ...sanitizeUserData(userData),
    };
  });

  if (user.length > 0) {
    const userData = user[0] as Record<string, unknown>;
    data.role = (userData.role as string) || "user";
    await updateDoc(doc(firestore, "auth", user[0].id), {
      fullName: data.fullName,
      email: data.email,
      type: data.type,
    });
    return {
      status: true,
      data: {
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      },
    };
  } else {
    // New user, create with default role
    data.role = "user";
    await addDoc(collection(firestore, "auth"), data);
    return {
      status: true,
      data: {
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      },
    };
  }
}

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

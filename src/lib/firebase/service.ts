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
  updateDoc,
  where,
} from "firebase/firestore";

import { app } from "./init";
import bcrypt from "bcrypt";

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
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (user) {
    return user[0];
  } else {
    return null;
  }
}

// LOGIN WITH GOOGLE
export async function loginWithGoogle(data: any) {
  const q = query(
    collection(firestore, "auth"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];

  if (user.length > 0) {
    data.role = (user[0] as any).role || "user";
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
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

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

// MANAGEMENT KONTEN
export async function addContent(data: {
  title: string;
  category: string;
  content: string;
}) {
  try {
    const contentCollection = collection(firestore, "content");

    const docRef = await addDoc(contentCollection, {
      ...data,
      author: "Owner",
      createdAt: serverTimestamp(),
      updateAt: serverTimestamp(),
    });

    return {
      status: true,
      message: "Berhasil menambahkan content",
      docRef,
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

export async function deleteContent(data: {}) {}

export async function getContents() {
  try {
    const q = query(
      collection(firestore, "content"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const contents: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      contents.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString().split("T")[0],
        updatedAt: data.updatedAt.toDate().toISOString().split("T")[0],
      });
    });
    return {
      status: "success",
      statusCode: 200,
      data: contents,
    };
  } catch (error) {
    return {
      status: "eror",
      statusCode: 500,
      message: "Terjadi kesalahan pada saat mengambil data",
      error,
    };
  }
}

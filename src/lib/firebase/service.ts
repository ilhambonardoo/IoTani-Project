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

const firestore = getFirestore(app);

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}) {
  const q = query(
    collection(firestore, "user"),
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
      await addDoc(collection(firestore, "user"), data);
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
    collection(firestore, "user"),
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
export async function getUser() {
  const useCollection = collection(firestore, "user");
  const useSnapshot = await getDocs(useCollection);

  const userList = useSnapshot.docs.map((doc) => ({
    id: doc.id,
    fullName: doc.data().fullName || "No Name",
    email: doc.data().email || "no-email@example.com",
    role: doc.data().role || "user",
    status: doc.data().status || "Inactive",
    avatar: doc.data().avatar || "/avatars/default.png",
  }));

  return userList;
}

export async function deleteUser(id: string) {
  try {
    const useDoc = doc(firestore, "user", id);
    await deleteDoc(useDoc);
    return { status: true, message: "User delete successfully" };
  } catch (error) {
    return { status: false, message: "Error deleting user", error };
  }
}

export async function updateUser(
  id: string,
  newfullName: string,
  newEmail: string,
  newPassword: string
) {
  try {
    const useDoc = doc(firestore, "user", id);
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

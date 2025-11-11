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
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./init";
import bcrypt from "bcrypt";
import crypto from "crypto";

const firestore = getFirestore(app);
const storage = getStorage(app);

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

export async function deleteUserAdmin(id: string) {
  try {
    const useDoc = doc(firestore, "user", id);
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

// ========== Storage helpers (no auth usage) ==========
export async function uploadProfileImage(userId: string, file: File): Promise<string> {
  const path = `profiles/${userId}/${Date.now()}_${file.name}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  return await getDownloadURL(ref);
}

export async function saveUserProfileImageUrl(userId: string, photoURL: string): Promise<void> {
  const useDoc = doc(firestore, "user", userId);
  await updateDoc(useDoc, { avatar: photoURL, updatedAt: Date.now() });
}

// ========== Password reset flow (for NextAuth credentials) ==========
export async function createPasswordResetToken(email: string): Promise<{ ok: boolean; token?: string }> {
  const q = query(collection(firestore, "user"), where("email", "==", email));
  const snapshot = await getDocs(q);
  const userDoc = snapshot.docs[0];
  // Always respond ok to avoid email enumeration
  if (!userDoc) return { ok: true };

  const userId = userDoc.id;
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

  await setDoc(
    doc(firestore, "password_resets", token),
    { userId, email, expiresAt },
    { merge: true }
  );
  return { ok: true, token };
}

export async function resetPasswordByToken(token: string, newPassword: string): Promise<{ ok: boolean; message?: string }> {
  const tokenRef = doc(firestore, "password_resets", token);
  const tokenSnap = await getDoc(tokenRef);
  if (!tokenSnap.exists()) return { ok: false, message: "Token tidak valid" };

  const data = tokenSnap.data() as { userId: string; email: string; expiresAt: number };
  if (!data?.userId || !data?.expiresAt || Date.now() > data.expiresAt) {
    return { ok: false, message: "Token kadaluarsa" };
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  const userRef = doc(firestore, "user", data.userId);
  await updateDoc(userRef, { password: hashed, updatedAt: Date.now() });
  await deleteDoc(tokenRef);

  return { ok: true };
}

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
  where,
} from "firebase/firestore";

import { app } from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(app);

type ServiceResponse<T = unknown> = {
  status: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  error?: unknown;
};

type ContentPayload = {
  title: string;
  category: string;
  content: string;
  role?: string;
};

type ChiliPayload = {
  name: string;
  description: string;
  imageUrl?: string;
  characteristics?: string;
  uses?: string;
};

type QuestionPayload = {
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
};

type QuestionReplyPayload = {
  responderName: string;
  responderRole?: string;
  content: string;
};

const formatDateFromTimestamp = (value: Timestamp | string | undefined) => {
  if (!value) return "-";
  if (value instanceof Timestamp) {
    return value.toDate().toISOString().split("T")[0];
  }

  // Firestore doc snapshot returns objects with toDate method but not necessarily instanceof Timestamp
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in (value as Record<string, unknown>)
  ) {
    return (value as Timestamp).toDate().toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    return value;
  }

  return "-";
};

const getMillisecondsFromTimestamp = (
  value: Timestamp | string | undefined
): number => {
  if (!value) return 0;
  if (value instanceof Timestamp) {
    return value.toMillis();
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in (value as Record<string, unknown>)
  ) {
    return (value as Timestamp).toDate().getTime();
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

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
type GoogleUserPayload = {
  email: string;
  fullName: string;
  type?: string;
  role?: string;
};

export async function loginWithGoogle(data: GoogleUserPayload) {
  const q = query(
    collection(firestore, "auth"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

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

// FORGOT PASSWORD & RESET PASSWORD
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const q = query(collection(firestore, "auth"), where("email", "==", email));

    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}

export async function saveResetToken(
  email: string,
  token: string
): Promise<ServiceResponse> {
  try {
    // Set expiry to 1 hour from now
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
    console.error("Error saving reset token:", error);
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

    // Check if token is expired
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
    console.error("Error verifying reset token:", error);
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
    console.error("Error marking token as used:", error);
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
    // Find user by email
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await updateDoc(userDocRef, {
      password: hashedPassword,
    });

    return {
      status: true,
      statusCode: 200,
      message: "Password berhasil diupdate",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Gagal mengupdate password",
      error,
    };
  }
}

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
    const docRef = doc(firestore, "chilies", id);
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

// FORUM QUESTIONS
export async function addQuestion(
  data: QuestionPayload
): Promise<ServiceResponse> {
  try {
    const questionsCollection = collection(firestore, "questions");
    const docRef = await addDoc(questionsCollection, {
      ...data,
      authorEmail: data.authorEmail || "",
      authorRole: data.authorRole || "user",
      recipientRole: data.recipientRole || "admin",
      createdAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 201,
      message: "Pertanyaan berhasil dikirim",
      data: { id: docRef.id },
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak dapat mengirim pertanyaan",
      error,
    };
  }
}

export async function getQuestions(
  recipientRole?: string,
  authorRole?: string
): Promise<
  ServiceResponse<
    Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      authorName: string;
      authorEmail?: string;
      authorRole?: string;
      recipientRole?: string;
      createdAt: string;
      replies: Array<{
        id: string;
        responderName: string;
        responderRole?: string;
        content: string;
        createdAt: string;
      }>;
    }>
  >
> {
  try {
    let q;
    if (recipientRole && authorRole) {
      // Jika kedua filter ada, gunakan where saja tanpa orderBy untuk menghindari composite index
      q = query(
        collection(firestore, "questions"),
        where("recipientRole", "==", recipientRole),
        where("authorRole", "==", authorRole)
      );
    } else if (recipientRole) {
      q = query(
        collection(firestore, "questions"),
        where("recipientRole", "==", recipientRole)
      );
    } else if (authorRole) {
      q = query(
        collection(firestore, "questions"),
        where("authorRole", "==", authorRole)
      );
    } else {
      q = query(
        collection(firestore, "questions"),
        orderBy("createdAt", "desc")
      );
    }

    const snapshot = await getDocs(q);

    // Sort di memory jika menggunakan where tanpa orderBy
    const sortedDocs = [...snapshot.docs];
    if (recipientRole || authorRole) {
      sortedDocs.sort((a, b) => {
        const aMillis = getMillisecondsFromTimestamp(
          (a.data().createdAt as Timestamp) ?? undefined
        );
        const bMillis = getMillisecondsFromTimestamp(
          (b.data().createdAt as Timestamp) ?? undefined
        );
        return bMillis - aMillis;
      });
    }

    const questionsWithReplies = await Promise.all(
      sortedDocs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const repliesSnapshot = await getDocs(
          collection(firestore, "questions", docSnapshot.id, "replies")
        );
        const replies = repliesSnapshot.docs.map((replyDoc) => {
          const replyData = replyDoc.data();
          return {
            id: replyDoc.id,
            responderName: replyData.responderName || "Admin",
            responderRole: replyData.responderRole || "Admin",
            content: replyData.content,
            createdAt: formatDateFromTimestamp(
              (replyData.createdAt as Timestamp) ?? undefined
            ),
          };
        });

        return {
          id: docSnapshot.id,
          title: data.title,
          content: data.content,
          category: data.category,
          authorName: data.authorName || "Pengguna",
          authorEmail: data.authorEmail || "",
          authorRole: data.authorRole || "user",
          recipientRole: data.recipientRole || "admin",
          createdAt: formatDateFromTimestamp(
            (data.createdAt as Timestamp) ?? undefined
          ),
          replies,
        };
      })
    );

    return {
      status: true,
      statusCode: 200,
      data: questionsWithReplies,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Tidak dapat mengambil data pertanyaan",
      error,
    };
  }
}

export async function getQuestionsByAuthorEmail(email: string): Promise<
  ServiceResponse<
    Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      authorName: string;
      authorEmail?: string;
      authorRole?: string;
      recipientRole?: string;
      createdAt: string;
      replies: Array<{
        id: string;
        responderName: string;
        responderRole?: string;
        content: string;
        createdAt: string;
      }>;
    }>
  >
> {
  try {
    const q = query(
      collection(firestore, "questions"),
      where("authorEmail", "==", email)
    );
    const snapshot = await getDocs(q);

    const sortedDocs = [...snapshot.docs].sort((a, b) => {
      const aMillis = getMillisecondsFromTimestamp(
        (a.data().createdAt as Timestamp) ?? undefined
      );
      const bMillis = getMillisecondsFromTimestamp(
        (b.data().createdAt as Timestamp) ?? undefined
      );
      return bMillis - aMillis;
    });

    const questionsWithReplies = await Promise.all(
      sortedDocs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const repliesSnapshot = await getDocs(
          collection(firestore, "questions", docSnapshot.id, "replies")
        );
        const replies = repliesSnapshot.docs.map((replyDoc) => {
          const replyData = replyDoc.data();
          return {
            id: replyDoc.id,
            responderName: replyData.responderName || "Admin",
            responderRole: replyData.responderRole || "Admin",
            content: replyData.content,
            createdAt: formatDateFromTimestamp(
              (replyData.createdAt as Timestamp) ?? undefined
            ),
          };
        });

        return {
          id: docSnapshot.id,
          title: data.title,
          content: data.content,
          category: data.category,
          authorName: data.authorName || "Pengguna",
          authorEmail: data.authorEmail || "",
          authorRole: data.authorRole || "user",
          recipientRole: data.recipientRole || "admin",
          createdAt: formatDateFromTimestamp(
            (data.createdAt as Timestamp) ?? undefined
          ),
          replies,
        };
      })
    );

    return {
      status: true,
      statusCode: 200,
      data: questionsWithReplies,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Tidak dapat mengambil data pertanyaan pengguna",
      error,
    };
  }
}

export async function addQuestionReply(
  questionId: string,
  data: QuestionReplyPayload
): Promise<ServiceResponse> {
  try {
    const repliesCollection = collection(
      firestore,
      "questions",
      questionId,
      "replies"
    );
    await addDoc(repliesCollection, {
      ...data,
      responderRole: data.responderRole || "Admin",
      createdAt: serverTimestamp(),
    });

    return {
      status: true,
      statusCode: 201,
      message: "Balasan berhasil dikirim",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak dapat mengirim balasan",
      error,
    };
  }
}

export async function getQuestionReplies(questionId: string): Promise<
  ServiceResponse<
    Array<{
      id: string;
      responderName: string;
      responderRole?: string;
      content: string;
      createdAt: string;
    }>
  >
> {
  try {
    const repliesSnapshot = await getDocs(
      collection(firestore, "questions", questionId, "replies")
    );
    const replies = repliesSnapshot.docs.map((replyDoc) => {
      const data = replyDoc.data();
      return {
        id: replyDoc.id,
        responderName: data.responderName || "Admin",
        responderRole: data.responderRole || "Admin",
        content: data.content,
        createdAt: formatDateFromTimestamp(
          (data.createdAt as Timestamp) ?? undefined
        ),
      };
    });

    return {
      status: true,
      statusCode: 200,
      data: replies,
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 500,
      message: "Tidak dapat mengambil balasan pertanyaan",
      error,
    };
  }
}

// DELETE QUESTION & REPLY
export async function deleteQuestion(
  questionId: string
): Promise<ServiceResponse> {
  try {
    const questionDocRef = doc(firestore, "questions", questionId);

    // Hapus semua replies terlebih dahulu
    const repliesSnapshot = await getDocs(
      collection(firestore, "questions", questionId, "replies")
    );

    for (const replyDoc of repliesSnapshot.docs) {
      await deleteDoc(replyDoc.ref);
    }

    // Hapus question
    await deleteDoc(questionDocRef);

    return {
      status: true,
      statusCode: 200,
      message: "Pertanyaan berhasil dihapus",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak dapat menghapus pertanyaan",
      error,
    };
  }
}

export async function deleteQuestionReply(
  questionId: string,
  replyId: string
): Promise<ServiceResponse> {
  try {
    const replyDocRef = doc(
      firestore,
      "questions",
      questionId,
      "replies",
      replyId
    );
    await deleteDoc(replyDocRef);

    return {
      status: true,
      statusCode: 200,
      message: "Balasan berhasil dihapus",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Tidak dapat menghapus balasan",
      error,
    };
  }
}

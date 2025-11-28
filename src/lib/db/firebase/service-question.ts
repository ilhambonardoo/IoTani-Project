"use server";

import {
  addDoc,
  arrayUnion,
  collection,
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
import type {
  ServiceResponse,
  QuestionPayload,
  QuestionReplyPayload,
} from "@/types";
import { formatDateFromTimestamp, getMillisecondsFromTimestamp } from "./utils";

const firestore = getFirestore(app);

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
  authorRole?: string,
  viewerRole?: string
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
        
        // Filter berdasarkan deletedForRoles jika viewerRole ada
        const deletedForRoles = (data.deletedForRoles as string[]) || [];
        if (viewerRole && deletedForRoles.includes(viewerRole)) {
          return null; // Skip pesan yang dihapus untuk role ini
        }
        
        const repliesSnapshot = await getDocs(
          collection(firestore, "questions", docSnapshot.id, "replies")
        );
        const replies = repliesSnapshot.docs
          .map((replyDoc) => {
            const replyData = replyDoc.data();
            // Filter replies berdasarkan deletedForRoles
            const replyDeletedForRoles = (replyData.deletedForRoles as string[]) || [];
            if (viewerRole && replyDeletedForRoles.includes(viewerRole)) {
              return null; // Skip reply yang dihapus untuk role ini
            }
            return {
              id: replyDoc.id,
              responderName: replyData.responderName || "Admin",
              responderRole: replyData.responderRole || "Admin",
              content: replyData.content,
              createdAt: formatDateFromTimestamp(
                (replyData.createdAt as Timestamp) ?? undefined
              ),
              createdAtRaw: replyData.createdAt as Timestamp | undefined,
            };
          })
          .filter((reply) => reply !== null) // Filter out null replies
          .sort((a, b) => {
            const aMillis = getMillisecondsFromTimestamp(a.createdAtRaw);
            const bMillis = getMillisecondsFromTimestamp(b.createdAtRaw);
            return aMillis - bMillis; // Sort ascending (oldest first)
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ createdAtRaw: _, ...reply }) => reply); // Remove createdAtRaw

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

    // Filter out null questions
    const filteredQuestions = questionsWithReplies.filter((q) => q !== null);

    return {
      status: true,
      statusCode: 200,
      data: filteredQuestions,
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
        
        // Filter berdasarkan deletedForRoles untuk user
        const deletedForRoles = (data.deletedForRoles as string[]) || [];
        if (deletedForRoles.includes("user")) {
          return null; // Skip pesan yang dihapus untuk user
        }
        
        const repliesSnapshot = await getDocs(
          collection(firestore, "questions", docSnapshot.id, "replies")
        );
        const replies = repliesSnapshot.docs
          .map((replyDoc) => {
            const replyData = replyDoc.data();
            // Filter replies berdasarkan deletedForRoles untuk user
            const replyDeletedForRoles = (replyData.deletedForRoles as string[]) || [];
            if (replyDeletedForRoles.includes("user")) {
              return null; // Skip reply yang dihapus untuk user
            }
            return {
              id: replyDoc.id,
              responderName: replyData.responderName || "Admin",
              responderRole: replyData.responderRole || "Admin",
              content: replyData.content,
              createdAt: formatDateFromTimestamp(
                (replyData.createdAt as Timestamp) ?? undefined
              ),
              createdAtRaw: replyData.createdAt as Timestamp | undefined,
            };
          })
          .filter((reply) => reply !== null) // Filter out null replies
          .sort((a, b) => {
            const aMillis = getMillisecondsFromTimestamp(a.createdAtRaw);
            const bMillis = getMillisecondsFromTimestamp(b.createdAtRaw);
            return aMillis - bMillis; // Sort ascending (oldest first)
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ createdAtRaw: _, ...reply }) => reply); // Remove createdAtRaw

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

    // Filter out null questions
    const filteredQuestions = questionsWithReplies.filter((q) => q !== null);

    return {
      status: true,
      statusCode: 200,
      data: filteredQuestions,
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
    const replies = repliesSnapshot.docs
      .map((replyDoc) => {
        const data = replyDoc.data();
        return {
          id: replyDoc.id,
          responderName: data.responderName || "Admin",
          responderRole: data.responderRole || "Admin",
          content: data.content,
          createdAt: formatDateFromTimestamp(
            (data.createdAt as Timestamp) ?? undefined
          ),
          createdAtRaw: data.createdAt as Timestamp | undefined,
        };
      })
      .sort((a, b) => {
        const aMillis = getMillisecondsFromTimestamp(a.createdAtRaw);
        const bMillis = getMillisecondsFromTimestamp(b.createdAtRaw);
        return aMillis - bMillis;
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ createdAtRaw: _, ...reply }) => reply);

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
  questionId: string,
  deletedByRole: string
): Promise<ServiceResponse> {
  try {
    const questionDocRef = doc(firestore, "questions", questionId);

    // Tambahkan role ke deletedForRoles array alih-alih menghapus document
    await updateDoc(questionDocRef, {
      deletedForRoles: arrayUnion(deletedByRole),
    });

    // Hapus semua replies untuk role ini juga
    const repliesSnapshot = await getDocs(
      collection(firestore, "questions", questionId, "replies")
    );

    for (const replyDoc of repliesSnapshot.docs) {
      const replyData = replyDoc.data();
      const deletedForRoles = (replyData.deletedForRoles as string[]) || [];
      if (!deletedForRoles.includes(deletedByRole)) {
        await updateDoc(replyDoc.ref, {
          deletedForRoles: arrayUnion(deletedByRole),
        });
      }
    }

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
  replyId: string,
  deletedByRole: string
): Promise<ServiceResponse> {
  try {
    const replyDocRef = doc(
      firestore,
      "questions",
      questionId,
      "replies",
      replyId
    );
    
    // Tambahkan role ke deletedForRoles array alih-alih menghapus document
    await updateDoc(replyDocRef, {
      deletedForRoles: arrayUnion(deletedByRole),
    });

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


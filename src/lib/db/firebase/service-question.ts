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


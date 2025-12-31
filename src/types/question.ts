export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
}

export interface QuestionMessage {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
  createdAt: string;
  replies?: QuestionReply[];
}

export interface QuestionReply {
  id: string;
  responderName: string;
  responderRole?: string;
  content: string;
  createdAt: string;
}

export interface QuestionThread {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  authorName?: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
  replies: QuestionReply[];
}

export interface QuestionPayload {
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  recipientRole?: string;
}

export interface QuestionFormData {
  title: string;
  category: string;
  content: string;
  recipientRole: string;
}

export interface QuestionReplyPayload {
  responderName: string;
  responderRole?: string;
  content: string;
}

export interface ChatBubble {
  id: string;
  sender: "user" | "admin" | "owner";
  content: string;
  timestamp: string;
  senderLabel: string;
  replyId?: string;
}
